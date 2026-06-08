import React, { useEffect, useRef, useCallback } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import useEditorStore from '@/store/editorStore'
import { buildCard } from '@/utils/canvasHelpers'
import { addImageToCanvas } from '@/utils/imageHelpers'
import { isLogoCircle, replaceLogoWithFile } from '@/utils/logoHelpers'
import { templates } from '@/templates'

export default function Canvas() {
  const canvasRef    = useRef(null)
  const fabricRef    = useRef(null)
  const fabricLibRef = useRef(null)   // cached fabric module — avoids async re-import
  const containerRef  = useRef(null)
  const imageInputRef = useRef(null)
  const logoInputRef  = useRef(null)
  const initializedRef = useRef(false)

  const {
    setCanvas,
    activeTool,
    selectedTemplate,
    currentSide,
    setCurrentSide,
    frontJSON, setFrontJSON,
    backJSON,  setBackJSON,
    resetSideJSON,
    zoom, setZoom,
    cardWidth, cardHeight,
    setCardDimensions,
    setLayers,
    setSelectedObjects,
    setSelectedObjectProps,
    pushHistory,
  } = useEditorStore()

  const syncLayers = useCallback((fabricCanvas) => {
    const layers = fabricCanvas.getObjects()
      .map((obj, i) => ({
        id:      obj.__uid || `layer-${i}`,
        name:    obj.name || obj.type || `Layer ${i + 1}`,
        type:    obj.type,
        visible: obj.visible !== false,
        locked:  !!obj.lockMovementX,
        index:   i,
      }))
      .reverse()
    setLayers(layers)
  }, [setLayers])

  // ─── Init Fabric canvas ──────────────────────────────────────────────────
  useEffect(() => {
    let fabricCanvas = null
    let unsubTemplate = null

    const initCanvas = async () => {
      const { fabric } = await import('fabric')

      fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 900,
        height: 540,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        selection: true,
        renderOnAddRemove: true,
      })

      // Stamp unique IDs on every object
      const originalAdd = fabricCanvas.add.bind(fabricCanvas)
      fabricCanvas.add = (...objects) => {
        objects.forEach((obj) => { if (!obj.__uid) obj.__uid = Math.random().toString(36).slice(2, 11) })
        return originalAdd(...objects)
      }

      fabricRef.current    = fabricCanvas
      fabricLibRef.current = fabric   // cache so effects never re-import
      setCanvas(fabricCanvas)

      // Build whichever template is currently selected in the store
      const initialTemplate = useEditorStore.getState().selectedTemplate
      buildCard(fabricCanvas, fabric, initialTemplate, 'front')
      useEditorStore.getState().setCanvasBgSilent(fabricCanvas.backgroundColor)
      syncLayers(fabricCanvas)
      pushHistory(fabricCanvas.toJSON(['name', 'locked', '__uid']))
      initializedRef.current = true

      // ── Subscribe to template changes via Zustand ────────────────────────
      // Using subscribe() instead of useEffect([selectedTemplate]) because
      // React StrictMode double-invokes effects with async init, causing a
      // timing window where fabricRef may be null when the effect fires.
      // Zustand subscribe is synchronous and always sees the current ref value.
      unsubTemplate = useEditorStore.subscribe((state, prevState) => {
        if (state.selectedTemplate === prevState.selectedTemplate) return

        const canvas = fabricRef.current
        const fab    = fabricLibRef.current
        if (!canvas || !fab) return

        const newTemplate = state.selectedTemplate
        const tmpl        = templates.find(t => t.id === newTemplate)
        const isVertical  = tmpl?.orientation === 'vertical'
        const W = isVertical ? 540 : 900
        const H = isVertical ? 900 : 540

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
        canvas.setWidth(W)
        canvas.setHeight(H)

        const store = useEditorStore.getState()
        store.setCardDimensions(W, H)
        store.resetSideJSON()
        store.setCurrentSide('front')

        const bgColor = buildCard(canvas, fab, newTemplate, 'front')
        store.setCanvasBgSilent(bgColor || canvas.backgroundColor)
        syncLayers(canvas)
        pushHistory(canvas.toJSON(['name', 'locked', '__uid']))

        const container = containerRef.current
        const pad    = 80
        const availW = container ? container.clientWidth  - pad : W
        const availH = container ? container.clientHeight - pad : H
        const fitScale = Math.min(availW / W, availH / H, 1)
        const newZoom  = Math.max(25, Math.round(fitScale * 100))
        const s = newZoom / 100
        store.setZoom(newZoom)
        canvas.setViewportTransform([s, 0, 0, s, 0, 0])
        canvas.setWidth(W  * s)
        canvas.setHeight(H * s)
        canvas.renderAll()
      })

      // ── Events ────────────────────────────────────────────────────────

      const handleSelection = () => {
        const objs = fabricCanvas.getActiveObjects()
        setSelectedObjects(objs)
        if (objs.length === 1) {
          const obj = objs[0]
          setSelectedObjectProps({
            type: obj.type,
            left: Math.round(obj.left),
            top: Math.round(obj.top),
            width: Math.round(obj.getScaledWidth()),
            height: Math.round(obj.getScaledHeight()),
            angle: Math.round(obj.angle),
            opacity: obj.opacity,
            fill: obj.fill,
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth,
            fontSize: obj.fontSize,
            fontFamily: obj.fontFamily,
            fontWeight: obj.fontWeight,
            fontStyle: obj.fontStyle,
            textAlign: obj.textAlign,
            charSpacing: obj.charSpacing,
            name: obj.name,
          })
        } else {
          setSelectedObjectProps(null)
        }
      }

      fabricCanvas.on('selection:created', handleSelection)
      fabricCanvas.on('selection:updated', handleSelection)
      fabricCanvas.on('selection:cleared', () => {
        setSelectedObjects([])
        setSelectedObjectProps(null)
      })

      fabricCanvas.on('mouse:dblclick', (opt) => {
        const target = opt.target
        if (!target) return
        if (target.type === 'i-text' || target.type === 'text') {
          fabricCanvas.setActiveObject(target)
          target.enterEditing()
          target.selectAll()
          fabricCanvas.renderAll()
        } else if (isLogoCircle(target)) {
          // Double-clicking a logo placeholder opens the logo file picker
          fabricCanvas.setActiveObject(target)
          if (logoInputRef.current) logoInputRef.current.click()
        }
      })

      fabricCanvas.on('object:modified', () => {
        syncLayers(fabricCanvas)
        pushHistory(fabricCanvas.toJSON(['name', 'locked', '__uid']))
      })
      fabricCanvas.on('object:added',   () => syncLayers(fabricCanvas))
      fabricCanvas.on('object:removed', () => syncLayers(fabricCanvas))
    }

    initCanvas()

    return () => {
      if (unsubTemplate) unsubTemplate()
      initializedRef.current = false
      if (fabricRef.current) {
        fabricRef.current.dispose()
        fabricRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Tool change ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = fabricRef.current
    const fabric = fabricLibRef.current
    if (!canvas || !fabric) return

    canvas.isDrawingMode = false
      canvas.selection = true
      canvas.defaultCursor = 'default'
      canvas.hoverCursor = 'move'
      canvas.off('mouse:down')
      canvas.off('mouse:move')
      canvas.off('mouse:up')

      switch (activeTool) {
        case 'select':
          break

        case 'hand':
          canvas.selection = false
          canvas.defaultCursor = 'grab'
          canvas.hoverCursor = 'grab'
          break

        case 'pen':
          canvas.isDrawingMode = true
          canvas.freeDrawingBrush.width = 2
          canvas.freeDrawingBrush.color = '#000000'
          break

        case 'text': {
          canvas.selection = false
          canvas.defaultCursor = 'text'
          canvas.on('mouse:down', (opt) => {
            if (opt.target) return
            const pointer = canvas.getPointer(opt.e)
            const t = new fabric.IText('Click to edit', {
              left: pointer.x, top: pointer.y,
              fontSize: 20, fill: '#1f2937',
              fontFamily: 'Inter, sans-serif', name: 'Text',
            })
            canvas.add(t)
            canvas.setActiveObject(t)
            t.enterEditing()
            canvas.renderAll()
          })
          break
        }

        case 'rect': {
          canvas.selection = false
          canvas.defaultCursor = 'crosshair'
          let drawing = false, sx, sy, rect
          canvas.on('mouse:down', (opt) => {
            if (opt.target) return
            drawing = true
            const p = canvas.getPointer(opt.e)
            sx = p.x; sy = p.y
            rect = new fabric.Rect({ left: sx, top: sy, width: 0, height: 0,
              fill: 'rgba(79,70,229,0.2)', stroke: '#4F46E5', strokeWidth: 1, rx: 4, name: 'Rectangle' })
            canvas.add(rect)
          })
          canvas.on('mouse:move', (opt) => {
            if (!drawing) return
            const p = canvas.getPointer(opt.e)
            rect.set({ width: Math.abs(p.x - sx), height: Math.abs(p.y - sy), left: Math.min(p.x, sx), top: Math.min(p.y, sy) })
            canvas.renderAll()
          })
          canvas.on('mouse:up', () => { drawing = false; canvas.setActiveObject(rect) })
          break
        }

        case 'circle': {
          canvas.selection = false
          canvas.defaultCursor = 'crosshair'
          let drawingC = false, sxC, syC, ellipse
          canvas.on('mouse:down', (opt) => {
            if (opt.target) return
            drawingC = true
            const p = canvas.getPointer(opt.e)
            sxC = p.x; syC = p.y
            ellipse = new fabric.Ellipse({ left: sxC, top: syC, rx: 0, ry: 0,
              fill: 'rgba(79,70,229,0.2)', stroke: '#4F46E5', strokeWidth: 1, name: 'Ellipse' })
            canvas.add(ellipse)
          })
          canvas.on('mouse:move', (opt) => {
            if (!drawingC) return
            const p = canvas.getPointer(opt.e)
            ellipse.set({ rx: Math.abs(p.x - sxC) / 2, ry: Math.abs(p.y - syC) / 2,
              left: Math.min(p.x, sxC), top: Math.min(p.y, syC) })
            canvas.renderAll()
          })
          canvas.on('mouse:up', () => { drawingC = false; canvas.setActiveObject(ellipse) })
          break
        }

        case 'line': {
          canvas.selection = false
          canvas.defaultCursor = 'crosshair'
          let drawingL = false, lineObj, sxL, syL
          canvas.on('mouse:down', (opt) => {
            if (opt.target) return
            drawingL = true
            const p = canvas.getPointer(opt.e)
            sxL = p.x; syL = p.y
            lineObj = new fabric.Line([sxL, syL, sxL, syL], { stroke: '#4F46E5', strokeWidth: 2, name: 'Line' })
            canvas.add(lineObj)
          })
          canvas.on('mouse:move', (opt) => {
            if (!drawingL) return
            const p = canvas.getPointer(opt.e)
            lineObj.set({ x2: p.x, y2: p.y })
            canvas.renderAll()
          })
          canvas.on('mouse:up', () => { drawingL = false; canvas.setActiveObject(lineObj) })
          break
        }

        case 'image':
          canvas.selection = false
          canvas.defaultCursor = 'copy'
          if (imageInputRef.current) imageInputRef.current.click()
          break

        case 'qr':
          useEditorStore.getState().setActiveSidebarItem('qrcode')
          useEditorStore.getState().setActiveTool('select')
          canvas.selection = true
          break

        default:
          break
      }
  }, [activeTool])

  // ─── Zoom ────────────────────────────────────────────────────────────────
  const handleZoom = (delta) => {
    const newZoom = Math.max(25, Math.min(200, zoom + delta))
    setZoom(newZoom)
    const fc = fabricRef.current
    if (fc) {
      const { cardWidth: cW, cardHeight: cH } = useEditorStore.getState()
      const scale = newZoom / 100
      // Reset viewport transform first so zoom is always relative to origin
      fc.setViewportTransform([scale, 0, 0, scale, 0, 0])
      fc.setWidth(cW  * scale)
      fc.setHeight(cH * scale)
    }
  }

  // ─── Side toggle ─────────────────────────────────────────────────────────
  const handleSideChange = (newSide) => {
    const canvas = fabricRef.current
    const fabric = fabricLibRef.current
    if (!canvas || !fabric || !initializedRef.current || newSide === currentSide) return

    const store = useEditorStore.getState()

    // Capture current canvas state into the current side's JSON slot
    const json = canvas.toJSON(['name', 'locked', '__uid'])
    if (currentSide === 'front') store.setFrontJSON(json)
    else                          store.setBackJSON(json)

    // Load the other side (from saved JSON, or build the default)
    const savedJSON = newSide === 'front' ? store.frontJSON : store.backJSON

    if (savedJSON) {
      canvas.loadFromJSON(savedJSON, () => {
        canvas.renderAll()
        syncLayers(canvas)
      })
    } else {
      const bgColor = buildCard(canvas, fabric, store.selectedTemplate, newSide)
      store.setCanvasBgSilent(bgColor || canvas.backgroundColor)
      syncLayers(canvas)
      pushHistory(canvas.toJSON(['name', 'locked', '__uid']))
    }

    setCurrentSide(newSide)
  }

  // ─── Image file input ────────────────────────────────────────────────────
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      await addImageToCanvas(fabricRef.current, ev.target.result, { name: file.name })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
    useEditorStore.getState().setActiveTool('select')
  }

  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return
    await replaceLogoWithFile(fabricRef.current, file)
    e.target.value = ''
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Image tool file picker */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleImageFileChange}
      />
      {/* Logo replacement picker (triggered by dblclick on logo circles) */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleLogoFileChange}
      />

      {/* Front / Back side toggle */}
      <div className="flex items-center justify-center gap-0 py-2.5 bg-white border-b border-gray-100 shrink-0">
        <span className="text-xs text-gray-400 mr-3 font-medium">Card Side:</span>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {['front', 'back'].map((side) => (
            <button
              key={side}
              onClick={() => handleSideChange(side)}
              className={`px-5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                currentSide === side
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {side === 'front' ? 'Front' : 'Back'}
            </button>
          ))}
        </div>
        {currentSide === 'back' && (
          <span className="ml-3 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
            Editing Back Side
          </span>
        )}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white rounded-xl shadow-lg border border-gray-100 px-2 py-1.5">
        <button
          onClick={() => handleZoom(-10)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ZoomOut size={15} />
        </button>
        <span className="text-xs font-medium text-gray-700 w-12 text-center">{zoom}%</span>
        <button
          onClick={() => handleZoom(10)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ZoomIn size={15} />
        </button>
      </div>

      {/* Workspace */}
      <div
        ref={containerRef}
        className="flex-1 canvas-workspace overflow-auto relative"
        style={{ background: '#f1f5f9' }}
      >
        <div className="min-h-full min-w-full flex items-center justify-center p-10">
          <div
            className="relative shadow-2xl"
            style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)' }}
          >
            <canvas ref={canvasRef} className="block" />
          </div>
        </div>
      </div>
    </div>
  )
}
