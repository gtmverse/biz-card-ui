/**
 * Reliably loads an image (data URL or remote URL) onto a Fabric canvas.
 *
 * fabric.Image.fromURL silently fails in Fabric 5.x for data/blob URLs
 * because Fabric sets the crossOrigin attribute on the underlying <img>,
 * which browsers reject for those URL schemes.  Using a native Image element
 * and passing it to `new fabric.Image(el, opts)` avoids the problem entirely.
 */
export function addImageToCanvas(canvas, url, opts = {}) {
  return new Promise((resolve, reject) => {
    if (!canvas) return reject(new Error('No canvas'))

    import('fabric').then(({ fabric }) => {
      const el = new window.Image()

      el.onload = () => {
        const canvasW = canvas.getWidth()
        const canvasH = canvas.getHeight()

        let scaleX, scaleY

        if (opts.fabricProps?.scaleX != null) {
          // Caller supplied explicit scale (e.g. QR panel)
          scaleX = opts.fabricProps.scaleX
          scaleY = opts.fabricProps.scaleY ?? scaleX
        } else {
          // Auto-fit: fill at most maxWidth × maxHeight, never upscale
          const maxW = opts.maxWidth  ?? canvasW * 0.45
          const maxH = opts.maxHeight ?? canvasH * 0.45
          const s = Math.min(maxW / el.naturalWidth, maxH / el.naturalHeight, 1)
          scaleX = s
          scaleY = s
        }

        const displayW = el.naturalWidth  * scaleX
        const displayH = el.naturalHeight * scaleY

        const fabricImg = new fabric.Image(el, {
          left: canvasW / 2 - displayW / 2,
          top:  canvasH / 2 - displayH / 2,
          scaleX,
          scaleY,
          name: opts.name ?? 'Image',
          crossOrigin: null,
        })

        canvas.add(fabricImg)
        canvas.setActiveObject(fabricImg)
        canvas.requestRenderAll()
        resolve(fabricImg)
      }

      el.onerror = (err) => reject(err)

      // Never set crossOrigin for data: or blob: URLs — browsers reject it
      if (!url.startsWith('data:') && !url.startsWith('blob:')) {
        el.crossOrigin = 'anonymous'
      }

      el.src = url
    })
  })
}
