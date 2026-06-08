import React, { useState, useEffect, useRef } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import useEditorStore from '@/store/editorStore'
import { downloadCanvas } from '@/utils/downloadHelpers'
import { isLogoCircle, replaceLogoWithFile } from '@/utils/logoHelpers'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Download,
  ImageIcon,
  PanelRightClose,
  UploadCloud,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function ColorSwatch({ color, onClick, active }) {
  return (
    <button
      onClick={() => onClick(color)}
      className={cn(
        'w-7 h-7 rounded-lg border-2 transition-all',
        active ? 'border-indigo-500 scale-110' : 'border-transparent hover:border-gray-300'
      )}
      style={{ background: color }}
    />
  )
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {children}
    </h3>
  )
}

// ─── Logo Replacement ────────────────────────────────────────────────────────

function LogoSection({ canvas }) {
  const logoInputRef = useRef(null)
  const [replacing, setReplacing] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReplacing(true)
    await replaceLogoWithFile(canvas, file)
    setReplacing(false)
    e.target.value = ''
  }

  return (
    <div>
      <SectionTitle>Logo</SectionTitle>
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      <button
        disabled={replacing}
        onClick={() => logoInputRef.current?.click()}
        className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-400 text-xs font-semibold transition-all disabled:opacity-60"
      >
        <UploadCloud size={14} />
        {replacing ? 'Replacing…' : 'Replace Logo with Image'}
      </button>
      <p className="text-[10px] text-gray-400 mt-1.5 text-center">
        PNG, JPG, SVG, WebP accepted · image will be cropped to circle
      </p>
    </div>
  )
}

// ─── Design tab ───────────────────────────────────────────────────────────────

