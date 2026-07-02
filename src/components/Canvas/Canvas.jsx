import React, { useEffect, useRef, useCallback } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import useEditorStore from '@/store/editorStore'
import { buildCard } from '@/utils/canvasHelpers'
import { addImageToCanvas } from '@/utils/imageHelpers'
import { isLogoCircle, replaceLogoWithFile } from '@/utils/logoHelpers'
import { isAvatarCircle, replaceAvatarWithFile } from '@/utils/avatarHelpers'
import { templates } from '@/templates'
import FloatingToolbar from '@/components/Toolbar/FloatingToolbar'


export default function Canvas() {
  const canvasRef    = useRef(null)
  const fabricRef    = useRef(null)
  const fabricLibRef = useRef(null)   // cached fabric module — avoids async re-import
  const containerRef  = useRef(null)
  const imageInputRef = useRef(null)
  const logoInputRef  = useRef(null)
  const avatarInputRef = useRef(null)
  const initializedRef = useRef(false)
  const builtTemplateRef = useRef(null)  // tracks what's actually drawn on canvas

  const {
    canvas,
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

  // ─── Init Fabric canvas
  useEffect(() => {
    let active = true
    let fabricCanvas = null
    let unsubTemplate = null
    let keydownHandler = null

    const initCanvas = async () => {
      const { fabric } = await import('fabric')
      if (!active) return

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

      // Zoom-to-fit on initialization (defaults to landscape 900x540)
      const container = containerRef.current
      const W = 900
      const H = 540
      const pad    = 130
      const availW = container ? container.clientWidth  - pad : W
      const availH = container ? container.clientHeight - pad : H
      const fitScale = Math.min(availW / W, availH / H, 1)
      const newZoom  = Math.max(25, Math.round(fitScale * 100))
      const s = newZoom / 100
      const store = useEditorStore.getState()
      store.setZoom(newZoom)
      fabricCanvas.setViewportTransform([s, 0, 0, s, 0, 0])
      fabricCanvas.setWidth(W  * s)
      fabricCanvas.setHeight(H * s)
      fabricCanvas.renderAll()

      initializedRef.current = true


      // ── Events

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
        } else if (isAvatarCircle(target)) {
          // Double-clicking an avatar placeholder opens the avatar file picker
          fabricCanvas.setActiveObject(target)
          if (avatarInputRef.current) avatarInputRef.current.click()
        }
      })

      fabricCanvas.on('object:modified', () => {
        handleSelection()
        syncLayers(fabricCanvas)
        pushHistory(fabricCanvas.toJSON(['name', 'locked', '__uid']))
      })
      fabricCanvas.on('text:changed', (opt) => {
        const obj = opt.target
        if (!obj) return
        const fieldName = obj.name?.toLowerCase()
        if (fieldName) {
          const store = useEditorStore.getState()
          let key = fieldName
          if (fieldName === 'alt phone') key = 'altPhone'
          store.setProfileDetail(key, obj.text)
        }
      })
      fabricCanvas.on('object:added',   () => syncLayers(fabricCanvas))
      fabricCanvas.on('object:removed', () => syncLayers(fabricCanvas))

      // ── Keyboard Shortcuts
      let clipboard = null
      
      const handleKeyDown = (e) => {
        // Prevent default actions for shortcuts if we are editing text, unless they are specific commands
        const activeObj = fabricCanvas.getActiveObject()
        const isEditingText = (activeObj && activeObj.isEditing) || 
                              document.activeElement?.tagName === 'INPUT' || 
                              document.activeElement?.tagName === 'TEXTAREA'
        
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
        const cmdCtrl = isMac ? e.metaKey : e.ctrlKey

        // Undo (Cmd/Ctrl + Z)
        if (cmdCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
          e.preventDefault()
          useEditorStore.getState().undo()
          return
        }
        
        // Redo (Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y)
        if ((cmdCtrl && e.shiftKey && e.key.toLowerCase() === 'z') || (cmdCtrl && e.key.toLowerCase() === 'y')) {
          e.preventDefault()
          useEditorStore.getState().redo()
          return
        }

        // If editing text, ignore other shortcuts (let the text editor handle copy/paste/delete)
        if (isEditingText) return

        // Delete / Backspace
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault()
          const activeObjects = fabricCanvas.getActiveObjects()
          if (activeObjects.length > 0) {
            activeObjects.forEach(obj => fabricCanvas.remove(obj))
            fabricCanvas.discardActiveObject()
            fabricCanvas.renderAll()
          }
          return
        }

        // Copy (Cmd/Ctrl + C)
        if (cmdCtrl && e.key.toLowerCase() === 'c') {
          if (activeObj) {
            e.preventDefault()
            activeObj.clone((cloned) => { clipboard = cloned })
          }
          return
        }

        // Paste (Cmd/Ctrl + V)
        if (cmdCtrl && e.key.toLowerCase() === 'v') {
          if (!clipboard) return
          e.preventDefault()
          clipboard.clone((clonedObj) => {
            fabricCanvas.discardActiveObject()
            clonedObj.set({
              left: clonedObj.left + 10,
              top: clonedObj.top + 10,
              evented: true,
            })
            if (clonedObj.type === 'activeSelection') {
              clonedObj.canvas = fabricCanvas
              clonedObj.forEachObject((obj) => {
                fabricCanvas.add(obj)
              })
              clonedObj.setCoords()
            } else {
              fabricCanvas.add(clonedObj)
            }
            clipboard.top += 10
            clipboard.left += 10
            fabricCanvas.setActiveObject(clonedObj)
            fabricCanvas.renderAll()
          })
          return
        }

        // Duplicate (Cmd/Ctrl + D)
        if (cmdCtrl && e.key.toLowerCase() === 'd') {
          if (activeObj) {
            e.preventDefault()
            activeObj.clone((clonedObj) => {
              fabricCanvas.discardActiveObject()
              clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
              })
              if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = fabricCanvas
                clonedObj.forEachObject((obj) => {
                  fabricCanvas.add(obj)
                })
                clonedObj.setCoords()
              } else {
                fabricCanvas.add(clonedObj)
              }
              fabricCanvas.setActiveObject(clonedObj)
              fabricCanvas.renderAll()
            })
          }
          return
        }
        
        // Deselect (Escape)
        if (e.key === 'Escape') {
          fabricCanvas.discardActiveObject()
          fabricCanvas.renderAll()
          return
        }
      }
      keydownHandler = handleKeyDown
      window.addEventListener('keydown', handleKeyDown)
      
      // Cleanup window listener on unmount
      fabricCanvas.on('dispose', () => {
        window.removeEventListener('keydown', handleKeyDown)
      })
    }

    initCanvas()

    return () => {
      active = false
      initializedRef.current = false
      builtTemplateRef.current = null  // reset so next init rebuilds correctly
      if (keydownHandler) {
        window.removeEventListener('keydown', keydownHandler)
      }
      if (unsubTemplate) unsubTemplate()  // stop Zustand subscription
      
      const fc = fabricRef.current || fabricCanvas
      if (fc) {
        try {
          fc.dispose()
        } catch (e) {
          console.warn('Error disposing fabric canvas:', e)
        }
        fabricRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Rebuild canvas template on selectedTemplate change ────────────────────
  useEffect(() => {
    const cv = fabricRef.current
    const fb = fabricLibRef.current
    if (!cv || !fb || !initializedRef.current) return

    const tpl = templates.find(t => t.id === selectedTemplate)
    if (!tpl) return
    const isVert = tpl.orientation === 'vertical'
    const isSquare = tpl.orientation === 'square'
    const W = isSquare ? 720 : (isVert ? 540 : 900)
    const H = isSquare ? 720 : (isVert ? 900 : 540)

    if (builtTemplateRef.current === selectedTemplate) return

    // Reset viewport transform and dimensions before building
    cv.setViewportTransform([1, 0, 0, 1, 0, 0])
    cv.setWidth(W)
    cv.setHeight(H)

    const store = useEditorStore.getState()
    store.setCardDimensions(W, H)
    store.resetSideJSON()
    store.setCurrentSide('front')

    const bg = buildCard(cv, fb, selectedTemplate, 'front')
    builtTemplateRef.current = selectedTemplate
    store.setCanvasBgSilent(bg || cv.backgroundColor)

    // Sync layers and history
    const layers = cv.getObjects().map((obj, i) => ({
      id: obj.__uid || `layer-${i}`,
      name: obj.name || obj.type || `Layer ${i + 1}`,
      type: obj.type,
      visible: obj.visible !== false,
      locked: !!obj.lockMovementX,
      index: i,
    })).reverse()
    store.setLayers(layers)
    store.pushHistory(cv.toJSON(['name', 'locked', '__uid']))

    // Zoom-to-fit
    const container = containerRef.current
    const pad = 80
    const availW = container ? container.clientWidth - pad : W
    const availH = container ? container.clientHeight - pad : H
    const fitScale = Math.min(availW / W, availH / H, 1)
    const newZoom = Math.max(25, Math.round(fitScale * 100))
    const s = newZoom / 100
    store.setZoom(newZoom)
    cv.setViewportTransform([s, 0, 0, s, 0, 0])
    cv.setWidth(W * s)
    cv.setHeight(H * s)
    cv.renderAll()
  }, [canvas, selectedTemplate])


  // ─── Tool change
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
          const t = new fabric.IText('Click to edit', {
            left: canvas.width / 2, 
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 20, fill: '#1f2937',
            fontFamily: 'Inter, sans-serif', name: 'Text',
          })
          canvas.add(t)
          canvas.setActiveObject(t)
          t.enterEditing()
          t.selectAll()
          canvas.renderAll()
          
          // Reset tool
          useEditorStore.getState().setActiveTool('select')
          break
        }

        case 'shape':
        case 'rect': {
          const rect = new fabric.Rect({ 
            left: canvas.width / 2, 
            top: canvas.height / 2, 
            originX: 'center',
            originY: 'center',
            width: 100, 
            height: 100,
            fill: 'rgba(79,70,229,0.2)', 
            stroke: '#4F46E5', 
            strokeWidth: 2, 
            rx: 8, 
            name: 'Rectangle' 
          })
          canvas.add(rect)
          canvas.setActiveObject(rect)
          canvas.renderAll()
          
          // Reset tool
          useEditorStore.getState().setActiveTool('select')
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

  // ─── Zoom 
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

    // Load the other side (re-read from store AFTER saving so we see the latest frontJSON/backJSON)
    const latestStore = useEditorStore.getState()
    const savedJSON = newSide === 'front' ? latestStore.frontJSON : latestStore.backJSON

    const { cardWidth: cW, cardHeight: cH, zoom } = useEditorStore.getState()

    if (savedJSON) {
      // Reset viewport transform and dimensions before loading
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      canvas.setWidth(cW)
      canvas.setHeight(cH)

      canvas.loadFromJSON(savedJSON, () => {
        // Reapply zoom after loading
        const s = zoom / 100
        canvas.setViewportTransform([s, 0, 0, s, 0, 0])
        canvas.setWidth(cW * s)
        canvas.setHeight(cH * s)
        canvas.renderAll()
        syncLayers(canvas)
      })
    } else {
      // IMPORTANT: reset to actual card dimensions before building.
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      canvas.setWidth(cW)
      canvas.setHeight(cH)

      const bgColor = buildCard(canvas, fabric, store.selectedTemplate, newSide)
      store.setCanvasBgSilent(bgColor || canvas.backgroundColor)
      syncLayers(canvas)
      pushHistory(canvas.toJSON(['name', 'locked', '__uid']))

      // Reapply zoom after building
      const s = zoom / 100
      canvas.setViewportTransform([s, 0, 0, s, 0, 0])
      canvas.setWidth(cW * s)
      canvas.setHeight(cH * s)
      canvas.renderAll()
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

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return
    await replaceAvatarWithFile(fabricRef.current, file)
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
      {/* Avatar replacement picker (triggered by dblclick on avatar circles) */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* Unified Bottom Floating Control Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 p-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/80 shrink-0">
        {/* Front / Back Toggle */}
        <div className="flex bg-slate-100/60 p-0.5 rounded-lg border border-slate-200/30">
          {['front', 'back'].map((side) => (
            <button
              key={side}
              onClick={() => handleSideChange(side)}
              className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all duration-200 ${
                currentSide === side
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {side === 'front' ? 'Front' : 'Back'}
            </button>
          ))}
        </div>

        {currentSide === 'back' && (
          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200/50 rounded-lg px-2 py-1 shrink-0">
            Back Side
          </span>
        )}

        <div className="w-px h-5 bg-slate-200" />

        {/* Zoom controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleZoom(-10)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[11px] font-bold text-slate-700 w-10 text-center">{zoom}%</span>
          <button
            onClick={() => handleZoom(10)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div
        ref={containerRef}
        className="canvas-workspace flex-1 overflow-auto relative"
      >
        <FloatingToolbar />
        
        <div className="min-h-full min-w-full flex items-center justify-center p-10 pt-24">
          <div className="fabric-canvas-wrapper relative flex-shrink-0">
            <canvas ref={canvasRef} className="block" />
          </div>
        </div>
      </div>
    </div>
  )
}
