import React, { useState } from 'react'
import { 
  Settings, Grid, Layout, Compass, Save, Eye, Palette, CreditCard, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import useEditorStore from '@/store/editorStore'
import { cn } from '@/lib/utils'

export default function SettingsPanel() {
  const { 
    cardWidth, cardHeight, setCardDimensions, canvas, 
    user, setAuthModalOpen
  } = useEditorStore()

  const [snapToGrid, setSnapToGrid] = useState(true)
  const [showGuides, setShowGuides] = useState(true)
  const [bleedMargin, setBleedMargin] = useState('none') // 'none', '0.125'
  const [resolutionMultiplier, setResolutionMultiplier] = useState(2) // 1x, 2x, 3x

  // Standard Dimension Presets
  const presets = [
    { label: 'US Business Card', sub: '3.5" × 2" (Standard)', w: 900, h: 540 },
    { label: 'European Card', sub: '85 × 55 mm', w: 1004, h: 650 },
    { label: 'Square Card', sub: '2.5" × 2.5"', w: 720, h: 720 },
    { label: 'Folded Card', sub: '3.5" × 4" (Unfolded)', w: 900, h: 1080 },
  ]

  const handlePresetSelect = (w, h) => {
    if (!canvas) return
    canvas.setWidth(w)
    canvas.setHeight(h)
    canvas.renderAll()
    setCardDimensions(w, h)
  }

  const toggleSnap = (val) => {
    setSnapToGrid(val)
    // Custom snap logic could be registered on the canvas here if implemented
  }

  return (
    <div className="w-80 h-full flex flex-col bg-white border-r border-slate-200 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
          <Settings size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 tracking-wide">Document Settings</h2>
          <p className="text-[10px] text-slate-400 font-medium">Canvas & workspace configuration</p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Card Dimensions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layout size={14} className="text-indigo-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Canvas Size</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Width (px)</span>
                <input 
                  type="number" 
                  value={cardWidth} 
                  onChange={e => handlePresetSelect(Number(e.target.value), cardHeight)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                />
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Height (px)</span>
                <input 
                  type="number" 
                  value={cardHeight} 
                  onChange={e => handlePresetSelect(cardWidth, Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Presets List */}
            <div className="space-y-1.5">
              {presets.map((preset) => {
                const isActive = cardWidth === preset.w && cardHeight === preset.h
                return (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetSelect(preset.w, preset.h)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between",
                      isActive 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div>
                      <span className="block text-xs font-bold leading-tight">{preset.label}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{preset.sub}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80">{preset.w} × {preset.h} px</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Grid and Guides */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Grid size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Layout Guides</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer p-1">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Snap to Grid</span>
                  <span className="text-[10px] text-slate-400">Align objects on release</span>
                </div>
                <button
                  onClick={() => toggleSnap(!snapToGrid)}
                  className={cn(
                    'w-9 h-5 rounded-full transition-colors relative',
                    snapToGrid ? 'bg-indigo-600' : 'bg-slate-200'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
                    snapToGrid ? 'left-4' : 'left-0.5'
                  )} />
                </button>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Show Guides</span>
                  <span className="text-[10px] text-slate-400">Alignment helper lines</span>
                </div>
                <button
                  onClick={() => setShowGuides(!showGuides)}
                  className={cn(
                    'w-9 h-5 rounded-full transition-colors relative',
                    showGuides ? 'bg-indigo-600' : 'bg-slate-200'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
                    showGuides ? 'left-4' : 'left-0.5'
                  )} />
                </button>
              </label>

              <div className="flex items-center justify-between p-1">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Print Bleed Margin</span>
                  <span className="text-[10px] text-slate-400">Safety margin zone (0.125")</span>
                </div>
                <select
                  value={bleedMargin}
                  onChange={e => setBleedMargin(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="none">None (0px)</option>
                  <option value="0.125">Bleed (36px)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Export Configurations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Export Engine</span>
            </div>

            <div className="flex items-center justify-between p-1">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700">Export Resolution</span>
                <span className="text-[10px] text-slate-400">Target output file density</span>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                {[1, 2, 3].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setResolutionMultiplier(mult)}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all",
                      resolutionMultiplier === mult 
                        ? "bg-white text-slate-800 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Premium & License info */}
          <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <CreditCard size={14} />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-800">License Status</span>
                <span className="text-[10px] text-slate-400 font-semibold">BizCard Cloud Workspace</span>
              </div>
            </div>

            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Plan Type</span>
                  <span className="font-bold text-indigo-600 flex items-center gap-1">
                    <CheckCircle2 size={12} className="fill-indigo-600 text-white" /> Pro Studio
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Active User</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[120px]">{user.name}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Sign in or create a premium account to unlock auto-saved designs, history sync, and print bleed margins.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10"
                >
                  Get Premium Subscription
                </button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
