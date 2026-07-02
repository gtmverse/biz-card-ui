import useEditorStore from '@/store/editorStore'
import { buildCard } from '@/utils/canvasHelpers'

const EXPORT_MULTIPLIER = 2

function prepareForExport(canvas) {
  const active = canvas.getActiveObject()
  if (active && active.isEditing) active.exitEditing()
  canvas.discardActiveObject()

  const savedVp    = [...canvas.viewportTransform]
  const savedWidth  = canvas.width
  const savedHeight = canvas.height

  // Use actual card design dimensions (handles vertical cards correctly)
  const { cardWidth, cardHeight } = useEditorStore.getState()
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.setWidth(cardWidth)
  canvas.setHeight(cardHeight)
  canvas.renderAll()

  return () => {
    canvas.setViewportTransform(savedVp)
    canvas.setWidth(savedWidth)
    canvas.setHeight(savedHeight)
    canvas.renderAll()
  }
}

export function downloadCanvas(canvas, format = 'png') {
  if (!canvas) return

  const restore = prepareForExport(canvas)

  try {
    switch (format) {
      case 'png': {
        const dataURL = canvas.toDataURL({ format: 'png', multiplier: EXPORT_MULTIPLIER })
        triggerDownload(dataURL, 'bizcard.png')
        break
      }

      case 'jpg': {
        const dataURL = canvas.toDataURL({ format: 'jpeg', quality: 0.95, multiplier: EXPORT_MULTIPLIER })
        triggerDownload(dataURL, 'bizcard.jpg')
        break
      }

      case 'svg': {
        const svg = canvas.toSVG()
        const blob = new Blob([svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        triggerDownload(url, 'bizcard.svg')
        URL.revokeObjectURL(url)
        break
      }

      case 'zip': {
        const store = useEditorStore.getState()
        const { cardWidth, cardHeight, selectedTemplate, frontJSON, backJSON, currentSide } = store
        
        // Ensure current side is saved to JSON before exporting
        if (currentSide === 'front') store.setFrontJSON(canvas.toJSON(['name', 'locked', '__uid']))
        if (currentSide === 'back') store.setBackJSON(canvas.toJSON(['name', 'locked', '__uid']))

        restore() // restore active canvas immediately

        const captureOffscreen = async (sideName, savedJSON) => {
          const { fabric } = await import('fabric')
          return new Promise((resolve) => {
            const el = document.createElement('canvas')
            el.width = cardWidth
            el.height = cardHeight
            const tmp = new fabric.Canvas(el, { width: cardWidth, height: cardHeight, enableRetinaScaling: false })
            
            if (savedJSON) {
              tmp.loadFromJSON(savedJSON, () => {
                tmp.renderAll()
                const dataURL = tmp.toDataURL({ format: 'png', multiplier: EXPORT_MULTIPLIER })
                tmp.dispose()
                resolve(dataURL.split(',')[1]) // Get base64 part
              })
            } else {
              buildCard(tmp, fabric, selectedTemplate, sideName)
              setTimeout(() => {
                tmp.renderAll()
                const dataURL = tmp.toDataURL({ format: 'png', multiplier: EXPORT_MULTIPLIER })
                tmp.dispose()
                resolve(dataURL.split(',')[1])
              }, 150)
            }
          })
        }

        const runZip = async () => {
          const frontBase64 = await captureOffscreen('front', store.frontJSON || (currentSide === 'front' ? canvas.toJSON(['name', 'locked', '__uid']) : null))
          const backBase64 = await captureOffscreen('back', store.backJSON || (currentSide === 'back' ? canvas.toJSON(['name', 'locked', '__uid']) : null))
          
          const JSZip = (await import('jszip')).default
          const zip = new JSZip()
          zip.file('front.png', frontBase64, { base64: true })
          zip.file('back.png', backBase64, { base64: true })
          
          const blob = await zip.generateAsync({ type: 'blob' })
          const url = URL.createObjectURL(blob)
          triggerDownload(url, 'bizcard-export.zip')
          URL.revokeObjectURL(url)
        }
        
        runZip()
        return // return early so we don't call restore() again
      }

      case 'pdf': {
        // Capture image synchronously while viewport is reset, then restore before async jsPDF work
        const { cardWidth, cardHeight } = useEditorStore.getState()
        const isVertical = cardHeight > cardWidth
        // Standard business card: 90×54 mm landscape, or 54×90 mm portrait
        const [pdfW, pdfH] = isVertical ? [54, 90] : [90, 54]
        const imgData = canvas.toDataURL({ format: 'png', multiplier: EXPORT_MULTIPLIER })
        restore()
        import('jspdf').then(({ jsPDF }) => {
          const pdf = new jsPDF({
            orientation: isVertical ? 'portrait' : 'landscape',
            unit: 'mm',
            format: [pdfW, pdfH],
          })
          pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
          pdf.save('bizcard.pdf')
        })
        return // skip the finally-restore since we already restored above
      }

      default:
        break
    }
  } finally {
    // Always restore the viewport even if export throws
    restore()
  }
}

function triggerDownload(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
