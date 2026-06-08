import React from 'react'
import { Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useEditorStore from '@/store/editorStore'
import { templates } from '@/templates'
import { cn } from '@/lib/utils'
import { applyTemplate } from '@/utils/canvasHelpers'

const categoryColors = {
  Corporate: 'bg-blue-100 text-blue-700',
  Modern: 'bg-purple-100 text-purple-700',
  Minimal: 'bg-gray-100 text-gray-600',
  Creative: 'bg-pink-100 text-pink-700',
}

function TemplateThumbnail({ template }) {
  return (
    <div
      className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative flex"
      style={{ background: template.bgColor }}
    >
      {/* Left content area */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <div className="w-16 h-2 rounded-full mb-1" style={{ background: template.textColor, opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-full mb-2" style={{ background: template.textColor, opacity: 0.5 }} />
        </div>
        <div className="space-y-1">
          <div className="w-14 h-1 rounded-full" style={{ background: template.textColor, opacity: 0.4 }} />
          <div className="w-12 h-1 rounded-full" style={{ background: template.textColor, opacity: 0.4 }} />
          <div className="w-16 h-1 rounded-full" style={{ background: template.textColor, opacity: 0.4 }} />
        </div>
      </div>
      {/* Right design area */}
      <div className="w-1/3 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${template.accentColor}aa, ${template.accentColor})`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold"
            style={{ borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.15)' }}>
            CO
          </div>
          <div className="w-10 h-1 rounded-full bg-white/60" />
          <div className="w-7 h-1 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}

export default function TemplatePanel() {
  const { selectedTemplate, setSelectedTemplate, templateFilter, setTemplateFilter, canvas } = useEditorStore()
  const [search, setSearch] = React.useState('')

  const filtered = templates.filter((t) => {
    const matchFilter = templateFilter === 'all' || t.category.toLowerCase() === templateFilter
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleSelect = (template) => {
    setSelectedTemplate(template.id)
    if (canvas) {
      applyTemplate(canvas, template)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Templates</h2>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <Input
            placeholder="Search templates..."
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={templateFilter} onValueChange={setTemplateFilter}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Template Grid */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {filtered.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className={cn(
                'w-full text-left rounded-xl overflow-hidden border-2 transition-all duration-200 hover:shadow-md group',
                selectedTemplate === template.id
                  ? 'border-indigo-500 shadow-md shadow-indigo-100'
                  : 'border-transparent hover:border-indigo-200'
              )}
            >
              <TemplateThumbnail template={template} />
              <div className="p-2.5 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-800">{template.name}</span>
                  <span
                    className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                      categoryColors[template.category] || 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {template.category}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
