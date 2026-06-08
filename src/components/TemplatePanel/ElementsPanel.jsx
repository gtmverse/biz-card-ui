import React from 'react'
import useEditorStore from '@/store/editorStore'

const shapes = [
  { id: 'rect', label: 'Rectangle', emoji: '▭' },
  { id: 'rounded-rect', label: 'Rounded Rect', emoji: '▢' },
  { id: 'circle', label: 'Circle', emoji: '●' },
  { id: 'triangle', label: 'Triangle', emoji: '▲' },
  { id: 'star', label: 'Star', emoji: '★' },
  { id: 'line', label: 'Line', emoji: '—' },
  { id: 'arrow', label: 'Arrow', emoji: '→' },
  { id: 'diamond', label: 'Diamond', emoji: '◆' },
]

const colors = [
  '#4F46E5', '#7C3AED', '#DB2777', '#DC2626',
  '#EA580C', '#D97706', '#16A34A', '#0891B2',
  '#1D4ED8', '#374151', '#6B7280', '#000000',
]

export default function ElementsPanel() {
  const { canvas } = useEditorStore()

  const addShape = async (shapeId) => {
    if (!canvas) return
    const { fabric } = await import('fabric')

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    let obj

    switch (shapeId) {
      case 'rect':
        obj = new fabric.Rect({ left: centerX - 60, top: centerY - 40, width: 120, height: 80, fill: '#4F46E5', rx: 0, name: 'Rectangle' })
        break
      case 'rounded-rect':
        obj = new fabric.Rect({ left: centerX - 60, top: centerY - 40, width: 120, height: 80, fill: '#4F46E5', rx: 12, ry: 12, name: 'Rounded Rect' })
        break
      case 'circle':
        obj = new fabric.Circle({ left: centerX - 50, top: centerY - 50, radius: 50, fill: '#4F46E5', name: 'Circle' })
        break
      case 'triangle':
        obj = new fabric.Triangle({ left: centerX - 50, top: centerY - 50, width: 100, height: 100, fill: '#4F46E5', name: 'Triangle' })
        break
      case 'star': {
        const points = []
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2
          const r = i % 2 === 0 ? 50 : 25
          points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r })
        }
        obj = new fabric.Polygon(points, { left: centerX - 50, top: centerY - 50, fill: '#F59E0B', name: 'Star' })
        break
      }
      case 'line':
        obj = new fabric.Line([centerX - 80, centerY, centerX + 80, centerY], { stroke: '#4F46E5', strokeWidth: 3, name: 'Line' })
        break
      case 'arrow':
        obj = new fabric.Text('→', { left: centerX - 20, top: centerY - 20, fontSize: 40, fill: '#4F46E5', name: 'Arrow' })
        break
      case 'diamond':
        obj = new fabric.Polygon(
          [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }],
          { left: centerX - 50, top: centerY - 50, fill: '#4F46E5', name: 'Diamond' }
        )
        break
      default:
        return
    }

    canvas.add(obj)
    canvas.setActiveObject(obj)
    canvas.renderAll()
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Elements</h2>
      </div>
      <div className="p-4 overflow-auto flex-1">
        <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Shapes</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => addShape(shape.id)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{shape.emoji}</span>
              <span className="text-[9px] text-gray-500 text-center leading-tight">{shape.label}</span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Color Palette</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-gray-300 hover:scale-110 transition-all"
              style={{ background: color }}
              onClick={() => {
                if (!canvas) return
                const active = canvas.getActiveObjects()
                active.forEach((obj) => obj.set('fill', color))
                canvas.renderAll()
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
