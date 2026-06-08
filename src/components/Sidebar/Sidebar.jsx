import React from 'react'
import {
  LayoutTemplate,
  Shapes,
  Type,
  Upload,
  ImageIcon,
  QrCode,
  Layers,
  Palette,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useEditorStore from '@/store/editorStore'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'elements', icon: Shapes, label: 'Elements' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'uploads', icon: Upload, label: 'Uploads' },
  { id: 'background', icon: ImageIcon, label: 'Background' },
  { id: 'qrcode', icon: QrCode, label: 'QR Code' },
  { id: 'layers', icon: Layers, label: 'Layers' },
  { id: 'brand', icon: Palette, label: 'Brand Kit' },
]

export default function Sidebar() {
  const { activeSidebarItem, setActiveSidebarItem } = useEditorStore()

  return (
    <div
      className="flex flex-col items-center py-4 gap-1"
      style={{
        width: 80,
        minWidth: 80,
        background: '#0050B8',
        borderRight: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      {/* Logo */}
      <div className="mb-4 flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          BC
        </div>
      </div>

      <div className="w-full px-2 flex flex-col gap-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSidebarItem === item.id
          return (
            <Tooltip key={item.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveSidebarItem(item.id)}
                  className={cn(
                    'w-full flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-white/20 text-white shadow-lg shadow-indigo-900/50'
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      'transition-transform duration-200 group-hover:scale-110',
                      isActive && 'scale-110'
                    )}
                  />
                  <span className="text-[9px] font-medium leading-tight text-center">
                    {item.label}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-1">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