function DesignTab() {
  const { canvas, canvasBg, setCanvasBg, selectedObjectProps } = useEditorStore()
  const [localOpacity, setLocalOpacity] = useState(100)

  useEffect(() => {
    if (selectedObjectProps) {
      setLocalOpacity(Math.round((selectedObjectProps.opacity ?? 1) * 100))
    }
  }, [selectedObjectProps])

  const bgPresets = [
    '#ffffff', '#1e3a5f', '#1a1a1a', '#065f46',
    '#0f172a', '#fdf2f8', '#fef3c7', '#f0f9ff',
  ]

  const updateSelectedProp = (prop, value) => {
    if (!canvas) return
    const active = canvas.getActiveObjects()
    active.forEach((obj) => obj.set(prop, value))
    canvas.renderAll()
  }

  const selectedObj = canvas?.getActiveObject()
  const showLogoSection = selectedObjectProps?.type === 'circle' && isLogoCircle(selectedObj)

  return (
    <div className="space-y-5 p-4">

      {/* ── Logo replacement (shown only when a logo circle is selected) ── */}
      {showLogoSection && (
        <>
          <LogoSection canvas={canvas} />
          <Separator />
        </>
      )}

      {/* Background */}
      <div>
        <SectionTitle>Canvas Background</SectionTitle>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {bgPresets.map((c) => (
            <ColorSwatch key={c} color={c} onClick={setCanvasBg} active={canvasBg === c} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="color"
            value={canvasBg}
            onChange={(e) => setCanvasBg(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
          />
          <Input
            value={canvasBg}
            onChange={(e) => setCanvasBg(e.target.value)}
            className="flex-1 h-8 text-xs font-mono"
          />
        </div>
      </div>

      <Separator />

      {/* Selected object properties */}
      {selectedObjectProps ? (
        <>
          <div>
            <SectionTitle>Position & Size</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['X', 'left'], ['Y', 'top'],
              ].map(([label, prop]) => (
                <div key={prop}>
                  <Label className="text-[10px] text-gray-500">{label}</Label>
                  <Input
                    type="number"
                    defaultValue={selectedObjectProps[prop]}
                    className="h-8 text-xs mt-0.5"
                    onChange={(e) => updateSelectedProp(prop, Number(e.target.value))}
                  />
                </div>
              ))}
              {[
                ['W', 'width'], ['H', 'height'],
              ].map(([label, prop]) => (
                <div key={prop}>
                  <Label className="text-[10px] text-gray-500">{label}</Label>
                  <Input type="number" defaultValue={selectedObjectProps[prop]} className="h-8 text-xs mt-0.5" readOnly />
                </div>
              ))}
              <div>
                <Label className="text-[10px] text-gray-500">Rotation</Label>
                <Input
                  type="number"
                  defaultValue={selectedObjectProps.angle}
                  className="h-8 text-xs mt-0.5"
                  onChange={(e) => updateSelectedProp('angle', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <SectionTitle>Opacity</SectionTitle>
            <div className="flex items-center gap-3">
              <Slider
                value={[localOpacity]}
                min={0} max={100} step={1}
                onValueChange={([v]) => { setLocalOpacity(v); updateSelectedProp('opacity', v / 100) }}
                className="flex-1"
              />
              <span className="text-xs text-gray-600 w-8 text-right">{localOpacity}%</span>
            </div>
          </div>

          <Separator />

          <div>
            <SectionTitle>Fill Color</SectionTitle>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue={selectedObjectProps.fill || '#000000'}
                onChange={(e) => updateSelectedProp('fill', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <Input
                defaultValue={selectedObjectProps.fill || ''}
                className="flex-1 h-8 text-xs font-mono"
                placeholder="transparent"
                onChange={(e) => updateSelectedProp('fill', e.target.value)}
              />
            </div>
          </div>

          {(selectedObjectProps.type === 'text' || selectedObjectProps.type === 'i-text') && (
            <>
              <Separator />
              <TextProperties canvas={canvas} props={selectedObjectProps} />
            </>
          )}

          {selectedObjectProps.type === 'image' && (
            <>
              <Separator />
              <div>
                <SectionTitle>Image</SectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-gray-500">Width</Label>
                    <Input type="number" defaultValue={selectedObjectProps.width} className="h-8 text-xs mt-0.5" readOnly />
                  </div>
                  <div>
                    <Label className="text-[10px] text-gray-500">Height</Label>
                    <Input type="number" defaultValue={selectedObjectProps.height} className="h-8 text-xs mt-0.5" readOnly />
                  </div>
                </div>
                <button
                  className="mt-2 w-full h-8 text-xs border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                  onClick={() => { const obj = canvas.getActiveObject(); if (obj) { obj.set({ clipPath: undefined }); canvas.renderAll() } }}
                >
                  Reset Clip
                </button>
              </div>
            </>
          )}

          <Separator />

          <div>
            <SectionTitle>Border</SectionTitle>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue={selectedObjectProps.stroke || '#000000'}
                onChange={(e) => updateSelectedProp('stroke', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <Input
                type="number"
                defaultValue={selectedObjectProps.strokeWidth || 0}
                className="flex-1 h-8 text-xs"
                placeholder="Width"
                onChange={(e) => updateSelectedProp('strokeWidth', Number(e.target.value))}
              />
            </div>
          </div>

          {selectedObjectProps.type === 'rect' && (
            <>
              <Separator />
              <div>
                <SectionTitle>Border Radius</SectionTitle>
                <div className="flex items-center gap-3">
                  <Slider
                    defaultValue={[selectedObjectProps.rx || 0]}
                    min={0} max={60} step={1}
                    onValueChange={([v]) => { updateSelectedProp('rx', v); updateSelectedProp('ry', v) }}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-600 w-6 text-right">{selectedObjectProps.rx || 0}</span>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <SectionTitle>Shadow</SectionTitle>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[['X', 'offsetX'], ['Y', 'offsetY'], ['Blur', 'blur']].map(([label, key]) => (
                <div key={key}>
                  <Label className="text-[10px] text-gray-500">{label}</Label>
                  <Input
                    type="number"
                    defaultValue={0}
                    className="h-8 text-xs mt-0.5"
                    onChange={(e) => {
                      const obj = canvas?.getActiveObject()
                      if (!obj) return
                      import('fabric').then(({ fabric }) => {
                        const s = obj.shadow || { color: 'rgba(0,0,0,0.3)', blur: 8, offsetX: 0, offsetY: 0 }
                        obj.set('shadow', new fabric.Shadow({ ...s, [key]: Number(e.target.value) }))
                        canvas.renderAll()
                      })
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                defaultValue="#000000"
                onChange={(e) => {
                  const obj = canvas?.getActiveObject()
                  if (!obj) return
                  import('fabric').then(({ fabric }) => {
                    const s = obj.shadow || { color: '#000000', blur: 8, offsetX: 2, offsetY: 2 }
                    obj.set('shadow', new fabric.Shadow({ ...s, color: e.target.value }))
                    canvas.renderAll()
                  })
                }}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <span className="text-xs text-gray-500">Shadow Color</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-xs text-gray-400">Select an element to edit its properties</p>
          <p className="text-[10px] text-gray-300 mt-1">Click a logo circle to see the Replace Logo button</p>
        </div>
      )}
    </div>
  )
}

// ─── Text properties sub-section ──────────────────────────────────────────────

function TextProperties({ canvas, props }) {
  const updateProp = (prop, value) => {
    if (!canvas) return
    const active = canvas.getActiveObjects()
    active.forEach((obj) => obj.set(prop, value))
    canvas.renderAll()
  }

  const fontFamilies = [
    'Arial', 'Georgia', 'Times New Roman', 'Courier New',
    'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
    'Palatino', 'Garamond',
  ]

  return (
    <div className="space-y-3">
      <SectionTitle>Typography</SectionTitle>
      <div>
        <Label className="text-[10px] text-gray-500">Font Family</Label>
        <Select defaultValue={props.fontFamily || 'Arial'} onValueChange={(v) => updateProp('fontFamily', v)}>
          <SelectTrigger className="h-8 text-xs mt-0.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((f) => (
              <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-[10px] text-gray-500">Size</Label>
          <Input type="number" defaultValue={props.fontSize || 16} className="h-8 text-xs mt-0.5" onChange={(e) => updateProp('fontSize', Number(e.target.value))} />
        </div>
        <div className="flex-1">
          <Label className="text-[10px] text-gray-500">Spacing</Label>
          <Input type="number" defaultValue={props.charSpacing || 0} className="h-8 text-xs mt-0.5" onChange={(e) => updateProp('charSpacing', Number(e.target.value))} />
        </div>
      </div>
      <div>
        <Label className="text-[10px] text-gray-500 mb-1.5 block">Style</Label>
        <div className="flex gap-1">
          <button
            onClick={() => updateProp('fontWeight', props.fontWeight === 'bold' ? 'normal' : 'bold')}
            className={cn('w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors', props.fontWeight === 'bold' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 hover:bg-gray-50')}
          ><Bold size={13} /></button>
          <button
            onClick={() => updateProp('fontStyle', props.fontStyle === 'italic' ? 'normal' : 'italic')}
            className={cn('w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors', props.fontStyle === 'italic' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 hover:bg-gray-50')}
          ><Italic size={13} /></button>
          <button
            onClick={() => updateProp('underline', !props.underline)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
          ><Underline size={13} /></button>
        </div>
      </div>
      <div>
        <Label className="text-[10px] text-gray-500 mb-1.5 block">Alignment</Label>
        <div className="flex gap-1">
          {[{ icon: AlignLeft, value: 'left' }, { icon: AlignCenter, value: 'center' }, { icon: AlignRight, value: 'right' }].map(({ icon: Icon, value }) => (
            <button
              key={value}
              onClick={() => updateProp('textAlign', value)}
              className={cn('flex-1 h-8 flex items-center justify-center rounded-lg border transition-colors', props.textAlign === value ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 hover:bg-gray-50')}
            ><Icon size={13} /></button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Settings tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const { canvas } = useEditorStore()
  const formats = [
    { label: 'PNG (High Quality)', value: 'png', icon: '🖼️' },
    { label: 'JPG (Compressed)',   value: 'jpg', icon: '📷' },
    { label: 'PDF (Print Ready)',  value: 'pdf', icon: '📄' },
    { label: 'SVG (Vector)',       value: 'svg', icon: '✏️' },
  ]
  return (
    <div className="space-y-5 p-4">
      <div>
        <SectionTitle>Card Size</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-gray-500">Width (px)</Label>
            <Input defaultValue={900} className="h-8 text-xs mt-0.5" readOnly />
          </div>
          <div>
            <Label className="text-[10px] text-gray-500">Height (px)</Label>
            <Input defaultValue={540} className="h-8 text-xs mt-0.5" readOnly />
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">Standard business card: 3.5" × 2" @ 2x</p>
      </div>
      <Separator />
      <div>
        <SectionTitle>Export</SectionTitle>
        <div className="space-y-2">
          {formats.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => downloadCanvas(canvas, fmt.value)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
            >
              <span className="text-lg">{fmt.icon}</span>
              <div className="text-left flex-1">
                <p className="text-xs font-medium text-gray-800">{fmt.label}</p>
              </div>
              <Download size={13} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function PropertiesPanel({ onCollapse }) {
  return (
    <div
      className="flex flex-col h-full bg-white border-l border-gray-100"
      style={{ width: 320, minWidth: 320 }}
    >
      <Tabs defaultValue="design" className="flex flex-col h-full">
        {/* Tab bar with collapse button */}
        <div className="px-3 pt-3 pb-0 border-b border-gray-100 flex items-center gap-2">
          <TabsList className="flex-1">
            <TabsTrigger value="design"   className="flex-1 text-xs">Design</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 text-xs">Settings</TabsTrigger>
          </TabsList>
          {onCollapse && (
            <button
              onClick={onCollapse}
              title="Minimize panel"
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <PanelRightClose size={15} />
            </button>
          )}
        </div>

        <TabsContent value="design" className="flex-1 overflow-hidden mt-0">
          <ScrollArea className="h-full">
            <DesignTab />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="settings" className="flex-1 overflow-hidden mt-0">
          <ScrollArea className="h-full">
            <SettingsTab />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
