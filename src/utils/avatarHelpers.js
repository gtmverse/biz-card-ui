import useEditorStore from '@/store/editorStore'

export const AVATAR_CIRCLE_NAMES = new Set(['Avatar Circle', 'Avatar Placeholder', 'Avatar Ring', 'Avatar Icon Head', 'Avatar Icon Shoulders'])

export function isAvatarCircle(obj) {
  return obj && (obj.type === 'circle' || obj.type === 'path' || obj.type === 'image') && (AVATAR_CIRCLE_NAMES.has(obj.name) || obj.name === 'Avatar Image')
}

/**
 * Replace the currently selected avatar placeholder circle/image with a user-uploaded image.
 * - Removes the circle and any nearby placeholder silhouette parts
 * - Loads the file, creates a circular-clipped fabric.Image at the same position/size
 */
export async function replaceAvatarWithFile(canvas, file) {
  if (!canvas || !file) return
  let obj = canvas.getActiveObject()
  if (!obj) return

  // If they clicked on head/shoulders outline or the current image, find the anchor position
  let cx = 0, cy = 0, radius = 50

  if (obj.name === 'Avatar Image') {
    cx = obj.left
    cy = obj.top
    radius = (obj.clipPath?.radius) || (obj.width * obj.scaleX / 2)
  } else {
    // Look for Avatar Circle to get dimensions
    let avatarCircle = obj
    if (obj.name !== 'Avatar Circle') {
      avatarCircle = canvas.getObjects().find(o => o.name === 'Avatar Circle') || obj
    }
    const scaleX = avatarCircle.scaleX ?? 1
    const scaleY = avatarCircle.scaleY ?? 1
    const rVal = avatarCircle.radius || 50
    radius = rVal * Math.max(scaleX, scaleY)
    cx = avatarCircle.left + rVal * scaleX
    cy = avatarCircle.top + rVal * scaleY
  }

  const { fabric } = await import('fabric')

  // Remove the old avatar circle, image, and silhouette pieces
  canvas.getObjects()
    .filter(o => AVATAR_CIRCLE_NAMES.has(o.name) || o.name === 'Avatar Image')
    .forEach(o => canvas.remove(o))
  canvas.discardActiveObject()

  const reader = new FileReader()
  reader.onload = (ev) => {
    const dataUrl = ev.target.result
    // Update store state
    const profile = useEditorStore.getState().profileDetails
    useEditorStore.getState().setProfileDetails({ ...profile, avatarSrc: dataUrl })

    const el = new window.Image()
    el.onload = () => {
      const scale = (radius * 2) / Math.min(el.width, el.height)

      const img = new fabric.Image(el, {
        originX: 'center',
        originY: 'center',
        left: cx,
        top:  cy,
        scaleX: scale,
        scaleY: scale,
        name: 'Avatar Image',
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
