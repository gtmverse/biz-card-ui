import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import useEditorStore, { PERSONA_PRESETS } from '@/store/editorStore'

const defaultBrandColors = ['#4F46E5', '#7C3AED', '#1e3a5f', '#ffffff', '#1a1a1a']
const defaultFonts = ['Georgia', 'Arial', 'Helvetica', 'Verdana']

export default function BrandKitPanel() {
  const { canvas, profileDetails, setProfileDetails } = useEditorStore()
  const [brandColors, setBrandColors] = useState(defaultBrandColors)
  const [brandFonts] = useState(defaultFonts)
  const [newColor, setNewColor] = useState('#4F46E5')

  const addColor = () => {
    if (!brandColors.includes(newColor)) {
      setBrandColors([...brandColors, newColor])
    }
  }

  const removeColor = (c) => setBrandColors(brandColors.filter((x) => x !== c))

  const applyColor = (color) => {
    if (!canvas) return
    const active = canvas.getActiveObjects()
    if (active.length > 0) {
      active.forEach((obj) => obj.set('fill', color))
      canvas.renderAll()
    } else {
      canvas.setBackgroundColor(color, () => canvas.renderAll())
    }
  }

  const applyFont = async (font) => {
    if (!canvas) return
    const active = canvas.getActiveObjects()
    active.forEach((obj) => {
      if (obj.type === 'text' || obj.type === 'i-text') {
        obj.set('fontFamily', font)
      }
    })
    canvas.renderAll()
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Brand Kit</h2>
        <p className="text-xs text-gray-400 mt-1">Classy profiles, colors and typography</p>
      </div>

      <div className="p-4 overflow-auto flex-1 space-y-6">
        {/* Classy Persona Presets */}
        <div>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Classy Profiles</p>
          <div className="space-y-2">
            {PERSONA_PRESETS.map((preset) => {
              const isSelected = profileDetails.name === preset.name
              return (
                <button
                  key={preset.name}
                  onClick={() => setProfileDetails(preset)}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-200 text-indigo-700 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={preset.avatarSrc}
                    alt={preset.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                  />
                  <div className="truncate flex-1">
                    <span className="block text-xs font-bold leading-tight">{preset.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold leading-none">{preset.title} · <span className="italic">{preset.company}</span></span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Brand Colors */}
        <div>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Brand Colors</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {brandColors.map((color) => (
              <div key={color} className="relative group">
                <button
                  onClick={() => applyColor(color)}
                  className="w-10 h-10 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:scale-110 transition-all"
                  style={{ background: color }}
                  title={color}
                />
                <button
                  onClick={() => removeColor(color)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={8} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            />
            <span className="text-xs text-gray-600 font-mono flex-1">{newColor}</span>
            <button
              onClick={addColor}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 rounded-lg hover:bg-indigo-50"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </div>

        {/* Brand Fonts */}
        <div>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Brand Fonts</p>
          <div className="space-y-2">
            {brandFonts.map((font) => (
              <button
                key={font}
                onClick={() => applyFont(font)}
                className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
              >
                <span style={{ fontFamily: font }} className="text-sm text-gray-800 font-medium">
                  {font}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Click to apply to selected text</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
