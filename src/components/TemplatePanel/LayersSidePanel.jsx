import React from 'react'
import LayersPanel from '@/components/Layers/LayersPanel'

export default function LayersSidePanel() {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Layers</h2>
        <p className="text-xs text-gray-400 mt-1">Manage layer order and visibility</p>
      </div>
      <LayersPanel />
    </div>
  )
}
