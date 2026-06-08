const CARD_W = 900
const CARD_H = 540

function itext(fabric, text, opts) {
  return new fabric.IText(text, opts)
}

export async function buildDefaultCard(canvas, fabric) {
  canvas.clear()

  const bgRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: CARD_W,
    height: CARD_H,
    fill: '#1e3a5f',
    selectable: false,
    evented: false,
    name: 'Background',
  })
  canvas.add(bgRect)

  const accentPath = new fabric.Path(
    `M ${CARD_W * 0.58} 0 Q ${CARD_W * 0.5} ${CARD_H * 0.5} ${CARD_W * 0.58} ${CARD_H} L ${CARD_W} ${CARD_H} L ${CARD_W} 0 Z`,
    {
      fill: '#4F46E5',
      opacity: 0.9,
      selectable: false,
      evented: false,
      name: 'Accent Shape',
    }
  )
  canvas.add(accentPath)

  const accentPath2 = new fabric.Path(
    `M ${CARD_W * 0.63} 0 Q ${CARD_W * 0.55} ${CARD_H * 0.5} ${CARD_W * 0.63} ${CARD_H} L ${CARD_W} ${CARD_H} L ${CARD_W} 0 Z`,
    {
      fill: '#6366f1',
      opacity: 0.5,
      selectable: false,
      evented: false,
      name: 'Accent Layer 2',
    }
  )
  canvas.add(accentPath2)

  canvas.add(itext(fabric, 'John Doe', {
    left: 48, top: 90,
    fontSize: 42, fill: '#ffffff',
    fontFamily: 'Georgia, serif', fontWeight: 'bold',
    name: 'Name Text',
  }))

  canvas.add(itext(fabric, 'Chief Executive Officer', {
    left: 48, top: 148,
    fontSize: 16, fill: '#93c5fd',
    fontFamily: 'Arial, sans-serif', fontWeight: '400',
    name: 'Title Text',
  }))

  canvas.add(new fabric.Line([48, 185, 300, 185], {
    stroke: 'rgba(255,255,255,0.25)', strokeWidth: 1,
    selectable: false, evented: false, name: 'Divider',
  }))

  canvas.add(itext(fabric, '+91 9876543210', {
    left: 48, top: 205,
    fontSize: 14, fill: '#e0e7ff',
    fontFamily: 'Arial, sans-serif', name: 'Phone Text',
  }))

  canvas.add(itext(fabric, 'john@databus.co', {
    left: 48, top: 232,
    fontSize: 14, fill: '#e0e7ff',
    fontFamily: 'Arial, sans-serif', name: 'Email Text',
  }))

  canvas.add(itext(fabric, 'www.databus.co', {
    left: 48, top: 259,
    fontSize: 14, fill: '#93c5fd',
    fontFamily: 'Arial, sans-serif', name: 'Website Text',
  }))

  canvas.add(itext(fabric, '123 Business Street, Suite 400', {
    left: 48, top: 286,
    fontSize: 13, fill: '#94a3b8',
    fontFamily: 'Arial, sans-serif', name: 'Address Text',
  }))

  const rightCenter = CARD_W * 0.79

  canvas.add(new fabric.Circle({
    left: rightCenter - 50, top: 80, radius: 50,
    fill: 'rgba(255,255,255,0.15)',
    stroke: 'rgba(255,255,255,0.4)', strokeWidth: 2,
    name: 'Logo Placeholder',
  }))

  canvas.add(itext(fabric, 'LOGO', {
    left: rightCenter - 20, top: 114,
    fontSize: 13, fill: 'rgba(255,255,255,0.6)',
    fontFamily: 'Arial, sans-serif', fontWeight: 'bold',
    name: 'Logo Label',
  }))

  canvas.add(itext(fabric, 'DataBus Co.', {
    left: rightCenter - 55, top: 200,
    fontSize: 22, fill: '#ffffff',
    fontFamily: 'Georgia, serif', fontWeight: 'bold',
    name: 'Company Name',
  }))

  canvas.add(itext(fabric, 'Connecting the World', {
    left: rightCenter - 55, top: 232,
    fontSize: 11, fill: 'rgba(255,255,255,0.6)',
    fontFamily: 'Arial, sans-serif', fontStyle: 'italic',
    name: 'Tagline',
  }))

  canvas.add(new fabric.Rect({
    left: rightCenter - 35, top: 330,
    width: 70, height: 70,
    fill: '#ffffff', rx: 6, ry: 6,
    name: 'QR Placeholder',
  }))

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (Math.random() > 0.45) {
        canvas.add(new fabric.Rect({
          left: rightCenter - 30 + c * 12,
          top: 335 + r * 12,
          width: 10, height: 10,
          fill: '#1e3a5f',
          selectable: false, evented: false, name: 'QR Cell',
        }))
      }
    }
  }

  canvas.renderAll()
}

