import React, { useState, useRef, useEffect } from 'react'
import {
  MousePointer2, Type, ImageIcon, Shapes, QrCode, LayoutGrid,
  Layers, Sparkles, Trash2, ChevronDown,
  Square, Circle, Triangle, Minus, Star, Diamond, ArrowRight,
  AlignLeft, AlignCenter, AlignRight, AlignCenterVertical, AlignStartVertical, AlignEndVertical,
  BringToFront, SendToBack, MoveUp, MoveDown,
  Sun, Blend, Zap, Minus as BorderIcon, Paintbrush,
  Bold, Italic, Underline, AlignJustify, StretchHorizontal, Maximize2,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useEditorStore from '@/store/editorStore'
import { cn } from '@/lib/utils'

// ─── Shape Panel ─────────────────────────────────────────────────────────────
const SHAPES = [
  { id: 'rect',         label: 'Rectangle',   icon: Square },
  { id: 'rounded-rect', label: 'Rounded Rect', icon: Square },
  { id: 'circle',       label: 'Circle',       icon: Circle },
  { id: 'triangle',     label: 'Triangle',     icon: Triangle },
  { id: 'line',         label: 'Line',         icon: Minus },
  { id: 'star',         label: 'Star',         icon: Star },
  { id: 'diamond',      label: 'Diamond',      icon: Diamond },
  { id: 'arrow',        label: 'Arrow',        icon: ArrowRight },
]

async function addShape(canvas, shapeId) {
  if (!canvas) return
  const { fabric } = await import('fabric')
  const W = canvas.width / (canvas.viewportTransform[0] || 1)
  const H = canvas.height / (canvas.viewportTransform[3] || 1)
  const cx = W / 2, cy = H / 2
  let obj

  switch (shapeId) {
    case 'rect':
      obj = new fabric.Rect({ left: cx - 60, top: cy - 40, width: 120, height: 80, fill: 'rgba(79,70,229,0.15)', stroke: '#4F46E5', strokeWidth: 2, rx: 0, name: 'Rectangle' })
      break
    case 'rounded-rect':
      obj = new fabric.Rect({ left: cx - 60, top: cy - 40, width: 120, height: 80, fill: 'rgba(79,70,229,0.15)', stroke: '#4F46E5', strokeWidth: 2, rx: 14, ry: 14, name: 'Rounded Rect' })
      break
    case 'circle':
      obj = new fabric.Circle({ left: cx - 50, top: cy - 50, radius: 50, fill: 'rgba(79,70,229,0.15)', stroke: '#4F46E5', strokeWidth: 2, name: 'Circle' })
      break
    case 'triangle':
      obj = new fabric.Triangle({ left: cx - 50, top: cy - 50, width: 100, height: 100, fill: 'rgba(79,70,229,0.15)', stroke: '#4F46E5', strokeWidth: 2, name: 'Triangle' })
      break
    case 'line':
      obj = new fabric.Line([cx - 80, cy, cx + 80, cy], { stroke: '#4F46E5', strokeWidth: 3, name: 'Line' })
      break
    case 'star': {
      const pts = []
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2
        const r = i % 2 === 0 ? 50 : 22
        pts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r })
      }
      obj = new fabric.Polygon(pts, { left: cx - 50, top: cy - 50, fill: 'rgba(245,158,11,0.2)', stroke: '#F59E0B', strokeWidth: 2, name: 'Star' })
      break
    }
    case 'diamond':
      obj = new fabric.Polygon(
        [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }],
        { left: cx - 50, top: cy - 50, fill: 'rgba(79,70,229,0.15)', stroke: '#4F46E5', strokeWidth: 2, name: 'Diamond' }
      )
      break
    case 'arrow':
      obj = new fabric.Text('→', { left: cx - 20, top: cy - 20, fontSize: 48, fill: '#4F46E5', name: 'Arrow' })
      break
    default: return
  }

  canvas.add(obj)
  canvas.setActiveObject(obj)
  canvas.renderAll()
}

