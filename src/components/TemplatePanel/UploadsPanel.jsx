import React, { useRef, useState } from 'react'
import { Upload, ImageIcon, X } from 'lucide-react'
import useEditorStore from '@/store/editorStore'
import { addImageToCanvas } from '@/utils/imageHelpers'
import { cn } from '@/lib/utils'

export default function UploadsPanel() {
  const { canvas } = useEditorStore()
  const fileRef = useRef(null)
  const [uploads, setUploads] = useState([])
  const [dragging, setDragging] = useState(false)
  const [adding, setAdding] = useState(null) // id of item being added

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploads((prev) => [
        ...prev,
        { url: e.target.result, name: file.name, id: Date.now() },
      ])
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    Array.from(e.target.files).forEach(handleFile)
    // reset so the same file can be re-selected
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    Array.from(e.dataTransfer.files).forEach(handleFile)
  }

  const addToCanvas = async (upload) => {
    if (!canvas || adding) return
    setAdding(upload.id)
    try {
      await addImageToCanvas(canvas, upload.url, { name: upload.name })
    } catch (err) {
      console.error('Failed to add image:', err)
    } finally {
      setAdding(null)
    }
  }

  const removeUpload = (id) => setUploads((prev) => prev.filter((u) => u.id !== id))

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Uploads</h2>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG supported</p>
      </div>

      <div className="p-4 overflow-auto flex-1">
        {/* Drop Zone */}
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4',
            dragging
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
          )}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Upload size={24} className="mx-auto mb-2 text-gray-300" />
          <p className="text-xs font-medium text-gray-500">Drop files here or click to upload</p>
          <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, SVG up to 10MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {/* Uploaded Files */}
        {uploads.length > 0 && (
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
              My Uploads ({uploads.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {uploads.map((upload) => (
                <div key={upload.id} className="relative group">
                  <button
                    onClick={() => addToCanvas(upload)}
                    disabled={adding === upload.id}
                    className={cn(
                      'w-full aspect-video rounded-lg overflow-hidden border border-gray-100 hover:border-indigo-300 transition-all relative',
                      adding === upload.id && 'opacity-50 cursor-wait'
                    )}
                    title="Click to add to canvas"
                  >
                    <img
                      src={upload.url}
                      alt={upload.name}
                      className="w-full h-full object-cover"
                    />
                    {adding === upload.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => removeUpload(upload.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                  <p className="text-[9px] text-gray-400 truncate mt-0.5 px-0.5">{upload.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploads.length === 0 && (
          <div className="text-center py-6 text-gray-300">
            <ImageIcon size={32} className="mx-auto mb-2" />
            <p className="text-xs">No uploads yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
