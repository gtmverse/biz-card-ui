import { useEffect, useRef } from 'react'
import useEditorStore from '@/store/editorStore'

export function useCanvas(canvasRef) {
  const fabricRef = useRef(null)
  const { setCanvas, pushHistory, setLayers, setSelectedObjects, setSelectedObjectProps } =
    useEditorStore()

  const syncLayers = (canvas) => {
    const objects = canvas.getObjects()
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
  }

  const extractProps = (obj) => ({
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
    rx: obj.rx,
    shadow: obj.shadow,
    name: obj.name,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    let mounted = true

    const init = async () => {
      const { fabric } = await import('fabric')
      if (!mounted) return

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 900,
        height: 540,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        selection: true,
        renderOnAddRemove: true,
      })

      // Tag new objects with a uid
      const _add = canvas.add.bind(canvas)
      canvas.add = (...objs) => {
        objs.forEach((o) => { if (!o.__uid) o.__uid = Math.random().toString(36).substr(2, 9) })
        return _add(...objs)
      }

      fabricRef.current = canvas
      setCanvas(canvas)

      canvas.on('selection:created', () => {
        const objs = canvas.getActiveObjects()
        setSelectedObjects(objs)
        if (objs.length === 1) setSelectedObjectProps(extractProps(objs[0]))
        else setSelectedObjectProps(null)
      })
      canvas.on('selection:updated', () => {
        const objs = canvas.getActiveObjects()
        setSelectedObjects(objs)
        if (objs.length === 1) setSelectedObjectProps(extractProps(objs[0]))
        else setSelectedObjectProps(null)
      })
      canvas.on('selection:cleared', () => {
        setSelectedObjects([])
        setSelectedObjectProps(null)
      })
      canvas.on('object:modified', () => {
        syncLayers(canvas)
        pushHistory(canvas.toJSON(['name', 'locked', '__uid']))
        const objs = canvas.getActiveObjects()
        if (objs.length === 1) setSelectedObjectProps(extractProps(objs[0]))
      })
      canvas.on('object:added', () => syncLayers(canvas))
      canvas.on('object:removed', () => syncLayers(canvas))
    }

    init()

    return () => {
      mounted = false
      if (fabricRef.current) {
        fabricRef.current.dispose()
        fabricRef.current = null
      }
    }
  }, [])

  return fabricRef
}