function ShapePanel({ canvas, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Insert Shape</p>
      <div className="grid grid-cols-4 gap-1.5">
        {SHAPES.map((s) => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              onClick={() => { addShape(canvas, s.id); onClose() }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-all group"
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-[9px] font-medium leading-tight text-center">{s.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Icon Panel ───────────────────────────────────────────────────────────────
const ICONS = [
  { label: 'Email', char: '✉' }, { label: 'Phone', char: '📞' }, { label: 'Location', char: '📍' },
  { label: 'Web', char: '🌐' }, { label: 'LinkedIn', char: '💼' }, { label: 'Twitter', char: '🐦' },
  { label: 'Star', char: '★' }, { label: 'Heart', char: '♥' }, { label: 'Check', char: '✓' },
  { label: 'Arrow', char: '→' }, { label: 'Bolt', char: '⚡' }, { label: 'Crown', char: '♛' },
  { label: 'Diamond', char: '◆' }, { label: 'Circle', char: '●' }, { label: 'Square', char: '■' },
  { label: 'Scissors', char: '✂' },
]

async function addIcon(canvas, char, label) {
  if (!canvas) return
  const { fabric } = await import('fabric')
  const W = canvas.width / (canvas.viewportTransform[0] || 1)
  const H = canvas.height / (canvas.viewportTransform[3] || 1)
  const obj = new fabric.Text(char, {
    left: W / 2, top: H / 2, originX: 'center', originY: 'center',
    fontSize: 36, fill: '#4F46E5', name: label,
  })
  canvas.add(obj)
  canvas.setActiveObject(obj)
  canvas.renderAll()
}

function IconPanel({ canvas, onClose }) {
  const [search, setSearch] = useState('')
  const filtered = ICONS.filter(i => i.label.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Insert Icon</p>
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search icons…"
        className="w-full mb-2 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 text-slate-700"
      />
      <div className="grid grid-cols-4 gap-1.5 max-h-44 overflow-y-auto">
        {filtered.map((icon) => (
          <button
            key={icon.label}
            onClick={() => { addIcon(canvas, icon.char, icon.label); onClose() }}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-all"
          >
            <span className="text-xl leading-none">{icon.char}</span>
            <span className="text-[9px] font-medium leading-tight text-center text-slate-500">{icon.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Arrange Panel ────────────────────────────────────────────────────────────
function ArrangePanel({ canvas, onClose }) {
  const align = (direction) => {
    if (!canvas) return
    const objs = canvas.getActiveObjects()
    if (!objs.length) return
    const canvasW = canvas.width / (canvas.viewportTransform[0] || 1)
    const canvasH = canvas.height / (canvas.viewportTransform[3] || 1)
    objs.forEach(obj => {
      switch (direction) {
        case 'left':   obj.set({ left: 0 }); break
        case 'center': obj.set({ left: canvasW / 2, originX: 'center' }); break
        case 'right':  obj.set({ left: canvasW - obj.getScaledWidth() }); break
        case 'top':    obj.set({ top: 0 }); break
        case 'middle': obj.set({ top: canvasH / 2, originY: 'center' }); break
        case 'bottom': obj.set({ top: canvasH - obj.getScaledHeight() }); break
        default: break
      }
      obj.setCoords()
    })
    canvas.renderAll()
  }

  const layer = (action) => {
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    switch (action) {
      case 'front':  canvas.bringToFront(obj); break
      case 'forward': canvas.bringForward(obj); break
      case 'backward': canvas.sendBackwards(obj); break
      case 'back':   canvas.sendToBack(obj); break
      default: break
    }
    canvas.renderAll()
  }

  const flip = (axis) => {
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    if (axis === 'h') obj.set({ flipX: !obj.flipX })
    else obj.set({ flipY: !obj.flipY })
    canvas.renderAll()
  }

  const group = () => {
    if (!canvas) return
    const objs = canvas.getActiveObjects()
    if (objs.length < 2) return
    canvas.discardActiveObject()
    const { fabric } = window
    if (!fabric) return
    const sel = new fabric.ActiveSelection(objs, { canvas })
    canvas.setActiveObject(sel)
    sel.toGroup()
    canvas.renderAll()
  }

  const btnCls = 'flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-all text-[9px] font-medium'

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Align Objects</p>
      <div className="grid grid-cols-6 gap-1 mb-3">
        <Tooltip><TooltipTrigger asChild><button onClick={() => align('left')} className={btnCls}><AlignLeft size={16}/>Left</button></TooltipTrigger><TooltipContent>Align Left</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button onClick={() => align('center')} className={btnCls}><AlignCenter size={16}/>H. Center</button></TooltipTrigger><TooltipContent>Align Center</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button onClick={() => align('right')} className={btnCls}><AlignRight size={16}/>Right</button></TooltipTrigger><TooltipContent>Align Right</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button onClick={() => align('top')} className={btnCls}><AlignStartVertical size={16}/>Top</button></TooltipTrigger><TooltipContent>Align Top</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button onClick={() => align('middle')} className={btnCls}><AlignCenterVertical size={16}/>V. Center</button></TooltipTrigger><TooltipContent>Align Middle</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button onClick={() => align('bottom')} className={btnCls}><AlignEndVertical size={16}/>Bottom</button></TooltipTrigger><TooltipContent>Align Bottom</TooltipContent></Tooltip>
      </div>

      <div className="h-px bg-slate-100 my-2" />
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Layer Order</p>
      <div className="grid grid-cols-4 gap-1 mb-3">
        <Tooltip><TooltipTrigger asChild><button onClick={() => layer('front')} className={btnCls}><BringToFront size={16}/>To Front</button></TooltipTrigger><TooltipContent>Bring to Front</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button onClick={() => layer('forward')} className={btnCls}><MoveUp size={16}/>Forward</button></TooltipTrigger><TooltipContent>Bring Forward</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button onClick={() => layer('backward')} className={btnCls}><MoveDown size={16}/>Backward</button></TooltipTrigger><TooltipContent>Send Backward</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button onClick={() => layer('back')} className={btnCls}><SendToBack size={16}/>To Back</button></TooltipTrigger><TooltipContent>Send to Back</TooltipContent></Tooltip>
      </div>

      <div className="h-px bg-slate-100 my-2" />
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Flip</p>
      <div className="flex gap-2">
        <button onClick={() => flip('h')} className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
          <StretchHorizontal size={14} /> Flip H
        </button>
        <button onClick={() => flip('v')} className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
          <Maximize2 size={14} /> Flip V
        </button>
      </div>
    </div>
  )
}

// ─── Effects Panel ────────────────────────────────────────────────────────────
function EffectsPanel({ canvas, onClose }) {
  const [opacity, setOpacity] = useState(100)
  const [shadowOn, setShadowOn] = useState(false)
  const [shadowBlur, setShadowBlur] = useState(10)
  const [shadowColor, setShadowColor] = useState('#00000066')
  const [shadowOffsetX, setShadowOffsetX] = useState(4)
  const [shadowOffsetY, setShadowOffsetY] = useState(4)

  // Read current object values on mount
  useEffect(() => {
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return
    setOpacity(Math.round((obj.opacity ?? 1) * 100))
    if (obj.shadow) {
      setShadowOn(true)
      setShadowBlur(obj.shadow.blur || 10)
      setShadowColor(obj.shadow.color || '#00000066')
      setShadowOffsetX(obj.shadow.offsetX || 4)
      setShadowOffsetY(obj.shadow.offsetY || 4)
    }
  }, [canvas])

  const applyOpacity = (val) => {
    setOpacity(val)
    const obj = canvas?.getActiveObject()
    if (obj) { obj.set({ opacity: val / 100 }); canvas.renderAll() }
  }

  const applyShadow = (on, blur = shadowBlur, color = shadowColor, ox = shadowOffsetX, oy = shadowOffsetY) => {
    const obj = canvas?.getActiveObject()
    if (!obj) return
    if (on) {
      obj.set({ shadow: { color, blur, offsetX: ox, offsetY: oy } })
    } else {
      obj.set({ shadow: null })
    }
    canvas.renderAll()
  }

  const presets = [
    { label: 'None', apply: () => { setShadowOn(false); applyShadow(false) } },
    { label: 'Soft', apply: () => { setShadowOn(true); setShadowBlur(20); setShadowOffsetX(0); setShadowOffsetY(6); applyShadow(true, 20, '#00000040', 0, 6) } },
    { label: 'Hard', apply: () => { setShadowOn(true); setShadowBlur(4); setShadowOffsetX(4); setShadowOffsetY(4); applyShadow(true, 4, '#000000aa', 4, 4) } },
    { label: 'Glow', apply: () => { setShadowOn(true); setShadowBlur(30); setShadowOffsetX(0); setShadowOffsetY(0); setShadowColor('#6366f1aa'); applyShadow(true, 30, '#6366f1aa', 0, 0) } },
  ]

  const sliderCls = 'w-full h-1.5 rounded-full appearance-none bg-slate-200 accent-indigo-600'

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Effects</p>

      {/* Opacity */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-slate-700">Opacity</span>
          <span className="text-xs font-bold text-indigo-600">{opacity}%</span>
        </div>
        <input type="range" min={0} max={100} value={opacity} onChange={e => applyOpacity(Number(e.target.value))} className={sliderCls} />
      </div>

      <div className="h-px bg-slate-100 my-3" />

      {/* Shadow */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700">Shadow</span>
          <button
            onClick={() => { const next = !shadowOn; setShadowOn(next); applyShadow(next) }}
            className={cn('w-9 h-5 rounded-full transition-colors relative', shadowOn ? 'bg-indigo-600' : 'bg-slate-200')}
          >
            <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all', shadowOn ? 'left-4' : 'left-0.5')} />
          </button>
        </div>

        {/* Shadow presets */}
        <div className="flex gap-1.5 mb-3">
          {presets.map(p => (
            <button key={p.label} onClick={p.apply} className="flex-1 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-semibold transition-all">
              {p.label}
            </button>
          ))}
        </div>

        {shadowOn && (
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between mb-1"><span className="text-slate-600">Blur</span><span className="text-indigo-600 font-bold">{shadowBlur}px</span></div>
              <input type="range" min={0} max={50} value={shadowBlur} onChange={e => { setShadowBlur(Number(e.target.value)); applyShadow(true, Number(e.target.value)) }} className={sliderCls} />
            </div>
            <div>
              <div className="flex justify-between mb-1"><span className="text-slate-600">Offset X</span><span className="text-indigo-600 font-bold">{shadowOffsetX}px</span></div>
              <input type="range" min={-30} max={30} value={shadowOffsetX} onChange={e => { setShadowOffsetX(Number(e.target.value)); applyShadow(true, shadowBlur, shadowColor, Number(e.target.value), shadowOffsetY) }} className={sliderCls} />
            </div>
            <div>
              <div className="flex justify-between mb-1"><span className="text-slate-600">Offset Y</span><span className="text-indigo-600 font-bold">{shadowOffsetY}px</span></div>
              <input type="range" min={-30} max={30} value={shadowOffsetY} onChange={e => { setShadowOffsetY(Number(e.target.value)); applyShadow(true, shadowBlur, shadowColor, shadowOffsetX, Number(e.target.value)) }} className={sliderCls} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Color</span>
              <input type="color" value={shadowColor.substring(0,7)} onChange={e => { setShadowColor(e.target.value + '99'); applyShadow(true, shadowBlur, e.target.value + '99', shadowOffsetX, shadowOffsetY) }} className="w-8 h-7 rounded-lg border border-slate-200 cursor-pointer" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main FloatingToolbar ─────────────────────────────────────────────────────
const tools = [
  { id: 'select',  icon: MousePointer2, label: 'Move',    shortcut: 'V', hasPanel: false },
  { id: 'text',    icon: Type,          label: 'Text',    shortcut: 'T', hasPanel: false },
  { id: 'image',   icon: ImageIcon,     label: 'Image',   shortcut: 'I', hasPanel: false },
  { id: 'shape',   icon: Shapes,        label: 'Shape',   shortcut: 'R', hasPanel: true  },
  { id: 'qr',      icon: QrCode,        label: 'QR',      shortcut: 'Q', hasPanel: false },
  { id: 'icon',    icon: LayoutGrid,    label: 'Icon',    shortcut: '',  hasPanel: true  },
  { id: 'arrange', icon: Layers,        label: 'Arrange', shortcut: '',  hasPanel: true  },
  { id: 'effects', icon: Sparkles,      label: 'Effects', shortcut: '',  hasPanel: true  },
]

export default function FloatingToolbar() {
  const { activeTool, setActiveTool, canvas, selectedObjectProps } = useEditorStore()
  const [openPanel, setOpenPanel] = useState(null)
  const toolbarRef = useRef(null)

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpenPanel(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard shortcuts to activate tools
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const obj = canvas?.getActiveObject()
      if (obj?.isEditing) return
      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool('select'); setOpenPanel(null); break
        case 't': setActiveTool('text'); setOpenPanel(null); break
        case 'i': setActiveTool('image'); setOpenPanel(null); break
        case 'r': setOpenPanel(p => p === 'shape' ? null : 'shape'); setActiveTool('shape'); break
        case 'q': setActiveTool('qr'); setOpenPanel(null); break
        default: break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [canvas, setActiveTool])

  const handleToolClick = (tool) => {
    if (tool.hasPanel) {
      setOpenPanel(p => p === tool.id ? null : tool.id)
      setActiveTool(tool.id)
    } else {
      setOpenPanel(null)
      setActiveTool(tool.id)
    }
  }

  const handleDelete = () => {
    if (!canvas) return
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  return (
    <div ref={toolbarRef} className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
      {/* Toolbar Strip */}
      <div className="flex items-center gap-0.5 p-1.5 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isActive = activeTool === tool.id
          const isPanelOpen = openPanel === tool.id
          return (
            <Tooltip key={tool.id} delayDuration={400}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleToolClick(tool)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all duration-200 relative',
                    isActive || isPanelOpen
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-500'
                  )}
                >
                  <Icon size={18} strokeWidth={isActive || isPanelOpen ? 2.5 : 1.8} />
                  <div className="flex items-center gap-0.5">
                    <span className={cn('text-[10px] font-semibold tracking-wide', isActive || isPanelOpen ? 'text-indigo-600' : '')}>
                      {tool.label}
                    </span>
                    {tool.hasPanel && <ChevronDown size={8} className={cn('transition-transform', isPanelOpen ? 'rotate-180' : '')} />}
                  </div>
                  {/* Active indicator dot */}
                  {(isActive || isPanelOpen) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="mt-1">
                {tool.label}{tool.shortcut ? ` (${tool.shortcut})` : ''}
              </TooltipContent>
            </Tooltip>
          )
        })}

        {/* Divider + Delete */}
        <div className="w-px h-8 bg-slate-200 mx-1 shrink-0" />
        <Tooltip delayDuration={400}>
          <TooltipTrigger asChild>
            <button
              onClick={handleDelete}
              disabled={!selectedObjectProps}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all duration-200',
                selectedObjectProps
                  ? 'text-red-500 hover:bg-red-50 cursor-pointer'
                  : 'text-slate-300 cursor-not-allowed'
              )}
            >
              <Trash2 size={18} strokeWidth={1.8} />
              <span className="text-[10px] font-semibold tracking-wide">Delete</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="mt-1">Delete (Del)</TooltipContent>
        </Tooltip>
      </div>

      {/* Panels */}
      <div className="relative">
        {openPanel === 'shape' && (
          <ShapePanel canvas={canvas} onClose={() => { setOpenPanel(null); setActiveTool('select') }} />
        )}
        {openPanel === 'icon' && (
          <IconPanel canvas={canvas} onClose={() => { setOpenPanel(null); setActiveTool('select') }} />
        )}
        {openPanel === 'arrange' && (
          <ArrangePanel canvas={canvas} onClose={() => setOpenPanel(null)} />
        )}
        {openPanel === 'effects' && (
          <EffectsPanel canvas={canvas} onClose={() => setOpenPanel(null)} />
        )}
      </div>
    </div>
  )
}
