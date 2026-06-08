const CARD_W = 900
const CARD_H = 540
const EXPORT_MULTIPLIER = 2 // 1800×1080 output

/**
 * Prepare canvas for export:
 *  - exit any active text-editing mode (IText textarea overlay)
 *  - deselect all objects (no selection handles in export)
 *  - reset viewport to 1:1 so the full card is captured regardless of zoom
 * Returns a restore function that puts the canvas back to its previous state.
 */
function prepareForExport(canvas) {
  // 1. Exit text editing if active
  const active = canvas.getActiveObject()
  if (active && active.isEditing) {
    active.exitEditing()
  }

  // 2. Clear selection (hides blue handles / border in the image)
  canvas.discardActiveObject()

  // 3. Save current viewport state
  const savedVp     = [...canvas.viewportTransform]
  const savedWidth  = canvas.width
  const savedHeight = canvas.height

  // 4. Reset to real card dimensions so zoom level has no effect on the export
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.setWidth(CARD_W)
  canvas.setHeight(CARD_H)

  // 5. Force a synchronous render with the new viewport
  canvas.renderAll()

  // Return a restore callback
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

      case 'pdf': {
        // Capture the image synchronously while viewport is reset, then restore before async work
        const imgData = canvas.toDataURL({ format: 'png', multiplier: EXPORT_MULTIPLIER })
        restore()
        import('jspdf').then(({ jsPDF }) => {
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [90, 54],
          })
          pdf.addImage(imgData, 'PNG', 0, 0, 90, 54)
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
