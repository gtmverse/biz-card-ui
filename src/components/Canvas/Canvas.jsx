import React, { useEffect, useRef, useCallback } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import useEditorStore from '@/store/editorStore'
import { buildDefaultCard } from '@/utils/canvasHelpers'
import { addImageToCanvas } from '@/utils/imageHelpers'

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 540

export default function Canvas() {
  const canvasRef = useRef(null)
  const fabricRef = useRef(null)
  const containerRef = useRef(null)
  const imageInputRef = useRef(null)
  const {
    setCanvas,
    activeTool,
    zoom,
    setZoom,
    setLayers,
    setSelectedObjects,
    setSelectedObjectProps,
    pushHistory,
  } = useEditorStore()

  const syncLayers = useCallback((fabricCanvas) => {
    const objects = fabricCanvas.getObjects()
    const layers = objects
      .map((obj, i) => ({
        id: obj.__uid || `layer-${i}`,
        name: obj.name || obj.type || `Layer ${i + 1}`,
        type: obj.type,
        visible: obj.visible !== false,
        locked: !!obj.lockMovementX,
        index: i,
      }))
      .reverse()
    setLayers(layers)
  }, [setLayers])

  useEffect(() => {
    let fabricCanvas = null

    const initCanvas = async () => {
      const { fabric } = await import('fabric')

      fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        selection: true,
        renderOnAddRemove: true,
      })

      // Assign unique IDs to objects
      const originalAdd = fabricCanvas.add.bind(fabricCanvas)
      fabricCanvas.add = (...objects) => {
        objects.forEach((obj) => {
          if (!obj.__uid) {
            obj.__uid = Math.random().toString(36).substr(2, 9)
          }
        })
        return originalAdd(...objects)
      }

      fabricRef.current = fabricCanvas
      setCanvas(fabricCanvas)

      // Build default card
      await buildDefaultCard(fabricCanvas, fabric)
      syncLayers(fabricCanvas)
      pushHistory(fabricCanvas.toJSON(['name', 'locked', '__uid']))

      // Event: selection
      fabricCanvas.on('selection:created', (e) => {
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
      })

      fabricCanvas.on('selection:updated', (e) => {
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
        }
      })

      fabricCanvas.on('selection:cleared', () => {
        setSelectedObjects([])
        setSelectedObjectProps(null)
      })

      // Double-click to enter text editing
      fabricCanvas.on('mouse:dblclick', (opt) => {
        const target = opt.target
        if (target && (target.type === 'i-text' || target.type === 'text')) {
          fabricCanvas.setActiveObject(target)
          target.enterEditing()
          target.selectAll()
          fabricCanvas.renderAll()
        }
      })

      // Event: object modified — push history
      fabricCanvas.on('object:modified', () => {
        syncLayers(fabricCanvas)
        pushHistory(fabricCanvas.toJSON(['name', 'locked', '__uid']))
      })
      fabricCanvas.on('object:added', () => syncLayers(fabricCanvas))
      fabricCanvas.on('object:removed', () => syncLayers(fabricCanvas))
    }

    initCanvas()

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose()
        fabricRef.current = null
      }
    }
  }, [])

  // Handle tool changes
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    import('fabric').then(({ fabric }) => {
      canvas.isDrawingMode = false
      canvas.selection = true
      canvas.defaultCursor = 'default'
      canvas.hoverCursor = 'move'

      canvas.off('mouse:down')

      switch (activeTool) {
        case 'select':
          canvas.selection = true
          canvas.defaultCursor = 'default'
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

        case 'text':
          canvas.selection = false
          canvas.defaultCursor = 'text'
          canvas.on('mouse:down', (opt) => {
            if (opt.target) return
            const pointer = canvas.getPointer(opt.e)
            const text = new fabric.IText('Click to edit text', {
              left: pointer.x,
              top: pointer.y,
              fontSize: 20,
              fill: '#1f2937',
              fontFamily: 'Inter, sans-serif',
              name: 'Text Layer',
            })
            canvas.add(text)
            canvas.setActiveObject(text)
            text.enterEditing()
            canvas.renderAll()
          })
          break

        case 'rect':
          canvas.selection = false
          canvas.defaultCursor = 'crosshair'
          let isDrawing = false, startX, startY, rect
          canvas.on('mouse:down', (opt) => {
            if (opt.target) return
            isDrawing = true
            const pointer = canvas.getPointer(opt.e)
            startX = pointer.x
            startY = pointer.y
            rect = new fabric.Rect({
              left: startX,
              top: startY,
              width: 0,
              height: 0,
              fill: 'rgba(79, 70, 229, 0.2)',
              stroke: '#4F46E5',
              strokeWidth: 1,
              rx: 4,
              ry: 4,
              name: 'Rectangle',
            })
            canvas.add(rect)
          })
          canvas.on('mouse:move', (opt) => {
            if (!isDrawing) return
            const pointer = canvas.getPointer(opt.e)
            rect.set({
              width: Math.abs(pointer.x - startX),
              height: Math.abs(pointer.y - startY),
              left: Math.min(pointer.x, startX),
              top: Math.min(pointer.y, startY),
            })
            canvas.renderAll()
          })
          canvas.on('mouse:up', () => {
            isDrawing = false
            canvas.setActiveObject(rect)
          })
          break

        case 'circle':
          canvas.selection = false
          canvas.defaultCursor = 'crosshair'
          let isDrawingC = false, startXC, startYC, circle
          canvas.on('mouse:down', (opt) => {
            if (opt.target) return
            isDrawingC = true
            const pointer = canvas.getPointer(opt.e)
            startXC = pointer.x
            startYC = pointer.y
            circle = new fabric.Ellipse({
              left: startXC,
              top: startYC,
              rx: 0,
              ry: 0,
              fill: 'rgba(79, 70, 229, 0.2)',
              stroke: '#4F46E5',
              strokeWidth: 1,
              name: 'Ellipse',
            })
            canvas.add(circle)
          })
          canvas.on('mouse:move', (opt) => {
            if (!isDrawingC) return
            const pointer = canvas.getPointer(opt.e)
            circle.set({
              rx: Math.abs(pointer.x - startXC) / 2,
              ry: Math.abs(pointer.y - startYC) / 2,
              left: Math.min(pointer.x, startXC),
              top: Math.min(pointer.y, startYC),
            })
            canvas.renderAll()
          })
          canvas.on('mouse:up', () => {
            isDrawingC = false
            canvas.setActiveObject(circle)
          })
          break

        case 'image':
          // Trigger a file picker; after file loads, revert to select
          canvas.selection = false
          canvas.defaultCursor = 'copy'
          if (imageInputRef.current) imageInputRef.current.click()
          break

        case 'qr':
          // Switch to QR side panel via sidebar
          useEditorStore.getState().setActiveSidebarItem('qrcode')
          useEditorStore.getState().setActiveTool('select')
          canvas.selection = true
          canvas.defaultCursor = 'default'
          break

        case 'line':
          canvas.selection = false
          canvas.defaultCursor = 'crosshair'
          let isDrawingL = false, lineObj, startXL, startYL
          canvas.on('mouse:down', (opt) => {
            if (opt.target) return
            isDrawingL = true
            const pointer = canvas.getPointer(opt.e)
            startXL = pointer.x
            startYL = pointer.y
            lineObj = new fabric.Line([startXL, startYL, startXL, startYL], {
              stroke: '#4F46E5',
              strokeWidth: 2,
              selectable: true,
              name: 'Line',
            })
            canvas.add(lineObj)
          })
          canvas.on('mouse:move', (opt) => {
            if (!isDrawingL) return
            const pointer = canvas.getPointer(opt.e)
            lineObj.set({ x2: pointer.x, y2: pointer.y })
            canvas.renderAll()
          })
          canvas.on('mouse:up', () => {
            isDrawingL = false
            canvas.setActiveObject(lineObj)
          })
          break

        default:
          break
      }
    })
  }, [activeTool])

  const handleZoom = (delta) => {
    const newZoom = Math.max(25, Math.min(200, zoom + delta))
    setZoom(newZoom)
    if (fabricRef.current) {
      fabricRef.current.setZoom(newZoom / 100)
      fabricRef.current.setWidth(CANVAS_WIDTH * (newZoom / 100))
      fabricRef.current.setHeight(CANVAS_HEIGHT * (newZoom / 100))
    }
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      await addImageToCanvas(fabricRef.current, ev.target.result, { name: file.name })
    }
    reader.readAsDataURL(file)
    // reset so the same file can be picked again
    e.target.value = ''
    useEditorStore.getState().setActiveTool('select')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hidden file input for the image tool */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Zoom Controls */}
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
        className="flex-1 canvas-workspace overflow-auto flex items-center justify-center relative"
        style={{ background: '#f1f5f9' }}
      >
        <div
          className="relative shadow-2xl"
          style={{
            boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)',
          }}
        >
          <canvas ref={canvasRef} className="block" />
        </div>
      </div>
    </div>
  )
}
