import React from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
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
import { X } from 'lucide-react'

const PANELS = {
  templates: TemplatePanel,
  elements: ElementsPanel,
  text: TextPanel,
  uploads: UploadsPanel,
  background: BackgroundPanel,
  qrcode: QRCodePanel,
  layers: LayersSidePanel,
  brand: BrandKitPanel,
}

function PreviewOverlay() {
  const { canvas, setPreviewMode } = useEditorStore()
  const [dataUrl, setDataUrl] = React.useState('')

  React.useEffect(() => {
    if (canvas) {
      setDataUrl(canvas.toDataURL({ format: 'png', multiplier: 1.5 }))
    }
  }, [canvas])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative max-w-4xl w-full mx-8">
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
            <img
              src={dataUrl}
              alt="Card Preview"
              className="w-full rounded-xl shadow-xl"
            />
          )}
          <p className="text-white/30 text-xs text-center mt-4">Business Card · 3.5" × 2"</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { activeSidebarItem, previewMode } = useEditorStore()
  const PanelComponent = PANELS[activeSidebarItem] || TemplatePanel

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

          {/* Panel */}
          <PanelComponent />

          {/* Center: Toolbar + Canvas */}
          <div className="flex flex-col flex-1 overflow-hidden relative">
            <Toolbar />
            <Canvas />
          </div>

          {/* Right Properties Panel */}
          <PropertiesPanel />
        </div>
      </div>

      {/* Preview Overlay */}
      {previewMode && <PreviewOverlay />}
    </TooltipProvider>
  )
}
