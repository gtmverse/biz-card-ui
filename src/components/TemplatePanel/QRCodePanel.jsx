import React, { useState, useEffect } from 'react'
import { QrCode, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useEditorStore from '@/store/editorStore'
import { addImageToCanvas } from '@/utils/imageHelpers'
import QRCode from 'qrcode'

const QR_TYPES = [
  { value: 'url',   label: 'Website URL',    placeholder: 'https://example.com' },
  { value: 'email', label: 'Email Address',  placeholder: 'john@example.com' },
  { value: 'phone', label: 'Phone Number',   placeholder: '+1 234 567 8900' },
  { value: 'vcard', label: 'vCard / Contact', placeholder: 'BEGIN:VCARD...' },
]

export default function QRCodePanel() {
  const { canvas } = useEditorStore()
  const [qrType, setQrType]     = useState('url')
  const [value, setValue]       = useState('https://databus.co')
  const [fgColor, setFgColor]   = useState('#1e3a5f')
  const [bgColor, setBgColor]   = useState('#ffffff')
  const [displaySize, setDisplaySize] = useState(150) // pixels on canvas
  const [previewUrl, setPreviewUrl]   = useState('')
  const [adding, setAdding]           = useState(false)
  const [error, setError]             = useState('')

  // Always generate QR at high resolution (400px) for crisp output; control
  // the canvas display size separately via displaySize.
  const RENDER_SIZE = 400

  const generatePreview = async () => {
    if (!value.trim()) { setPreviewUrl(''); return }
    try {
      setError('')
      const url = await QRCode.toDataURL(value, {
        color: { dark: fgColor, light: bgColor },
        width: RENDER_SIZE,
        margin: 2,
        errorCorrectionLevel: 'M',
      })
      setPreviewUrl(url)
    } catch (e) {
      setError('Failed to generate QR code')
    }
  }

  useEffect(() => {
    generatePreview()
  }, [value, fgColor, bgColor])

  const addToCanvas = async () => {
    if (!canvas || !previewUrl || adding) return
    setAdding(true)
    try {
      // Scale so the QR appears at displaySize × displaySize on canvas
      const scale = displaySize / RENDER_SIZE
      await addImageToCanvas(canvas, previewUrl, {
        name: 'QR Code',
        fabricProps: { scaleX: scale, scaleY: scale },
        // override auto-fit — use our explicit scale
        maxWidth: Infinity,
        maxHeight: Infinity,
      })
    } catch (e) {
      console.error('Failed to add QR to canvas:', e)
    } finally {
      setAdding(false)
    }
  }

  const currentType = QR_TYPES.find((t) => t.value === qrType)

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">QR Code Generator</h2>
        <p className="text-xs text-gray-400 mt-1">Generate and add QR codes to your card</p>
      </div>

      <div className="p-4 overflow-auto flex-1 space-y-4">
        {/* Type */}
        <div>
          <Label className="text-xs text-gray-600 mb-1.5 block">QR Type</Label>
          <Select value={qrType} onValueChange={setQrType}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QR_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Value */}
        <div>
          <Label className="text-xs text-gray-600 mb-1.5 block">Content</Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={currentType?.placeholder}
            className="text-sm h-9"
          />
          {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-600 mb-1.5 block">Foreground</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200 flex-shrink-0"
              />
              <Input
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="flex-1 h-8 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-600 mb-1.5 block">Background</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200 flex-shrink-0"
              />
              <Input
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 h-8 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Canvas display size */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs text-gray-600">Size on Card</Label>
            <span className="text-xs font-medium text-indigo-600">{displaySize}px</span>
          </div>
          <input
            type="range"
            min="60"
            max="300"
            step="10"
            value={displaySize}
            onChange={(e) => setDisplaySize(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>Small</span><span>Large</span>
          </div>
        </div>

        {/* Preview + Add Button */}
        {previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 w-full flex justify-center">
              <img
                src={previewUrl}
                alt="QR Preview"
                style={{ width: 128, height: 128 }}
                className="object-contain rounded"
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center">
              Will appear as {displaySize}×{displaySize}px on the card
            </p>
            <Button
              onClick={addToCanvas}
              disabled={adding}
              className="w-full h-9 text-sm bg-indigo-600 hover:bg-indigo-700 gap-2 disabled:opacity-60"
            >
              {adding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={15} />
              )}
              {adding ? 'Adding…' : 'Add to Canvas'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-300">
            <QrCode size={32} className="mx-auto mb-2" />
            <p className="text-xs">Enter content above to preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
