import React from 'react'
import useEditorStore from '@/store/editorStore'
import { cn } from '@/lib/utils'

const solidColors = [
  { color: '#ffffff', name: 'White' },
  { color: '#1e3a5f', name: 'Navy' },
  { color: '#1a1a1a', name: 'Charcoal' },
  { color: '#065f46', name: 'Forest' },
  { color: '#0f172a', name: 'Midnight' },
  { color: '#fdf2f8', name: 'Blush' },
  { color: '#fef3c7', name: 'Cream' },
  { color: '#f0f9ff', name: 'Sky' },
  { color: '#4F46E5', name: 'Indigo' },
  { color: '#7C3AED', name: 'Violet' },
  { color: '#DB2777', name: 'Pink' },
  { color: '#DC2626', name: 'Red' },
]

const gradients = [
  { label: 'Ocean', from: '#667eea', to: '#764ba2' },
  { label: 'Sunset', from: '#f093fb', to: '#f5576c' },
  { label: 'Midnight', from: '#0f0c29', to: '#302b63' },
  { label: 'Forest', from: '#134e5e', to: '#71b280' },
  { label: 'Gold', from: '#f7971e', to: '#ffd200' },
  { label: 'Ice', from: '#a8edea', to: '#fed6e3' },
]

export default function BackgroundPanel() {
  const { canvasBg, setCanvasBg, canvas } = useEditorStore()

  const applyGradient = async (from, to) => {
    if (!canvas) return
    const { fabric } = await import('fabric')
    const gradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords: { x1: 0, y1: 0, x2: canvas.width, y2: canvas.height },
      colorStops: [
        { offset: 0, color: from },
        { offset: 1, color: to },
      ],
    })
    canvas.setBackgroundColor(gradient, () => canvas.renderAll())
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Background</h2>
      </div>

      <div className="p-4 overflow-auto flex-1 space-y-5">
        <div>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Solid Colors</p>
          <div className="grid grid-cols-4 gap-2">
            {solidColors.map(({ color, name }) => (
              <button
                key={color}
                onClick={() => setCanvasBg(color)}
                className={cn(
                  'flex flex-col items-center gap-1 group',
                )}
                title={name}
              >
                <div
                  className={cn(
                    'w-full aspect-square rounded-xl border-2 transition-all hover:scale-105',
                    canvasBg === color ? 'border-indigo-500 shadow-md' : 'border-gray-100 hover:border-indigo-200'
                  )}
                  style={{ background: color }}
                />
                <span className="text-[9px] text-gray-400">{name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Gradients</p>
          <div className="grid grid-cols-3 gap-2">
            {gradients.map(({ label, from, to }) => (
              <button
                key={label}
                onClick={() => applyGradient(from, to)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-full aspect-video rounded-xl border-2 border-transparent hover:border-indigo-300 transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                />
                <span className="text-[9px] text-gray-400">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Custom Color</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={canvasBg.startsWith('#') ? canvasBg : '#ffffff'}
              onChange={(e) => setCanvasBg(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-gray-200"
            />
            <div className="flex-1">
              <input
                type="text"
                value={canvasBg}
                onChange={(e) => setCanvasBg(e.target.value)}
                placeholder="#ffffff"
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
