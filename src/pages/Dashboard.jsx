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
import useEditorStore from '@/store/editorStore'
import { PanelRightOpen, X } from 'lucide-react'

const PANELS = {
  templates:  TemplatePanel,
  elements:   ElementsPanel,
  text:       TextPanel,
  uploads:    UploadsPanel,
  background: BackgroundPanel,
  qrcode:     QRCodePanel,
  layers:     LayersSidePanel,
  brand:      BrandKitPanel,
}

function PreviewOverlay() {
  const { canvas, setPreviewMode } = useEditorStore()
  const [dataUrl, setDataUrl] = React.useState('')
  const [isVertical, setIsVertical] = React.useState(false)

  React.useEffect(() => {
    if (!canvas) return

    // Exit any active text editing so the capture is clean
    const active = canvas.getActiveObject()
    if (active?.isEditing) active.exitEditing()
    canvas.discardActiveObject()

    // Save current viewport + element size
    const savedVp = [...canvas.viewportTransform]
    const savedW  = canvas.width
    const savedH  = canvas.height

    // Capture at actual card dimensions (ignore zoom)
    const { cardWidth, cardHeight } = useEditorStore.getState()
    setIsVertical(cardHeight > cardWidth)
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    canvas.setWidth(cardWidth)
    canvas.setHeight(cardHeight)
    canvas.renderAll()

    setDataUrl(canvas.toDataURL({ format: 'png', multiplier: 2 }))

    // Restore working zoom + size
    canvas.setViewportTransform(savedVp)
    canvas.setWidth(savedW)
    canvas.setHeight(savedH)
    canvas.renderAll()
  }, [canvas])

  const sizeLabel = isVertical ? '2" × 3.5"  (Portrait)' : '3.5" × 2"  (Landscape)'

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className={`relative mx-8 ${isVertical ? 'max-w-sm' : 'max-w-4xl w-full'}`}>
        <button
          onClick={() => setPreviewMode(false)}
          className="absolute -top-12 right-0 text-white/70 hover:text-white flex items-center gap-2 text-sm"
        >
          <X size={18} />
          Close Preview
        </button>
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <p className="text-white/50 text-xs text-center mb-4 uppercase tracking-widest">Preview</p>
          {dataUrl && (
            <img src={dataUrl} alt="Card Preview" className="w-full rounded-xl shadow-xl" />
          )}
          <p className="text-white/30 text-xs text-center mt-4">Business Card · {sizeLabel}</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { activeSidebarItem, previewMode } = useEditorStore()
  const PanelComponent = PANELS[activeSidebarItem] || TemplatePanel

  const [rightPanelOpen, setRightPanelOpen] = React.useState(true)

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        {/* Top Brand Bar */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b border-gray-100"
          style={{ background: '#0050B8', minHeight: 46 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              BC
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">BizCard Studio</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">Untitled Design</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-white/60 text-xs">Auto-saved</span>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Left Panel (templates, uploads, etc.) */}
          <PanelComponent />

          {/* Center: Toolbar + Canvas */}
          <div className="flex flex-col flex-1 overflow-hidden relative">
            <Toolbar />
            <Canvas />
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
