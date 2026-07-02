import React from 'react'
import {
  LayoutTemplate,
  Shapes,
  Type,
  Image as ImageIcon,
  Upload,
  QrCode,
  Layers,
  Palette,
  Settings,
  Lock,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useEditorStore from '@/store/editorStore'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'elements', icon: Shapes, label: 'Elements' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'images', icon: ImageIcon, label: 'Images' },
  { id: 'uploads', icon: Upload, label: 'Uploads', premium: true },
  { id: 'background', icon: Palette, label: 'Background' },
  { id: 'qrcode', icon: QrCode, label: 'QR Code', premium: true },
  { id: 'layers', icon: Layers, label: 'Layers', premium: true },
  { id: 'brand', icon: Palette, label: 'Brand Kit', premium: true },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { activeSidebarItem, setActiveSidebarItem, user, setAuthModalOpen } = useEditorStore()

  return (
    <div
      className="flex flex-col items-center py-4 gap-2 z-20 shrink-0 bg-white border-r border-slate-200"
      style={{
        width: 72,
        minWidth: 72,
      }}
    >

      <div className="w-full px-2 flex flex-col gap-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSidebarItem === item.id
          const isLocked = item.premium && !user

          const handleClick = () => {
            if (isLocked) {
              setAuthModalOpen(true)
            } else {
              setActiveSidebarItem(item.id)
            }
          }

          return (
            <Tooltip key={item.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleClick}
                  className={cn(
                    'w-full flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-200 group relative',
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <div className="relative">
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                      className={cn(
                        'transition-transform duration-200 group-hover:scale-110',
                        isActive && 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                      )}
                    />
                    {isLocked && (
                      <div className="absolute -top-1.5 -right-2 bg-amber-500 text-white rounded-full p-0.5 border border-white shadow-sm">
                        <Lock size={10} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium leading-tight text-center transition-colors",
                    isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-800"
                  )}>
                    {item.label}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-1">
                {isLocked ? `Unlock ${item.label} (Premium)` : item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

