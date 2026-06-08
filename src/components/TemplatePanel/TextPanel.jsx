import React from 'react'
import useEditorStore from '@/store/editorStore'

const textStyles = [
  { label: 'Heading', fontSize: 48, fontWeight: 'bold', preview: 'Heading' },
  { label: 'Subheading', fontSize: 32, fontWeight: '600', preview: 'Subheading' },
  { label: 'Body Text', fontSize: 16, fontWeight: 'normal', preview: 'Body text goes here' },
  { label: 'Caption', fontSize: 12, fontWeight: 'normal', preview: 'Caption text' },
  { label: 'Name Style', fontSize: 42, fontWeight: 'bold', fontFamily: 'Georgia, serif', preview: 'John Doe' },
  { label: 'Title Style', fontSize: 16, fontWeight: '400', preview: 'Job Title' },
  { label: 'Contact Info', fontSize: 14, fontWeight: 'normal', preview: '+1 234 567 8900' },
]

export default function TextPanel() {
  const { canvas } = useEditorStore()

  const addText = async (style) => {
    if (!canvas) return
    const { fabric } = await import('fabric')

    const text = new fabric.IText(style.preview, {
      left: canvas.width / 2 - 100,
      top: canvas.height / 2 - style.fontSize / 2,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight || 'normal',
      fontFamily: style.fontFamily || 'Arial, sans-serif',
      fill: '#1f2937',
      name: style.label,
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Text</h2>
        <p className="text-xs text-gray-400 mt-1">Click to add text to your card</p>
      </div>
      <div className="p-4 overflow-auto flex-1 space-y-2">
        {textStyles.map((style) => (
          <button
            key={style.label}
            onClick={() => addText(style)}
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
          >
            <div
              style={{
                fontSize: Math.min(style.fontSize, 24),
                fontWeight: style.fontWeight,
                fontFamily: style.fontFamily || 'Arial',
                color: '#1f2937',
                lineHeight: 1.2,
              }}
              className="truncate group-hover:text-indigo-700 transition-colors"
            >
              {style.label}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">{style.fontSize}px · {style.fontWeight}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
