import React from 'react'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Sidebar from '@/components/Sidebar/Sidebar'
import Toolbar from '@/components/Toolbar/Toolbar'
import Canvas from '@/components/Canvas/Canvas'
import PropertiesPanel from '@/components/Properties/PropertiesPanel'
import TemplatePanel from '@/components/TemplatePanel/TemplatePanel'
import ElementsPanel from '@/components/TemplatePanel/ElementsPanel'
import TextPanel from '@/components/TemplatePanel/TextPanel'
import UploadsPanel from '@/components/TemplatePanel/UploadsPanel'
import BackgroundPanel from '@/components/TemplatePanel/BackgroundPanel'
import QRCodePanel from '@/components/TemplatePanel/QRCodePanel'
import LayersSidePanel from '@/components/TemplatePanel/LayersSidePanel'
import BrandKitPanel from '@/components/TemplatePanel/BrandKitPanel'
import SettingsPanel from '@/components/TemplatePanel/SettingsPanel'
import useEditorStore from '@/store/editorStore'
import { PanelRightOpen, X, Plus, Type, Image as ImageIcon, Shapes, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

const PANELS = {
  templates:  TemplatePanel,
  elements:   ElementsPanel,
  text:       TextPanel,
  uploads:    UploadsPanel,
  background: BackgroundPanel,
  qrcode:     QRCodePanel,
  layers:     LayersSidePanel,
  brand:      BrandKitPanel,
  settings:   SettingsPanel,
}

function PreviewOverlay() {
  const { canvas, setPreviewMode } = useEditorStore()
  const [frontUrl, setFrontUrl]     = React.useState('')
  const [backUrl,  setBackUrl]      = React.useState('')
  const [isVertical, setIsVertical] = React.useState(false)
  const [flipped, setFlipped]       = React.useState(false)
  const [isFlipping, setIsFlipping] = React.useState(false)

  React.useEffect(() => {
    if (!canvas) return

    // Exit any active text editing so the capture is clean
    const active = canvas.getActiveObject()
    if (active?.isEditing) active.exitEditing()
    canvas.discardActiveObject()
    canvas.renderAll()

    const store = useEditorStore.getState()
    const { cardWidth, cardHeight, selectedTemplate, currentSide, frontJSON, backJSON } = store
    setIsVertical(cardHeight > cardWidth)

    const runCapture = async () => {
      const { buildCard } = await import('../utils/canvasHelpers')
      const { fabric }    = await import('fabric')

      // ── Helper: build an off-screen canvas from saved JSON ─────────────────
      const captureFromJSON = (json) => {
        return new Promise((resolve) => {
          const el = document.createElement('canvas')
          el.width  = cardWidth
          el.height = cardHeight
          const tmp = new fabric.Canvas(el, {
            width: cardWidth,
            height: cardHeight,
            enableRetinaScaling: false,
          })
          tmp.loadFromJSON(json, () => {
            tmp.renderAll()
            const url = tmp.toDataURL({ format: 'png', multiplier: 2 })
            tmp.dispose()
            resolve(url)
          })
        })
      }

      // ── Helper: build an off-screen canvas from the default template ────────
      const captureFromTemplate = (sideName) => {
        return new Promise((resolve) => {
          const el = document.createElement('canvas')
          el.width  = cardWidth
          el.height = cardHeight
          const tmp = new fabric.Canvas(el, {
            width: cardWidth,
            height: cardHeight,
            enableRetinaScaling: false,
          })
          buildCard(tmp, fabric, selectedTemplate, sideName)
          // Wait a short delay for any async image loads (logo circles etc.) to settle
          setTimeout(() => {
            tmp.renderAll()
            const url = tmp.toDataURL({ format: 'png', multiplier: 2 })
            tmp.dispose()
            resolve(url)
          }, 150)
        })
      }

      // ── Capture the CURRENT (live) side directly from the main canvas ───────
      // Temporarily reset zoom so we capture at 1:1 (full card resolution)
      const { zoom } = useEditorStore.getState()
      const scale = zoom / 100
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      canvas.setWidth(cardWidth)
      canvas.setHeight(cardHeight)
      canvas.renderAll()
      const liveUrl = canvas.toDataURL({ format: 'png', multiplier: 2 })
      // Restore zoom
      canvas.setViewportTransform([scale, 0, 0, scale, 0, 0])
      canvas.setWidth(cardWidth  * scale)
      canvas.setHeight(cardHeight * scale)
      canvas.renderAll()

      // ── Capture the OTHER side ─────────────────────────────────────────────
      if (currentSide === 'front') {
        setFrontUrl(liveUrl)
        const bUrl = backJSON
          ? await captureFromJSON(backJSON)
          : await captureFromTemplate('back')
        setBackUrl(bUrl)
      } else {
        setBackUrl(liveUrl)
        const fUrl = frontJSON
          ? await captureFromJSON(frontJSON)
          : await captureFromTemplate('front')
        setFrontUrl(fUrl)
      }
    }

    runCapture()
  }, [canvas])

  const handleFlip = (toBack) => {
    if (isFlipping) return
    if (toBack === flipped) return
    setIsFlipping(true)
    setFlipped(toBack)
    setTimeout(() => setIsFlipping(false), 650)
  }

  const sizeLabel = isVertical ? '2" × 3.5" (Portrait)' : '3.5" × 2" (Landscape)'

  // Card dimensions for preview (max-constrained)
  const cardAspect = isVertical ? (540 / 900) : (900 / 540)
  const cardMaxH   = isVertical ? 480 : 320
  const cardMaxW   = cardMaxH * cardAspect

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={() => setPreviewMode(false)}
    >
      <div
        className="relative flex flex-col items-center gap-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setPreviewMode(false)}
          className="absolute -top-14 right-0 text-white/60 hover:text-white flex items-center gap-2 text-sm transition-colors"
        >
          <X size={18} />
          Close Preview
        </button>

        {/* Header */}
        <p className="text-white/40 text-[10px] uppercase tracking-[0.25em]">Preview</p>

        {/* 3D Card Stage */}
        <div
          style={{
            perspective: '1200px',
            width: cardMaxW,
            height: cardMaxH,
          }}
          className="cursor-pointer"
          onClick={() => handleFlip(!flipped)}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.65s cubic-bezier(0.45, 0.05, 0.55, 0.95)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT face */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            }}>
              {frontUrl
                ? <img src={frontUrl} alt="Front" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                  </div>
              }
            </div>

            {/* BACK face */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            }}>
              {backUrl
                ? <img src={backUrl} alt="Back" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                  </div>
              }
            </div>
          </div>
        </div>

        {/* Ambient glow under card */}
        <div style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: cardMaxW * 0.7,
          height: 40,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.35) 0%, transparent 70%)',
          filter: 'blur(12px)',
          pointerEvents: 'none',
          transition: 'opacity 0.4s',
          opacity: isFlipping ? 0.2 : 1,
        }} />

        {/* Front / Back Toggle Buttons */}
        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 backdrop-blur-sm border border-white/10">
          <button
            onClick={() => handleFlip(false)}
            style={{
              padding: '7px 24px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.05em',
              transition: 'all 0.3s',
              background: !flipped ? 'white' : 'transparent',
              color: !flipped ? '#1e293b' : 'rgba(255,255,255,0.55)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            FRONT
          </button>
          <button
            onClick={() => handleFlip(true)}
            style={{
              padding: '7px 24px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.05em',
              transition: 'all 0.3s',
              background: flipped ? 'white' : 'transparent',
              color: flipped ? '#1e293b' : 'rgba(255,255,255,0.55)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            BACK
          </button>
        </div>

        {/* Hint */}
        <p className="text-white/25 text-[10px] text-center" style={{ marginTop: -10 }}>
          Click card to flip · Business Card · {sizeLabel}
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}


export default function Dashboard() {
  const { activeSidebarItem, previewMode } = useEditorStore()
  const PanelComponent = PANELS[activeSidebarItem] || TemplatePanel

  const [rightPanelOpen, setRightPanelOpen] = React.useState(true)
  const [fabOpen, setFabOpen] = React.useState(false)

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col overflow-hidden bg-gray-50">
        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Left Panel (templates, uploads, etc.) */}
          <PanelComponent />

          {/* Center: Canvas */}
          <div className="flex flex-col flex-1 overflow-hidden relative">
            <Canvas />
            
            {/* Floating Action Button (FAB) */}
            <div className="absolute bottom-6 right-6 z-40 flex flex-col items-end gap-3">
              {fabOpen && (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <button className="w-12 h-12 rounded-full bg-white text-slate-700 shadow-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Type size={18} />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white text-slate-700 shadow-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <ImageIcon size={18} />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white text-slate-700 shadow-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Shapes size={18} />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-white text-slate-700 shadow-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <LayoutGrid size={18} />
                  </button>
                </div>
              )}
              <button 
                onClick={() => setFabOpen(!fabOpen)}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300",
                  fabOpen ? "bg-slate-800 rotate-45 shadow-[0_8px_30px_rgba(0,0,0,0.3)]" : "btn-primary-gradient"
                )}
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          {/* Right Properties Panel or collapsed strip */}
          {rightPanelOpen ? (
            <PropertiesPanel onCollapse={() => setRightPanelOpen(false)} />
          ) : (
            <div className="flex flex-col items-center w-10 shrink-0 bg-white border-l border-gray-100 pt-3 gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setRightPanelOpen(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  >
                    <PanelRightOpen size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">Open Properties</TooltipContent>
              </Tooltip>
              {/* Rotated label */}
              <span
                className="text-[9px] text-gray-300 font-medium tracking-widest uppercase select-none mt-1"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Properties
              </span>
            </div>
          )}
        </div>
      </div>

      {previewMode && <PreviewOverlay />}
    </TooltipProvider>
  )
}
