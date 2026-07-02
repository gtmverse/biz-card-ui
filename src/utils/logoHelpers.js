import useEditorStore from '@/store/editorStore'

export const LOGO_CIRCLE_NAMES = new Set(['Logo Circle', 'Logo Placeholder', 'Logo Ring'])
const LOGO_LABEL_NAMES  = new Set(['Logo', 'Logo Label'])

export function isLogoCircle(obj) {
  return obj && obj.type === 'circle' && LOGO_CIRCLE_NAMES.has(obj.name)
}

/**
 * Replace the currently selected logo placeholder circle with a user-uploaded image.
 * - Removes the circle and any nearby "LOGO" text labels
 * - Loads the file, creates a circular-clipped fabric.Image at the same position/size
 */
export async function replaceLogoWithFile(canvas, file) {
  if (!canvas || !file) return
  const obj = canvas.getActiveObject()
  if (!isLogoCircle(obj)) return

  const { fabric } = await import('fabric')

  const scaleX = obj.scaleX ?? 1
  const scaleY = obj.scaleY ?? 1
  const radius  = obj.radius * Math.max(scaleX, scaleY)

  // Center of the circle in canvas coordinates
  const cx = obj.left + obj.radius * scaleX
  const cy = obj.top  + obj.radius * scaleY

  // Remove the circle and any LOGO text labels
  canvas.getObjects()
    .filter(o => LOGO_LABEL_NAMES.has(o.name))
    .forEach(o => canvas.remove(o))
  canvas.remove(obj)
  canvas.discardActiveObject()

  const reader = new FileReader()
  reader.onload = (ev) => {
    const dataUrl = ev.target.result
    useEditorStore.getState().setCustomLogoSrc(dataUrl)

    const el = new window.Image()
    el.onload = () => {
      // Scale so the shorter side fills the circle's diameter
      const scale = (radius * 2) / Math.min(el.width, el.height)

      const img = new fabric.Image(el, {
        originX: 'center',
        originY: 'center',
        left: cx,
        top:  cy,
        scaleX: scale,
        scaleY: scale,
        name: 'Logo Image',
        clipPath: new fabric.Circle({
          radius: radius,
          originX: 'center',
          originY: 'center',
          left: cx,
          top: cy,
          absolutePositioned: true,
        }),
      })

      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    }
    el.src = ev.target.result
  }
  reader.readAsDataURL(file)
}