export function applyTemplate(canvas, template) {
  import('fabric').then(({ fabric }) => {
    canvas.clear()

    canvas.add(new fabric.Rect({
      left: 0, top: 0, width: CARD_W, height: CARD_H,
      fill: template.bgColor, selectable: false, evented: false, name: 'Background',
    }))

    canvas.add(new fabric.Path(
      `M ${CARD_W * 0.6} 0 Q ${CARD_W * 0.52} ${CARD_H * 0.5} ${CARD_W * 0.6} ${CARD_H} L ${CARD_W} ${CARD_H} L ${CARD_W} 0 Z`,
      { fill: template.accentColor, opacity: 0.85, selectable: false, evented: false, name: 'Accent Shape' }
    ))

    canvas.add(new fabric.IText('John Doe', {
      left: 48, top: 90, fontSize: 42,
      fill: template.textColor, fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Name Text',
    }))

    canvas.add(new fabric.IText('Chief Executive Officer', {
      left: 48, top: 148, fontSize: 16,
      fill: template.textColor, fontFamily: 'Arial, sans-serif', opacity: 0.75, name: 'Title Text',
    }))

    canvas.add(new fabric.Line([48, 185, 300, 185], {
      stroke: template.textColor, strokeWidth: 1, opacity: 0.2,
      selectable: false, evented: false, name: 'Divider',
    }))

    const contacts = [
      { text: '+91 9876543210', y: 205, name: 'Phone' },
      { text: 'john@databus.co', y: 232, name: 'Email' },
      { text: 'www.databus.co', y: 259, name: 'Website' },
      { text: '123 Business Street', y: 286, name: 'Address' },
    ]
    contacts.forEach(({ text, y, name }) => {
      canvas.add(new fabric.IText(text, {
        left: 48, top: y, fontSize: 14,
        fill: template.textColor, fontFamily: 'Arial, sans-serif', opacity: 0.8, name,
      }))
    })

    const rc = CARD_W * 0.79

    canvas.add(new fabric.Circle({
      left: rc - 50, top: 80, radius: 50,
      fill: 'rgba(255,255,255,0.12)',
      stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2, name: 'Logo',
    }))

    canvas.add(new fabric.IText('LOGO', {
      left: rc - 20, top: 114, fontSize: 13,
      fill: template.textColor, fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold', opacity: 0.5, name: 'Logo Label',
    }))

    canvas.add(new fabric.IText('DataBus Co.', {
      left: rc - 55, top: 200, fontSize: 22,
      fill: template.textColor, fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Company Name',
    }))

    canvas.add(new fabric.IText('Connecting the World', {
      left: rc - 55, top: 232, fontSize: 11,
      fill: template.textColor, fontFamily: 'Arial, sans-serif',
      fontStyle: 'italic', opacity: 0.6, name: 'Tagline',
    }))

    canvas.setBackgroundColor(template.bgColor, () => {})
    canvas.renderAll()
  })
}
