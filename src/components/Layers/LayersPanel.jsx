import React, { useState } from 'react'
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Pencil,
  Check,
} from 'lucide-react'
import useEditorStore from '@/store/editorStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const typeIcons = {
  text: '𝐓',
  'i-text': '𝐓',
  rect: '▭',
  circle: '●',
  ellipse: '●',
  image: '🖼',
  path: '✏',
  line: '—',
  group: '⊞',
  default: '◈',
}

function LayerItem({ layer, canvas, onRename }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(layer.name)

  const getObject = () => {
    if (!canvas) return null
    const objects = canvas.getObjects()
    return objects[objects.length - 1 - layer.index] || null
  }

  const handleVisibility = () => {
    const obj = getObject()
    if (!obj) return
    obj.set('visible', !obj.visible)
    canvas.renderAll()
  }

  const handleLock = () => {
    const obj = getObject()
    if (!obj) return
    const locked = !obj.lockMovementX
    obj.set({
      lockMovementX: locked,
      lockMovementY: locked,
      lockRotation: locked,
      lockScalingX: locked,
      lockScalingY: locked,
    })
    canvas.renderAll()
  }

  const handleMoveUp = () => {
    const obj = getObject()
    if (!obj) return
    canvas.bringForward(obj)
    canvas.renderAll()
  }

  const handleMoveDown = () => {
    const obj = getObject()
    if (!obj) return
    canvas.sendBackwards(obj)
    canvas.renderAll()
  }

  const handleSelect = () => {
    const obj = getObject()
    if (!obj) return
    canvas.setActiveObject(obj)
    canvas.renderAll()
  }

  const handleRenameSubmit = () => {
    const obj = getObject()
    if (obj) obj.set('name', name)
    setEditing(false)
    onRename()
  }

  const icon = typeIcons[layer.type] || typeIcons.default

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-lg group cursor-pointer transition-colors hover:bg-gray-50',
        !layer.visible && 'opacity-40'
      )}
      onClick={handleSelect}
    >
      {/* Type icon */}
      <span className="text-sm w-5 text-center flex-shrink-0 text-gray-500">{icon}</span>

      {/* Name */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-xs border border-indigo-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-indigo-400"
          />
        ) : (
          <span className="text-xs text-gray-700 truncate block">{layer.name}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); setEditing(true) }}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400"
        >
          <Pencil size={10} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleMoveUp() }}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400"
        >
          <ChevronUp size={10} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleMoveDown() }}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400"
        >
          <ChevronDown size={10} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleVisibility() }}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400"
        >
          {layer.visible ? <Eye size={10} /> : <EyeOff size={10} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleLock() }}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400"
        >
          {layer.locked ? <Lock size={10} /> : <Unlock size={10} />}
        </button>
      </div>
    </div>
  )
}

export default function LayersPanel() {
  const { layers, canvas, setLayers } = useEditorStore()

  const refreshLayers = () => {
    if (!canvas) return
    const objects = canvas.getObjects()
    const updated = objects
      .map((obj, i) => ({
        id: obj.__uid || `layer-${i}`,
        name: obj.name || obj.type || `Layer ${i + 1}`,
        type: obj.type,
        visible: obj.visible !== false,
        locked: !!obj.lockMovementX,
        index: i,
      }))
      .reverse()
    setLayers(updated)
  }

  if (layers.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-gray-400">No layers yet</p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-0.5">
        {layers.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            canvas={canvas}
            onRename={refreshLayers}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
