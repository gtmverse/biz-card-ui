import React, { useState, useRef } from 'react'
import {
  MousePointer2,
  Hand,
  Square,
  Circle,
  Minus,
  PenLine,
  Type,
  ImageIcon,
  QrCode,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignLeft as AlignLeftIcon,
  Group,
  Lock,
  Trash2,
  Undo2,
  Redo2,
  Eye,
  Save,
  Download,
  ChevronDown,
  Ungroup,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useEditorStore from '@/store/editorStore'
import { cn } from '@/lib/utils'
import { downloadCanvas } from '@/utils/downloadHelpers'

const drawingTools = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'hand', icon: Hand, label: 'Hand (H)' },
  { id: 'rect', icon: Square, label: 'Rectangle (R)' },
  { id: 'circle', icon: Circle, label: 'Circle (C)' },
  { id: 'line', icon: Minus, label: 'Line (L)' },
  { id: 'pen', icon: PenLine, label: 'Pen (P)' },
  { id: 'text', icon: Type, label: 'Text (T)' },
  { id: 'image', icon: ImageIcon, label: 'Image (I)' },
  { id: 'qr', icon: QrCode, label: 'QR Code (Q)' },
]

function ToolButton({ tool, active, onClick }) {
  const Icon = tool.icon
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          onClick={() => onClick(tool.id)}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150',
            active
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/15'
              : 'text-slate-500 hover:bg-slate-55 hover:text-slate-900'
          )}
        >
          <Icon size={16} />
        </button>
      </TooltipTrigger>
      <TooltipContent>{tool.label}</TooltipContent>
    </Tooltip>
  )
}

export default function Toolbar() {
  const {
    activeTool,
    setActiveTool,
    canvas,
    undo,
    redo,
    previewMode,
    setPreviewMode,
    currentSide,
    user,
    setAuthModalOpen,
  } = useEditorStore()
  const [dlOpen, setDlOpen] = useState(false)
  const dlRef = useRef(null)

  const handleDeleteSelected = () => {
    if (!canvas) return
    const active = canvas.getActiveObjects()
    active.forEach((obj) => canvas.remove(obj))
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  const handleLockSelected = () => {
    if (!canvas) return
    const active = canvas.getActiveObjects()
    active.forEach((obj) => {
      const locked = !obj.lockMovementX
      obj.set({
        lockMovementX: locked,
        lockMovementY: locked,
        lockRotation: locked,
        lockScalingX: locked,
        lockScalingY: locked,
        selectable: !locked,
        hoverCursor: locked ? 'default' : 'move',
      })
    })
    canvas.renderAll()
  }

  const handleAlign = (direction) => {
    if (!canvas) return
    const active = canvas.getActiveObjects()
    if (!active.length) return
    // Use logical card dimensions from the store, not canvas.width/height which
    // reflect the zoomed element size at auto-fit zoom levels
    const { cardWidth: canvasW, cardHeight: canvasH } = useEditorStore.getState()
    active.forEach((obj) => {
      const w = obj.getScaledWidth()
      const h = obj.getScaledHeight()
      if (direction === 'centerH') obj.set('left', canvasW / 2 - w / 2)
      if (direction === 'centerV') obj.set('top', canvasH / 2 - h / 2)
      if (direction === 'left') obj.set('left', 0)
      if (direction === 'right') obj.set('left', canvasW - w)
      if (direction === 'top') obj.set('top', 0)
      if (direction === 'bottom') obj.set('top', canvasH - h)
      obj.setCoords()
    })
    canvas.renderAll()
  }

  const handleGroup = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active || active.type !== 'activeSelection') return
    active.toGroup()
    canvas.requestRenderAll()
  }

  const handleUngroup = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active || active.type !== 'group') return
    active.toActiveSelection()
    canvas.requestRenderAll()
  }

  const handleSave = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    if (!canvas) return
    const json = JSON.stringify(canvas.toJSON(['name', 'locked']))
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bizcard-design.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownload = (format) => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    downloadCanvas(canvas, format)
  }

  return (
    <div className="flex items-center gap-2 px-6 py-2 bg-white border-b border-slate-100 shadow-sm z-15 shrink-0">
      {/* Drawing Tools */}
      <div className="flex items-center gap-0.5">
        {drawingTools.map((tool) => (
          <ToolButton
            key={tool.id}
            tool={tool}
            active={activeTool === tool.id}
            onClick={setActiveTool}
          />
        ))}
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-slate-100" />

      {/* Align Tools */}
      <div className="flex items-center gap-0.5">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleAlign('centerH')}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              <AlignHorizontalJustifyCenter size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Center Horizontally</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleAlign('centerV')}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              <AlignVerticalJustifyCenter size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Center Vertically</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleAlign('left')}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              <AlignLeftIcon size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-slate-100" />

      {/* Object Tools */}
      <div className="flex items-center gap-0.5">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={handleGroup}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              <Group size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Group</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={handleUngroup}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              <Ungroup size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Ungroup</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={handleLockSelected}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              <Lock size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Lock/Unlock</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={handleDeleteSelected}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <Trash2 size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-slate-100" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={undo}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              <Undo2 size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Undo (⌘Z)</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={redo}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              <Redo2 size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
        </Tooltip>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm"
          onClick={() => setPreviewMode(!previewMode)}
        >
          <Eye size={13} />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm"
          onClick={handleSave}
        >
          <Save size={13} />
          Save Project
        </Button>
        
        <div className="relative flex rounded-lg overflow-hidden shadow-sm" ref={dlRef}>
          <Button
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-none border-r border-indigo-500 pr-3 transition-all"
            onClick={() => handleDownload('png')}
          >
            <Download size={13} />
            Download {currentSide === 'back' ? 'Back' : 'Front'}
          </Button>
          <button
            className="h-8 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg border-l border-indigo-500 transition-all flex items-center justify-center"
            onClick={() => setDlOpen((v) => !v)}
          >
            <ChevronDown size={12} />
          </button>
          {dlOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50 min-w-[160px]"
              onBlur={() => setDlOpen(false)}
            >
              {[
                ['PNG', 'png'],
                ['JPEG', 'jpg'],
                ['SVG', 'svg'],
                ['PDF', 'pdf'],
              ].map(([label, fmt]) => (
                <button
                  key={fmt}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-semibold transition-all"
                  onClick={() => { handleDownload(fmt); setDlOpen(false) }}
                >
                  Download as {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

