import useEditorStore from '@/store/editorStore'

// ─── Tiny construction helpers ───────────────────────────────────────────────

const setBg = (canvas, color) => { canvas.backgroundColor = color }

const IT = (fabric, fallbackStr, o) => {
  const name = o?.name?.toLowerCase()
  let text = fallbackStr
  if (name) {
    const profile = useEditorStore.getState().profileDetails
    let key = name
    if (name === 'alt phone') key = 'altPhone'
    const savedVal = profile[key]
    if (savedVal !== undefined && savedVal !== null && savedVal !== '') {
      text = savedVal
    }
  }
  return new fabric.IText(text, o)
}

const R   = (fabric, o)      => new fabric.Rect(o)
const C   = (fabric, o)      => new fabric.Circle(o)
const L   = (fabric, pts, o) => new fabric.Line(pts, o)
const P   = (fabric, d, o)   => new fabric.Path(d, o)
const PG  = (fabric, pts, o) => new fabric.Polygon(pts, o)

// ─── Reusable sub-builders ───────────────────────────────────────────────────

function addContacts(canvas, fabric, left, startY, step, color, opacity) {
  const list = [
    ['+91 9876543210', 'Phone'],
    ['john@example.com', 'Email'],
    ['www.example.com', 'Website'],
    ['123 Business Street, Suite 400', 'Address'],
  ]
  list.forEach(([txt, name], i) => {
    canvas.add(IT(fabric, txt, {
      left, top: startY + i * step,
      fontSize: 13, fill: color, opacity: opacity ?? 0.85,
      fontFamily: 'Arial, sans-serif', name,
    }))
  })
}

function logoCircle(canvas, fabric, cx, cy, r, stroke, fill) {
  const customSrc = useEditorStore.getState().customLogoSrc
  const profileLogo = useEditorStore.getState().profileDetails.logoSrc
  const logoUrl = customSrc || profileLogo

  if (logoUrl) {
    fabric.Image.fromURL(logoUrl, (img) => {
      const scale = (r * 2) / Math.min(img.width, img.height)
      img.set({
        originX: 'center',
        originY: 'center',
        left: cx,
        top: cy,
        scaleX: scale,
        scaleY: scale,
        name: 'Logo Image',
        clipPath: new fabric.Circle({
          radius: r,
          originX: 'center',
          originY: 'center',
          left: cx,
          top: cy,
          absolutePositioned: true,
        }),
      })
      canvas.add(img)
      canvas.renderAll()
    })
  } else {
    const company = useEditorStore.getState().profileDetails.company || 'Company'
    const companyInitial = company.trim().charAt(0).toUpperCase() || 'C'
    
    canvas.add(C(fabric, {
      left: cx - r, top: cy - r, radius: r,
      fill: fill ?? 'rgba(255,255,255,0.08)', stroke, strokeWidth: 1.5, name: 'Logo Circle',
      selectable: true, evented: true
    }))
    
    canvas.add(C(fabric, {
      left: cx - r + 3, top: cy - r + 3, radius: r - 3,
      fill: 'transparent', stroke, strokeWidth: 0.5, opacity: 0.4, name: 'Logo Inner Circle',
      selectable: true, evented: true
    }))
    
    canvas.add(IT(fabric, companyInitial, {
      left: cx, top: cy,
      fontSize: Math.round(r * 1.05), fill: stroke,
      fontFamily: 'Georgia, serif', fontWeight: 'bold',
      originX: 'center', originY: 'center', name: 'Logo Monogram',
      selectable: true, evented: true
    }))
  }
}

function personAvatar(canvas, fabric, cx, cy, r, stroke, fill) {
  const avatarUrl = useEditorStore.getState().profileDetails.avatarSrc

  if (avatarUrl) {
    fabric.Image.fromURL(avatarUrl, (img) => {
      const scale = (r * 2) / Math.min(img.width, img.height)
      img.set({
        originX: 'center',
        originY: 'center',
        left: cx,
        top: cy,
        scaleX: scale,
        scaleY: scale,
        name: 'Avatar Image',
        clipPath: new fabric.Circle({
          radius: r,
          originX: 'center',
          originY: 'center',
          left: cx,
          top: cy,
          absolutePositioned: true,
        }),
      })
      canvas.add(img)
      canvas.renderAll()
    })
  } else {
    canvas.add(C(fabric, {
      left: cx - r, top: cy - r, radius: r,
      fill: fill ?? 'rgba(255,255,255,0.08)', stroke, strokeWidth: 2, name: 'Avatar Circle',
    }))
    // Draw elegant user icon placeholder (head + shoulders arc)
    const headRadius = r * 0.35
    canvas.add(C(fabric, {
      left: cx - headRadius, top: cy - headRadius - r * 0.15, radius: headRadius,
      fill: stroke, opacity: 0.6, name: 'Avatar Icon Head',
    }))
    const shoulderPath = `M ${cx - r * 0.6} ${cy + r * 0.6} A ${r * 0.6} ${r * 0.6} 0 0 1 ${cx + r * 0.6} ${cy + r * 0.6} Z`
    canvas.add(P(fabric, shoulderPath, {
      fill: stroke, opacity: 0.6, name: 'Avatar Icon Shoulders',
    }))
  }
}

function qrBox(canvas, fabric, left, top, bgFill, cellFill, size) {
  size = size ?? 76
  canvas.add(R(fabric, {
    left, top, width: size, height: size,
    fill: bgFill, rx: 6, stroke: cellFill, strokeWidth: 1, opacity: 0.15,
    selectable: true, evented: true, name: 'QR Frame'
  }))
  
  const pad = 6
  const qrSize = size - pad * 2
  const grid = 9
  const cell = qrSize / grid
  
  const drawFinder = (x, y) => {
    canvas.add(R(fabric, { left: x, top: y, width: cell * 3, height: cell * 3, fill: cellFill, rx: 1, selectable: true, evented: true, name: 'QR Finder Outer' }))
    canvas.add(R(fabric, { left: x + cell * 0.5, top: y + cell * 0.5, width: cell * 2, height: cell * 2, fill: bgFill, rx: 0.5, selectable: true, evented: true, name: 'QR Finder Mid' }))
    canvas.add(R(fabric, { left: x + cell * 0.9, top: y + cell * 0.9, width: cell * 1.2, height: cell * 1.2, fill: cellFill, rx: 0.25, selectable: true, evented: true, name: 'QR Finder Inner' }))
  }
  
  drawFinder(left + pad, top + pad)
  drawFinder(left + pad + cell * 6, top + pad)
  drawFinder(left + pad, top + pad + cell * 6)
  
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      if ((row < 3 && col < 3) || (row < 3 && col >= 6) || (row >= 6 && col < 3)) {
        continue
      }
      if (row === 6 && col === 6) {
        canvas.add(R(fabric, { left: left + pad + col * cell, top: top + pad + row * cell, width: cell - 1, height: cell - 1, fill: cellFill, rx: 0.25, selectable: true, evented: true, name: 'QR Cell' }))
        continue
      }
      if (Math.random() > 0.42) {
        canvas.add(R(fabric, {
          left: left + pad + col * cell + 0.5,
          top: top + pad + row * cell + 0.5,
          width: cell - 1,
          height: cell - 1,
          fill: cellFill,
          rx: 0.25,
          selectable: true,
          evented: true,
          name: 'QR Cell'
        }))
      }
    }
  }
}

function stdBack(canvas, fabric, opts) {
  const { bg, wave, logoStroke, logoLabelColor, company, companyColor, tagline, taglineColor, website, websiteColor, qrBg, qrCell } = opts
  setBg(canvas, bg)
  const W = canvas.width, H = canvas.height
  const isV = H > W
  
  const accentColor = wave || logoStroke || '#94a3b8'

  canvas.add(R(fabric, {
    left: 28, top: 28, width: W - 56, height: H - 56,
    fill: 'transparent', stroke: accentColor, strokeWidth: 1, opacity: 0.18, rx: 4,
    selectable: true, evented: true, name: 'Frame Outer'
  }))
  canvas.add(R(fabric, {
    left: 34, top: 34, width: W - 68, height: H - 68,
    fill: 'transparent', stroke: accentColor, strokeWidth: 0.5, opacity: 0.08, rx: 3,
    selectable: true, evented: true, name: 'Frame Inner'
  }))

  if (isV) {
    logoCircle(canvas, fabric, W / 2, H * 0.23, 56, logoStroke)
    canvas.add(IT(fabric, company.toUpperCase(), {
      left: W / 2, top: H * 0.38, fontSize: 22,
      fill: companyColor ?? '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'bold',
      charSpacing: 50, originX: 'center', name: 'Company'
    }))
    canvas.add(L(fabric, [W / 2 - 80, H * 0.44, W / 2 + 80, H * 0.44], {
      stroke: accentColor, strokeWidth: 1, opacity: 0.3,
      selectable: true, evented: true
    }))
    canvas.add(IT(fabric, tagline, {
      left: W / 2, top: H * 0.47, fontSize: 11,
      fill: taglineColor ?? accentColor, fontFamily: 'Arial, sans-serif', fontStyle: 'italic',
      originX: 'center', name: 'Tagline'
    }))
    canvas.add(IT(fabric, website.toUpperCase(), {
      left: W / 2, top: H * 0.55, fontSize: 10,
      fill: websiteColor ?? '#94a3b8', fontFamily: 'Arial, sans-serif', charSpacing: 80,
      originX: 'center', name: 'Website'
    }))
    qrBox(canvas, fabric, W / 2 - 38, H - 120, qrBg || '#ffffff', qrCell || accentColor, 76)
  } else {
    logoCircle(canvas, fabric, W / 2, H * 0.22, 60, logoStroke)
    canvas.add(IT(fabric, company.toUpperCase(), {
      left: W / 2, top: H * 0.43, fontSize: 26,
      fill: companyColor ?? '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'bold',
      charSpacing: 60, originX: 'center', name: 'Company'
    }))
    canvas.add(L(fabric, [W / 2 - 120, H * 0.53, W / 2 + 120, H * 0.53], {
      stroke: accentColor, strokeWidth: 1.5, opacity: 0.3,
      selectable: true, evented: true
    }))
    canvas.add(IT(fabric, tagline, {
      left: W / 2, top: H * 0.58, fontSize: 12,
      fill: taglineColor ?? accentColor, fontFamily: 'Arial, sans-serif', fontStyle: 'italic',
      originX: 'center', name: 'Tagline'
    }))
    canvas.add(IT(fabric, website.toUpperCase(), {
      left: W / 2, top: H * 0.67, fontSize: 10,
      fill: websiteColor ?? '#94a3b8', fontFamily: 'Arial, sans-serif', charSpacing: 100,
      originX: 'center', name: 'Website'
    }))
    qrBox(canvas, fabric, W - 124, H - 124, qrBg || '#ffffff', qrCell || accentColor, 76)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  HORIZONTAL TEMPLATES  (900 × 540)
// ═══════════════════════════════════════════════════════════════════════════

function buildCorporateBlue_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M ' + (W*.58) + ' 0 Q ' + (W*.5) + ' ' + (H*.5) + ' ' + (W*.58) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill: '#4F46E5', opacity: 0.1, name: 'Accent Shape' }))
  canvas.add(P(fabric, 'M ' + (W*.63) + ' 0 Q ' + (W*.55) + ' ' + (H*.5) + ' ' + (W*.63) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill: '#6366f1', opacity: 0.05, name: 'Accent Layer 2' }))
  canvas.add(IT(fabric, 'Your Name', { left: 48, top: 88, fontSize: 42, fill: '#1e293b', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left: 48, top: 146, fontSize: 15, fill: '#64748b', fontFamily: 'Arial, sans-serif', name: 'Title' }))
  canvas.add(L(fabric, [48, 183, 300, 183], { stroke: '#e2e8f0', strokeWidth: 1, selectable:true,evented:true }))
  addContacts(canvas, fabric, 48, 200, 27, '#475569')
  personAvatar(canvas, fabric, W*.79, 128, 50, '#4F46E5')
  canvas.add(IT(fabric, 'Company Name', { left: W*.79 - 55, top: 202, fontSize: 21, fill: '#1e293b', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Company' }))
  canvas.add(IT(fabric, 'Connecting the World', { left: W*.79 - 55, top: 232, fontSize: 11, fill: '#64748b', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', name: 'Tagline' }))
}
function buildCorporateBlue_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg: '#ffffff', wave: '#4F46E5', logoStroke: '#4F46E5', company: 'Company Name', companyColor: '#1e293b', tagline: 'Connecting the World with Smarter Data', taglineColor: '#64748b', website: 'www.example.com', websiteColor: '#64748b', qrBg: '#f8fafc', qrCell: '#1e293b' })
}

function buildCorporateBlack_Front(canvas, fabric) {
  setBg(canvas, '#111111')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M 0 ' + (H*.72) + ' L ' + (W*.48) + ' 0 L ' + (W*.58) + ' 0 L ' + (W*.1) + ' ' + H + ' L 0 ' + H + ' Z', { fill: '#B8860B', opacity: 0.3, name: 'Gold Stripe' }))
  canvas.add(R(fabric, { left: 0, top: 0, width: 6, height: H, fill: '#FFD700', selectable:true,evented:true, name: 'Gold Bar' }))
  canvas.add(IT(fabric, 'YOUR NAME', { left: 48, top: 75, fontSize: 42, fill: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 80, name: 'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left: 50, top: 133, fontSize: 14, fill: '#FFD700', fontFamily: 'Arial, sans-serif', charSpacing: 40, name: 'Title' }))
  canvas.add(L(fabric, [48, 166, 380, 166], { stroke: '#FFD700', strokeWidth: 1, opacity: 0.45, selectable:true,evented:true }))
  addContacts(canvas, fabric, 50, 180, 27, '#d1d5db', 0.7)
  personAvatar(canvas, fabric, W - 130, 120, 65, '#FFD700', 'rgba(255,215,0,0.06)')
  canvas.add(IT(fabric, 'Company Name', { left: W - 190, top: 208, fontSize: 19, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Company' }))
  canvas.add(IT(fabric, 'Premium Data Solutions', { left: W - 186, top: 236, fontSize: 11, fill: '#FFD700', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', name: 'Tagline' }))
}
function buildCorporateBlack_Back(canvas, fabric) {
  setBg(canvas, '#111111')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#FFD700', strokeWidth: 1.5, opacity: 0.35, rx: 4, selectable: true, evented: true, name: 'Border Gold' }))
  canvas.add(R(fabric, { left: 30, top: 30, width: W - 60, height: H - 60, fill: 'transparent', stroke: '#FFD700', strokeWidth: 0.5, opacity: 0.15, rx: 3, selectable: true, evented: true, name: 'Border Gold Inner' }))
  canvas.add(new fabric.Polygon([{x:W/2,y:45},{x:W-70,y:H/2},{x:W/2,y:H-45},{x:70,y:H/2}], { fill: 'transparent', stroke: '#FFD700', strokeWidth: 1, opacity: 0.2, name: 'Diamond Outer' }))
  canvas.add(new fabric.Polygon([{x:W/2,y:55},{x:W-85,y:H/2},{x:W/2,y:H-55},{x:85,y:H/2}], { fill: 'transparent', stroke: '#FFD700', strokeWidth: 0.5, opacity: 0.1, name: 'Diamond Inner' }))
  logoCircle(canvas, fabric, W/2, H/2 - 40, 56, '#FFD700', 'rgba(255,215,0,0.04)')
  canvas.add(IT(fabric, 'COMPANY NAME', { left: W/2, top: H/2 + 35, fontSize: 24, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', charSpacing: 60, originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'Premium Data Solutions', { left: W/2, top: H/2 + 75, fontSize: 11, fill: '#FFD700', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', originX: 'center', name: 'Tagline' }))
  canvas.add(IT(fabric, 'www.company.com', { left: W/2, top: H/2 + 105, fontSize: 10, fill: '#888888', fontFamily: 'Arial, sans-serif', charSpacing: 80, originX: 'center', name: 'Website' }))
  qrBox(canvas, fabric, W - 116, H - 116, '#111111', '#FFD700', 76)
}

function buildGreenProfessional_Front(canvas, fabric) {
  setBg(canvas, '#064e3b')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 0, top: H*.58, width: W, height: H*.42, fill: '#065f46', selectable:true,evented:true }))
  canvas.add(P(fabric, 'M ' + (W*.65) + ' -20 Q ' + (W*.9) + ' ' + (H*.3) + ' ' + (W*.7) + ' ' + (H*.6), { fill: 'transparent', stroke: '#10b981', strokeWidth: 28, opacity: 0.12, selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Name', { left: 48, top: 80, fontSize: 42, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left: 48, top: 136, fontSize: 14, fill: '#6ee7b7', fontFamily: 'Arial, sans-serif', name: 'Title' }))
  canvas.add(L(fabric, [48, 168, 330, 168], { stroke: '#10b981', strokeWidth: 1.5, opacity: 0.5, selectable:true,evented:true }))
  addContacts(canvas, fabric, 48, 182, 27, '#d1fae5', 0.82)
  personAvatar(canvas, fabric, W - 120, 128, 55, '#6ee7b7')
  canvas.add(IT(fabric, 'Company Name', { left: W - 188, top: 206, fontSize: 19, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Company' }))
  canvas.add(IT(fabric, 'Green Tech Solutions', { left: W - 168, top: 234, fontSize: 11, fill: '#6ee7b7', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', name: 'Tagline' }))
}
function buildGreenProfessional_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg: '#022c22', wave: '#064e3b', logoStroke: '#10b981', company: 'Company Name', tagline: 'Sustainable Data Solutions', website: 'www.example.com', qrBg: '#064e3b', qrCell: '#10b981' })
}

function buildTechModern_Front(canvas, fabric) {
  setBg(canvas, '#0f172a')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 0, top: 0, width: 5, height: H, fill: '#7c3aed', selectable:true,evented:true }))
  for (let col = 2; col <= 10; col++) for (let row = 1; row <= 7; row++)
    canvas.add(C(fabric, { left: col*80-2, top: row*70-2, radius: 1.5, fill: 'rgba(124,58,237,0.18)', selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Name', { left: 30, top: 72, fontSize: 40, fill: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, '< Your Title />', { left: 32, top: 126, fontSize: 13, fill: '#a78bfa', fontFamily: 'Courier New, monospace', name: 'Title' }))
  canvas.add(L(fabric, [30, 160, 320, 160], { stroke: '#7c3aed', strokeWidth: 1, opacity: 0.5, selectable:true,evented:true }))
  ;['+91 9876543210','you@example.com','www.example.com','123 Business St.'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left: 32, top: 174+i*27, fontSize: 12, fill: '#cbd5e1', fontFamily: 'Courier New, monospace', name: ['Phone','Email','Website','Address'][i] })))
  personAvatar(canvas, fabric, W - 115, 126, 58, '#a78bfa')
  canvas.add(IT(fabric, 'COMPANY', { left: W-178, top: 212, fontSize: 17, fill: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 60, name: 'Company' }))
  canvas.add(IT(fabric, '// next-gen analytics', { left: W-168, top: 238, fontSize: 10, fill: '#7c3aed', fontFamily: 'Courier New, monospace', name: 'Tagline' }))
}
function buildTechModern_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg: '#0f172a', wave: '#7c3aed', logoStroke: '#a78bfa', company: 'COMPANY', companyColor: '#fff', tagline: '// next-gen data platform', taglineColor: '#7c3aed', website: 'example.com', websiteColor: '#94a3b8', qrBg: '#1e293b', qrCell: '#7c3aed' })
}

function buildFloralCreative_Front(canvas, fabric) {
  setBg(canvas, '#fdf2f8')
  const W = canvas.width, H = canvas.height
  ;[[W-40,-40,100,'#f9a8d4',0.3],[W-10,30,70,'#ec4899',0.2],[W-120,-20,80,'#fce7f3',0.5],[-30,H-50,80,'#f9a8d4',0.2],[20,H+10,60,'#fbcfe8',0.3]]
    .forEach(([x,y,r,f,op]) => canvas.add(C(fabric, { left:x-r,top:y-r,radius:r,fill:f,opacity:op,selectable:true,evented:true })))
  canvas.add(IT(fabric, 'Your Name', { left: 48, top: 80, fontSize: 40, fill: '#831843', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontStyle: 'italic', name: 'Name' }))
  canvas.add(IT(fabric, 'Creative Director', { left: 50, top: 133, fontSize: 14, fill: '#be185d', fontFamily: 'Georgia, serif', fontStyle: 'italic', name: 'Title' }))
  canvas.add(L(fabric, [48, 164, 300, 164], { stroke: '#f9a8d4', strokeWidth: 2, selectable:true,evented:true }))
  addContacts(canvas, fabric, 48, 178, 27, '#4b5563', 0.85)
  personAvatar(canvas, fabric, W - 140, 122, 62, '#ec4899', 'rgba(249,168,212,0.15)')
  canvas.add(IT(fabric, 'Studio Bloom', { left: W-196, top: 204, fontSize: 19, fill: '#831843', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontStyle: 'italic', name: 'Company' }))
  canvas.add(IT(fabric, 'Art & Design Agency', { left: W-180, top: 232, fontSize: 11, fill: '#be185d', fontFamily: 'Georgia, serif', fontStyle: 'italic', name: 'Tagline' }))
}
function buildFloralCreative_Back(canvas, fabric) {
  setBg(canvas, '#fce7f3')
  const W = canvas.width, H = canvas.height
  canvas.add(C(fabric, { left: W/2 - 240, top: -100, radius: 240, fill: '#fbcfe8', opacity: 0.45, selectable: true, evented: true }))
  canvas.add(C(fabric, { left: W - 120, top: H - 140, radius: 180, fill: '#f9a8d4', opacity: 0.35, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#ec4899', strokeWidth: 1, opacity: 0.2, rx: 8, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, 120, 60, '#ec4899', 'rgba(236,72,153,0.06)')
  canvas.add(IT(fabric, 'Studio Bloom', { left: W/2, top: 202, fontSize: 30, fill: '#831843', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontStyle: 'italic', originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'Where Creativity Blossoms', { left: W/2, top: 245, fontSize: 12, fill: '#be185d', fontFamily: 'Georgia, serif', fontStyle: 'italic', originX: 'center', name: 'Tagline' }))
  canvas.add(L(fabric, [W/2 - 60, 275, W/2 + 60, 275], { stroke: '#fda4af', strokeWidth: 1, opacity: 0.5 }))
  canvas.add(IT(fabric, '@studiobloom  ·  studiobloom.co', { left: W/2, top: 290, fontSize: 10, fill: '#9d174d', fontFamily: 'Arial, sans-serif', charSpacing: 30, originX: 'center', name: 'Handles' }))
  qrBox(canvas, fabric, W - 116, H - 116, '#ffffff', '#ec4899', 76)
}

function buildMinimalWhite_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:W,height:5,fill:'#4F46E5',selectable:true,evented:true }))
  canvas.add(R(fabric, { left:0,top:5,width:3,height:H-5,fill:'#4F46E5',opacity:0.12,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Name', { left:48,top:70,fontSize:40,fill:'#1e1b4b',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left:50,top:124,fontSize:14,fill:'#4F46E5',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [48,155,320,155], { stroke:'#e5e7eb',strokeWidth:1.5,selectable:true,evented:true }))
  addContacts(canvas, fabric, 48, 170, 27, '#374151', 0.88)
  canvas.add(L(fabric, [W-200,46,W-200,H-46], { stroke:'#e5e7eb',strokeWidth:1,selectable:true,evented:true }))
  personAvatar(canvas, fabric, W-140, 122, 60, '#4F46E5', '#eef2ff')
  canvas.add(IT(fabric, 'Company Name', { left:W-200,top:200,fontSize:18,fill:'#1e1b4b',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Company' }))
  canvas.add(IT(fabric, 'Connecting the World', { left:W-192,top:228,fontSize:11,fill:'#6b7280',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'Tagline' }))
}
function buildMinimalWhite_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#e5e7eb', strokeWidth: 1, rx: 2, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 30, top: 30, width: W - 60, height: H - 60, fill: 'transparent', stroke: '#f3f4f6', strokeWidth: 0.5, rx: 1.5, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, 120, 58, '#4F46E5', '#eef2ff')
  canvas.add(IT(fabric, 'Company Name', { left: W/2, top: 202, fontSize: 26, fill: '#1e1b4b', fontFamily: 'Georgia, serif', fontWeight: 'bold', originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'Connecting the World', { left: W/2, top: 242, fontSize: 12, fill: '#6b7280', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', originX: 'center', name: 'Tagline' }))
  canvas.add(L(fabric, [W/2 - 80, 274, W/2 + 80, 274], { stroke: '#4F46E5', strokeWidth: 1, opacity: 0.2 }))
  canvas.add(IT(fabric, 'WWW.EXAMPLE.COM', { left: W/2, top: 288, fontSize: 11, fill: '#4F46E5', fontFamily: 'Arial, sans-serif', charSpacing: 80, originX: 'center', name: 'Website' }))
  canvas.add(IT(fabric, 'hello@example.com  ·  +91 9876543210', { left: W/2, top: 316, fontSize: 10, fill: '#9ca3af', fontFamily: 'Arial, sans-serif', originX: 'center', name: 'Contact' }))
  qrBox(canvas, fabric, W - 116, H - 116, '#ffffff', '#4F46E5', 76)
}

// ═══════════════════════════════════════════════════════════════════════════
//  VERTICAL TEMPLATES  (540 × 900)
// ═══════════════════════════════════════════════════════════════════════════

function buildVerticalExecutive_Front(canvas, fabric) {
  setBg(canvas, '#0f172a')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:W,height:8,fill:'#d4a017',selectable:true,evented:true }))
  canvas.add(IT(fabric, 'YOUR NAME', { left:W/2,top:H*.1,fontSize:34,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',charSpacing:80,originX:'center',name:'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left:W/2,top:H*.19,fontSize:13,fill:'#d4a017',fontFamily:'Arial, sans-serif',charSpacing:30,originX:'center',name:'Title' }))
  canvas.add(L(fabric, [48,H*.27,W-48,H*.27], { stroke:'rgba(212,160,23,0.4)',strokeWidth:1,selectable:true,evented:true }))
  ;['+91 9876543210','+91 9876543211','john@example.com','www.example.com'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W/2,top:H*.3+i*38,fontSize:13,fill:'#cbd5e1',fontFamily:'Arial, sans-serif',opacity:0.85,originX:'center',name:['Phone','Alt Phone','Email','Website'][i] })))
  canvas.add(L(fabric, [48,H*.68,W-48,H*.68], { stroke:'rgba(212,160,23,0.25)',strokeWidth:1,selectable:true,evented:true }))
  personAvatar(canvas, fabric, W/2, H*.77, 48, '#d4a017', 'rgba(212,160,23,0.08)')
  canvas.add(IT(fabric, 'Company Name', { left:W/2,top:H*.87,fontSize:20,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Connecting the World', { left:W/2,top:H*.92,fontSize:11,fill:'rgba(212,160,23,0.75)',fontFamily:'Arial, sans-serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(R(fabric, { left:0,top:H-8,width:W,height:8,fill:'#d4a017',selectable:true,evented:true }))
}
function buildVerticalExecutive_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg:'#0f172a',wave:'#d4a017',logoStroke:'#d4a017',company:'Company Name',tagline:'Premium Data Solutions Worldwide',website:'www.example.com',qrBg:'#1e293b',qrCell:'#d4a017' })
}

function buildVerticalMinimal_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:5,height:H,fill:'#6366f1',selectable:true,evented:true }))
  canvas.add(R(fabric, { left:0,top:H*.75,width:W,height:H*.25,fill:'#6366f1',selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Name', { left:28,top:H*.1,fontSize:38,fill:'#1e1b4b',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Name' }))
  canvas.add(L(fabric, [28,H*.19,W-28,H*.19], { stroke:'#e5e7eb',strokeWidth:1.5,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Title', { left:28,top:H*.22,fontSize:14,fill:'#6366f1',fontFamily:'Arial, sans-serif',name:'Title' }))
  ;['Phone: +91 9876543210','Email: john@example.com','Web: www.example.com','Addr: 123 Business Street'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:28,top:H*.3+i*44,fontSize:12,fill:'#374151',fontFamily:'Arial, sans-serif',opacity:0.85,name:['Phone','Email','Website','Address'][i] })))
  personAvatar(canvas, fabric, W/2, H*.63, 50, '#6366f1', '#eef2ff')
  canvas.add(IT(fabric, 'Company Name', { left:W/2,top:H*.73,fontSize:13,fill:'#1e1b4b',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'www.example.com', { left:W/2,top:H*.78,fontSize:13,fill:'#fff',fontFamily:'Arial, sans-serif',originX:'center',name:'Website Block' }))
  canvas.add(IT(fabric, 'Connecting the World', { left:W/2,top:H*.84,fontSize:11,fill:'rgba(255,255,255,0.65)',fontFamily:'Arial, sans-serif',fontStyle:'italic',originX:'center',name:'Tagline Block' }))
}
function buildVerticalMinimal_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg:'#ffffff',wave:'#6366f1',logoStroke:'#6366f1',company:'Company Name',companyColor:'#1e1b4b',tagline:'Connecting the World',taglineColor:'#6366f1',website:'www.example.com',websiteColor:'#6b7280',qrBg:'#eef2ff',qrCell:'#6366f1' })
}

function buildVerticalCreative_Front(canvas, fabric) {
  setBg(canvas, '#120524')
  const W = canvas.width, H = canvas.height
  ;[[200,0.12,'#a855f7'],[140,0.18,'#7c3aed'],[90,0.28,'#a855f7'],[50,0.4,'#c084fc']].forEach(([r,op,col]) =>
    canvas.add(C(fabric, { left:W/2-r,top:H*.08-r,radius:r,fill:col,opacity:op,selectable:true,evented:true })))
  canvas.add(IT(fabric, 'Your Name', { left:W/2,top:H*.37,fontSize:36,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',originX:'center',name:'Name' }))
  canvas.add(IT(fabric, 'Creative Technologist', { left:W/2,top:H*.44,fontSize:13,fill:'#c084fc',fontFamily:'Arial, sans-serif',charSpacing:30,originX:'center',name:'Title' }))
  canvas.add(L(fabric, [W/2-80,H*.51,W/2+80,H*.51], { stroke:'rgba(168,85,247,0.4)',strokeWidth:1,selectable:true,evented:true }))
  ;['+91 9876543210','john@creativeco.io','creativeco.io','@johncreative'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W/2,top:H*.54+i*40,fontSize:12,fill:'#e2d9f3',fontFamily:'Courier New, monospace',opacity:0.8,originX:'center',name:['Phone','Email','Website','Instagram'][i] })))
  canvas.add(IT(fabric, 'Creative Co.', { left:W/2,top:H*.83,fontSize:22,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, '— Design & Technology —', { left:W/2,top:H*.89,fontSize:10,fill:'rgba(192,132,252,0.7)',fontFamily:'Arial, sans-serif',originX:'center',name:'Tagline' }))
}
function buildVerticalCreative_Back(canvas, fabric) {
  setBg(canvas, '#120524')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#a855f7', strokeWidth: 1.5, opacity: 0.25, rx: 6, selectable: true, evented: true }))
  ;[[280,0.05],[200,0.09],[130,0.14],[80,0.2],[44,0.3]].forEach(([r,op]) =>
    canvas.add(C(fabric, { left:W/2-r,top:H*.32-r,radius:r,fill:'#a855f7',opacity:op,selectable:true,evented:true })))
  logoCircle(canvas, fabric, W/2, H*0.32, 44, '#a855f7', 'rgba(168,85,247,0.04)')
  canvas.add(IT(fabric, 'Creative Co.', { left:W/2,top:H*.54,fontSize:28,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Design & Technology', { left:W/2,top:H*.62,fontSize:13,fill:'#c084fc',fontFamily:'Arial, sans-serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(IT(fabric, 'creativeco.io', { left:W/2,top:H*.69,fontSize:11,fill:'rgba(255,255,255,0.4)',fontFamily:'Courier New, monospace',originX:'center',name:'Website' }))
  qrBox(canvas, fabric, W/2-36, H*.76, '#1e0433', '#a855f7', 72)
}

function buildVerticalBotanical_Front(canvas, fabric) {
  setBg(canvas, '#052e16')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M ' + W + ' 0 Q ' + (W*.5) + ' ' + (H*.15) + ' ' + (W*.9) + ' ' + (H*.35), { fill:'transparent',stroke:'#4ade80',strokeWidth:22,opacity:0.1,selectable:true,evented:true }))
  ;[[W*.9,H*.05,80,0.12],[W*.15,H*.9,100,0.1]].forEach(([cx,cy,r,op]) =>
    canvas.add(C(fabric, { left:cx-r,top:cy-r,radius:r,fill:'#4ade80',opacity:op,selectable:true,evented:true })))
  canvas.add(IT(fabric, 'Your Name', { left:W/2,top:H*.12,fontSize:36,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Name' }))
  canvas.add(IT(fabric, 'Sustainability Consultant', { left:W/2,top:H*.2,fontSize:13,fill:'#86efac',fontFamily:'Arial, sans-serif',originX:'center',name:'Title' }))
  canvas.add(L(fabric, [48,H*.27,W-48,H*.27], { stroke:'rgba(74,222,128,0.3)',strokeWidth:1,selectable:true,evented:true }))
  ;['+91 9876543210','jane@earthco.com','www.earthco.com','Nature Valley, Suite 4'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W/2,top:H*.3+i*40,fontSize:12,fill:'#bbf7d0',fontFamily:'Arial, sans-serif',opacity:0.85,originX:'center',name:['Phone','Email','Website','Address'][i] })))
  personAvatar(canvas, fabric, W/2, H*.72, 50, '#4ade80', 'rgba(74,222,128,0.08)')
  canvas.add(IT(fabric, 'Earth Co.', { left:W/2,top:H*.83,fontSize:20,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Organic & Sustainable', { left:W/2,top:H*.89,fontSize:11,fill:'rgba(74,222,128,0.75)',fontFamily:'Georgia, serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
}
function buildVerticalBotanical_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg:'#021a0d',wave:'#064e3b',logoStroke:'#4ade80',company:'Earth Co.',tagline:'Organic & Sustainable Living',website:'www.earthco.com',qrBg:'#064e3b',qrCell:'#4ade80' })
}

// ═══════════════════════════════════════════════════════════════════════════
//  INDUSTRY TEMPLATES  (900 × 540)
// ═══════════════════════════════════════════════════════════════════════════

function buildMedical_Front(canvas, fabric) {
  setBg(canvas, '#f0f9ff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:W*.36,height:H,fill:'#0ea5e9',selectable:true,evented:true }))
  canvas.add(R(fabric, { left:W*.36,top:0,width:4,height:H,fill:'#0284c7',selectable:true,evented:true }))
  const cx=W*.18,cy=H*.42,cs=48,ct=14
  canvas.add(R(fabric, { left:cx-ct/2,top:cy-cs/2,width:ct,height:cs,fill:'rgba(255,255,255,0.85)',rx:3,selectable:true,evented:true,name:'Cross V' }))
  canvas.add(R(fabric, { left:cx-cs/2,top:cy-ct/2,width:cs,height:ct,fill:'rgba(255,255,255,0.85)',rx:3,selectable:true,evented:true,name:'Cross H' }))
  canvas.add(IT(fabric, 'HealthCare', { left:W*.18,top:H*.22,fontSize:18,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Clinic Name' }))
  canvas.add(IT(fabric, 'Clinic & Hospital', { left:W*.18,top:H*.32,fontSize:10,fill:'rgba(255,255,255,0.8)',fontFamily:'Arial, sans-serif',originX:'center',name:'Clinic Sub' }))
  canvas.add(IT(fabric, 'Dr. Your Name, MD', { left:W*.4,top:64,fontSize:32,fill:'#0c4a6e',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Senior Cardiologist', { left:W*.4,top:108,fontSize:14,fill:'#0ea5e9',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [W*.4,135,W-40,135], { stroke:'#bae6fd',strokeWidth:1.5,selectable:true,evented:true }))
  ;['+91 9876543210','dr.john@healthcare.com','www.healthcare.com','123 Medical Plaza, City'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W*.4,top:150+i*28,fontSize:13,fill:'#0369a1',opacity:0.85,fontFamily:'Arial, sans-serif',name:['Phone','Email','Website','Address'][i] })))
  canvas.add(IT(fabric, 'MBBS, MD (Cardiology)', { left:W*.4,top:H-46,fontSize:11,fill:'#64748b',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'Credentials' }))
}
function buildMedical_Back(canvas, fabric) {
  setBg(canvas, '#f0f9ff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#0ea5e9', strokeWidth: 1.5, opacity: 0.25, rx: 6, selectable: true, evented: true }))
  for (let i = 1; i <= 5; i++) {
    canvas.add(L(fabric, [24 + i * (W-48)/6, 24, 24 + i * (W-48)/6, H - 24], { stroke: '#0ea5e9', strokeWidth: 0.5, opacity: 0.05, selectable: true, evented: true }))
    canvas.add(L(fabric, [24, 24 + i * (H-48)/6, W - 24, 24 + i * (H-48)/6], { stroke: '#0ea5e9', strokeWidth: 0.5, opacity: 0.05, selectable: true, evented: true }))
  }
  logoCircle(canvas, fabric, W/2, H*.36, 58, '#0ea5e9', 'rgba(14,165,233,0.06)')
  canvas.add(IT(fabric, 'HealthCare Clinic', { left:W/2,top:H*.53,fontSize:26,fill:'#0c4a6e',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'EXCELLENCE IN PATIENT CARE', { left:W/2,top:H*.63,fontSize:10,fill:'#0ea5e9',fontFamily:'Arial, sans-serif',charSpacing:40,originX:'center',name:'Tagline' }))
  canvas.add(L(fabric, [W/2 - 60, H*.7, W/2 + 60, H*.7], { stroke: '#0ea5e9', strokeWidth: 1, opacity: 0.25 }))
  canvas.add(IT(fabric, 'www.healthcare.com', { left:W/2,top:H*.74,fontSize:11,fill:'#64748b',fontFamily:'Arial, sans-serif',charSpacing:60,originX:'center',name:'Website' }))
  qrBox(canvas, fabric, W-116, H-116, '#ffffff', '#0ea5e9', 76)
}

function buildLegal_Front(canvas, fabric) {
  setBg(canvas, '#0c1a2e')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:W-6,top:0,width:6,height:H,fill:'#c9a227',selectable:true,evented:true }))
  canvas.add(R(fabric, { left:30,top:20,width:W-66,height:1,fill:'#c9a227',opacity:0.25,selectable:true,evented:true }))
  canvas.add(R(fabric, { left:30,top:H-22,width:W-66,height:1,fill:'#c9a227',opacity:0.25,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'James Anderson', { left:90,top:72,fontSize:38,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Name' }))
  canvas.add(IT(fabric, 'Attorney at Law', { left:92,top:122,fontSize:14,fill:'#c9a227',fontFamily:'Georgia, serif',charSpacing:40,name:'Title' }))
  canvas.add(L(fabric, [90,152,500,152], { stroke:'rgba(201,162,39,0.3)',strokeWidth:1,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Bar No. CA-123456', { left:92,top:168,fontSize:12,fill:'rgba(255,255,255,0.45)',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'Bar No' }))
  ;['+91 9876543210','james@andersonlaw.com','www.andersonlaw.com'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:92,top:196+i*28,fontSize:13,fill:'#d1d5db',fontFamily:'Arial, sans-serif',name:['Phone','Email','Website'][i] })))
  personAvatar(canvas, fabric, W-130, 120, 58, '#c9a227', 'rgba(201,162,39,0.06)')
  canvas.add(IT(fabric, 'Anderson & Partners', { left:W-210,top:200,fontSize:16,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Company' }))
  canvas.add(IT(fabric, 'Law Firm', { left:W-155,top:226,fontSize:11,fill:'#c9a227',fontFamily:'Georgia, serif',name:'Tagline' }))
}
function buildLegal_Back(canvas, fabric) {
  setBg(canvas, '#0c1a2e')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 20, top: 20, width: W - 40, height: H - 40, fill: 'transparent', stroke: '#c9a227', strokeWidth: 1.5, opacity: 0.4, rx: 2, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 26, top: 26, width: W - 52, height: H - 52, fill: 'transparent', stroke: '#c9a227', strokeWidth: 0.5, opacity: 0.15, rx: 1, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H*0.35, 62, '#c9a227', 'rgba(201,162,39,0.06)')
  canvas.add(IT(fabric, 'Anderson & Partners'.toUpperCase(), { left: W/2, top: H*0.53, fontSize: 24, fill: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontStyle: 'italic', charSpacing: 30, originX: 'center', name: 'Company' }))
  canvas.add(L(fabric, [W/2 - 90, H*0.61, W/2 + 90, H*0.61], { stroke: '#c9a227', strokeWidth: 1.2, opacity: 0.35 }))
  canvas.add(IT(fabric, 'EXCELLENCE · INTEGRITY · JUSTICE', { left: W/2, top: H*0.65, fontSize: 10, fill: 'rgba(255,255,255,0.45)', fontFamily: 'Georgia, serif', charSpacing: 60, originX: 'center', name: 'Motto' }))
  canvas.add(IT(fabric, 'www.andersonlaw.com', { left: W/2, top: H*0.72, fontSize: 11, fill: '#c9a227', fontFamily: 'Arial, sans-serif', charSpacing: 80, originX: 'center', name: 'Website' }))
  qrBox(canvas, fabric, W - 116, H - 116, '#0c1a2e', '#c9a227', 76)
}

function buildRealEstate_Front(canvas, fabric) {
  setBg(canvas, '#1c1917')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M ' + (W*.6) + ' 0 Q ' + (W*.53) + ' ' + (H*.5) + ' ' + (W*.6) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill:'#d97706',opacity:0.9,selectable:true,evented:true,name:'Accent Shape' }))
  canvas.add(P(fabric, 'M ' + (W*.65) + ' 0 Q ' + (W*.58) + ' ' + (H*.5) + ' ' + (W*.65) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill:'#b45309',opacity:0.5,selectable:true,evented:true }))
  const hx=W*.82,hy=90,hs=40
  canvas.add(P(fabric, 'M ' + hx + ' ' + (hy+hs) + ' L ' + (hx-hs) + ' ' + (hy+hs) + ' L ' + (hx-hs) + ' ' + (hy+hs*.4) + ' L ' + hx + ' ' + hy + ' L ' + (hx+hs) + ' ' + (hy+hs*.4) + ' L ' + (hx+hs) + ' ' + (hy+hs) + ' Z', { fill:'rgba(255,255,255,0.15)',stroke:'rgba(255,255,255,0.3)',strokeWidth:1.5,selectable:true,evented:true,name:'House Icon' }))
  canvas.add(IT(fabric, 'REALTOR®', { left:W*.82,top:hy+hs+12,fontSize:9,fill:'rgba(255,255,255,0.7)',fontFamily:'Arial, sans-serif',fontWeight:'bold',originX:'center',name:'Designation' }))
  canvas.add(IT(fabric, 'Sarah Chen', { left:45,top:72,fontSize:40,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Name' }))
  canvas.add(IT(fabric, 'Licensed Real Estate Agent', { left:47,top:124,fontSize:13,fill:'#fcd34d',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [46,153,320,153], { stroke:'rgba(252,211,77,0.3)',strokeWidth:1,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'DRE# 01234567', { left:48,top:168,fontSize:12,fill:'rgba(255,255,255,0.4)',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'DRE' }))
  ;['+91 9876543210','sarah@premierrealty.com','www.premierrealty.com'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:48,top:192+i*29,fontSize:13,fill:'#d1d5db',fontFamily:'Arial, sans-serif',name:['Phone','Email','Website'][i] })))
  canvas.add(IT(fabric, 'Premier Realty Group', { left:W*.63,top:H*.73,fontSize:16,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Company' }))
}
function buildRealEstate_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg:'#1c1917',wave:'#d97706',logoStroke:'#fbbf24',company:'Premier Realty',tagline:'Your Dream Home Awaits',website:'www.premierrealty.com',qrBg:'#292524',qrCell:'#d97706' })
}

function buildFood_Front(canvas, fabric) {
  setBg(canvas, '#2d0f07')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M ' + (W*.56) + ' 0 Q ' + (W*.48) + ' ' + (H*.5) + ' ' + (W*.56) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill:'#c2410c',opacity:0.85,selectable:true,evented:true }))
  canvas.add(P(fabric, 'M ' + (W*.62) + ' 0 Q ' + (W*.54) + ' ' + (H*.5) + ' ' + (W*.62) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill:'#ea580c',opacity:0.5,selectable:true,evented:true }))
  canvas.add(R(fabric, { left:12,top:12,width:W*.5,height:H-24,fill:'transparent',stroke:'rgba(255,150,50,0.1)',strokeWidth:1,rx:2,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Bella Cucina', { left:40,top:62,fontSize:38,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Restaurant Name' }))
  canvas.add(IT(fabric, '— Fine Italian Dining —', { left:40,top:113,fontSize:12,fill:'#fdba74',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Cuisine' }))
  canvas.add(L(fabric, [38,140,300,140], { stroke:'rgba(251,146,60,0.3)',strokeWidth:1,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Marco Rossi', { left:40,top:156,fontSize:22,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Chef Name' }))
  canvas.add(IT(fabric, 'Executive Chef & Owner', { left:40,top:186,fontSize:13,fill:'#fdba74',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [38,214,300,214], { stroke:'rgba(251,146,60,0.2)',strokeWidth:1,selectable:true,evented:true }))
  ;['+91 9876543210','reservations@bellacucina.com','123 Culinary Avenue'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:40,top:224+i*28,fontSize:13,fill:'#fcd9b6',fontFamily:'Arial, sans-serif',opacity:0.85,name:['Reservations','Email','Address'][i] })))
  personAvatar(canvas, fabric, W*.78, 128, 52, '#fdba74', 'rgba(253,186,116,0.08)')
  canvas.add(IT(fabric, 'bellacucina.com', { left:W*.63,top:H*.75,fontSize:12,fill:'rgba(255,255,255,0.65)',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Website' }))
}
function buildFood_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg:'#2d0f07',wave:'#c2410c',logoStroke:'#fdba74',company:'Bella Cucina',tagline:'Fine Italian Dining Experience',website:'www.bellacucina.com',qrBg:'#3d1a0d',qrCell:'#f97316' })
}

function buildPhotography_Front(canvas, fabric) {
  setBg(canvas, '#0a0a0a')
  const W = canvas.width, H = canvas.height
  const ox=W*.78, oy=H/2
  ;[[120,0.1],[90,0.15],[65,0.2],[44,0.28],[26,0.35],[12,0.45]].forEach(([r,op]) =>
    canvas.add(C(fabric, { left:ox-r,top:oy-r,radius:r,fill:'transparent',stroke:'#e2e8f0',strokeWidth:1.5,opacity:op,selectable:true,evented:true })))
  canvas.add(C(fabric, { left:ox-8,top:oy-8,radius:8,fill:'#e2e8f0',opacity:0.5,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Alex Kim', { left:44,top:82,fontSize:46,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Photography', { left:46,top:140,fontSize:20,fill:'#94a3b8',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Title' }))
  canvas.add(L(fabric, [44,176,300,176], { stroke:'rgba(255,255,255,0.1)',strokeWidth:1,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Portraits  ·  Events  ·  Commercial', { left:46,top:192,fontSize:12,fill:'#64748b',fontFamily:'Arial, sans-serif',charSpacing:20,name:'Specialty' }))
  ;['+91 9876543210','alex@alexkim.co','alexkim.co','@alexkimphoto'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:46,top:218+i*28,fontSize:13,fill:'#e2e8f0',fontFamily:'Arial, sans-serif',opacity:0.8,name:['Phone','Email','Website','Instagram'][i] })))
}
function buildPhotography_Back(canvas, fabric) {
  setBg(canvas, '#0a0a0a')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#e2e8f0', strokeWidth: 1.5, opacity: 0.15, rx: 6, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 30, top: 30, width: W - 60, height: H - 60, fill: 'transparent', stroke: '#e2e8f0', strokeWidth: 0.5, opacity: 0.05, rx: 5, selectable: true, evented: true }))
  const ox=W/2, oy=H*.35
  ;[[110,0.05],[80,0.09],[55,0.14],[35,0.22]].forEach(([r,op]) =>
    canvas.add(C(fabric, { left:ox-r,top:oy-r,radius:r,fill:'transparent',stroke:'#e2e8f0',strokeWidth:1,opacity:op,selectable:true,evented:true })))
  logoCircle(canvas, fabric, W/2, oy, 48, '#ffffff', 'transparent')
  canvas.add(IT(fabric, 'Alex Kim Photography'.toUpperCase(), { left: W/2, top: H*0.57, fontSize: 22, fill: '#ffffff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 60, originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'PORTRAITS · EVENTS · COMMERCIAL', { left: W/2, top: H*0.66, fontSize: 10, fill: '#94a3b8', fontFamily: 'Arial, sans-serif', charSpacing: 40, originX: 'center', name: 'Specialty' }))
  canvas.add(L(fabric, [W/2 - 70, H*0.72, W/2 + 70, H*0.72], { stroke: '#e2e8f0', strokeWidth: 1, opacity: 0.2 }))
  canvas.add(IT(fabric, 'alexkim.co  ·  @alexkimphoto', { left: W/2, top: H*0.76, fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontFamily: 'Arial, sans-serif', charSpacing: 20, originX: 'center', name: 'Handles' }))
  qrBox(canvas, fabric, W-116, H-116, '#111', '#e2e8f0', 76)
}

function buildBeauty_Front(canvas, fabric) {
  setBg(canvas, '#fff0f3')
  const W = canvas.width, H = canvas.height
  ;[[W,-20,130,0.25],[W-20,30,80,0.18],[-20,H-30,100,0.15],[40,H+10,70,0.12]].forEach(([x,y,r,op]) =>
    canvas.add(C(fabric, { left:x-r,top:y-r,radius:r,fill:'#fda4af',opacity:op,selectable:true,evented:true })))
  canvas.add(IT(fabric, 'Emma Williams', { left:45,top:70,fontSize:36,fill:'#4a0518',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Name' }))
  canvas.add(IT(fabric, 'Master Stylist & Beauty Consultant', { left:47,top:118,fontSize:13,fill:'#e11d48',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [45,148,330,148], { stroke:'#fda4af',strokeWidth:2,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Cut  ·  Color  ·  Nails  ·  Facials', { left:47,top:162,fontSize:12,fill:'#be123c',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Services' }))
  ;['+91 9876543210','emma@bellasalon.com','www.bellasalon.com','@bellasalonofficial'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:47,top:188+i*28,fontSize:13,fill:'#4b5563',fontFamily:'Arial, sans-serif',opacity:0.85,name:['Phone','Email','Website','Instagram'][i] })))
  personAvatar(canvas, fabric, W-145, 116, 60, '#e11d48', 'rgba(225,29,72,0.06)')
  canvas.add(IT(fabric, 'Bella Salon', { left:W-202,top:196,fontSize:20,fill:'#4a0518',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Company' }))
  canvas.add(IT(fabric, '& Spa Studio', { left:W-186,top:224,fontSize:13,fill:'#e11d48',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Tagline' }))
}
function buildBeauty_Back(canvas, fabric) {
  setBg(canvas, '#fff0f3')
  const W = canvas.width, H = canvas.height
  canvas.add(C(fabric, { left: W/2 - 180, top: -60, radius: 220, fill: '#fecdd3', opacity: 0.5, selectable: true, evented: true }))
  canvas.add(C(fabric, { left: W - 80, top: H - 80, radius: 140, fill: '#fda4af', opacity: 0.25, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#e11d48', strokeWidth: 1, opacity: 0.2, rx: 8, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, 120, 60, '#e11d48', 'rgba(225,29,72,0.04)')
  canvas.add(IT(fabric, 'Bella Salon & Spa', { left: W/2, top: 200, fontSize: 26, fill: '#4a0518', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontStyle: 'italic', originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'Where Beauty Meets Confidence', { left: W/2, top: 240, fontSize: 12, fill: '#e11d48', fontFamily: 'Georgia, serif', fontStyle: 'italic', originX: 'center', name: 'Tagline' }))
  canvas.add(L(fabric, [W/2 - 60, 270, W/2 + 60, 270], { stroke: '#fda4af', strokeWidth: 1, opacity: 0.5 }))
  canvas.add(IT(fabric, '@bellasalonofficial  ·  bellasalon.com', { left: W/2, top: 282, fontSize: 10, fill: '#9f1239', fontFamily: 'Arial, sans-serif', charSpacing: 20, originX: 'center', name: 'Handles' }))
  qrBox(canvas, fabric, W - 116, H - 116, '#ffffff', '#e11d48', 76)
}

function buildTechStartup_Front(canvas, fabric) {
  setBg(canvas, '#020617')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:5,height:H,fill:'#22c55e',selectable:true,evented:true }))
  for (let col=1;col<=11;col++) for (let row=1;row<=7;row++)
    canvas.add(C(fabric, { left:col*76-2,top:row*70-2,radius:1.5,fill:'rgba(34,197,94,0.13)',selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Alex Rivera', { left:30,top:68,fontSize:42,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Co-founder & Lead Engineer', { left:32,top:124,fontSize:13,fill:'#22c55e',fontFamily:'Courier New, monospace',name:'Title' }))
  canvas.add(L(fabric, [30,156,340,156], { stroke:'rgba(34,197,94,0.35)',strokeWidth:1,selectable:true,evented:true }))
  ;['+91 9876543210','alex@launchpad.io','github.com/alexrivera','launchpad.io'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:32,top:170+i*28,fontSize:12,fill:'#94a3b8',fontFamily:'Courier New, monospace',name:['Phone','Email','GitHub','Website'][i] })))
  logoCircle(canvas, fabric, W-130, 116, 58, '#22c55e', 'rgba(34,197,94,0.06)')
  canvas.add(IT(fabric, 'Launchpad', { left:W-200,top:196,fontSize:20,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',name:'Company' }))
  canvas.add(IT(fabric, '// build · ship · iterate', { left:W-196,top:224,fontSize:10,fill:'#22c55e',fontFamily:'Courier New, monospace',name:'Tagline' }))
}
function buildTechStartup_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg:'#020617',wave:'#166534',logoStroke:'#22c55e',company:'Launchpad',tagline:'// build · ship · iterate',taglineColor:'#22c55e',website:'launchpad.io',websiteColor:'#94a3b8',qrBg:'#071a0e',qrCell:'#22c55e' })
}

function buildConsulting_Front(canvas, fabric) {
  setBg(canvas, '#1e293b')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:W,height:4,fill:'#fbbf24',selectable:true,evented:true }))
  canvas.add(R(fabric, { left:W-5,top:4,width:5,height:H-4,fill:'rgba(251,191,36,0.35)',selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Robert Chen, CFA', { left:45,top:60,fontSize:36,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Senior Financial Consultant', { left:47,top:108,fontSize:14,fill:'#fbbf24',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [45,137,380,137], { stroke:'rgba(251,191,36,0.25)',strokeWidth:1,selectable:true,evented:true }))
  canvas.add(IT(fabric, '15+ Yrs · AUM $2B+ · Top 1% Advisor', { left:47,top:153,fontSize:11,fill:'rgba(255,255,255,0.38)',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'Credentials' }))
  ;['+91 9876543210','robert@apexfinance.com','www.apexfinance.com','linkedin.com/in/robertchenCFA'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:47,top:174+i*28,fontSize:13,fill:'#cbd5e1',fontFamily:'Arial, sans-serif',name:['Phone','Email','Website','LinkedIn'][i] })))
  logoCircle(canvas, fabric, W-135, 112, 60, '#fbbf24', 'rgba(251,191,36,0.06)')
  canvas.add(IT(fabric, 'Apex Finance', { left:W-205,top:192,fontSize:19,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Company' }))
  canvas.add(IT(fabric, 'Wealth Management Group', { left:W-213,top:220,fontSize:11,fill:'#fbbf24',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'Tagline' }))
}
function buildConsulting_Back(canvas, fabric) {
  setBg(canvas, '#1e293b')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:W,height:4,fill:'#fbbf24',selectable:true,evented:true }))
  canvas.add(R(fabric, { left: 20, top: 20, width: W - 40, height: H - 40, fill: 'transparent', stroke: '#fbbf24', strokeWidth: 1.5, opacity: 0.35, rx: 4, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 26, top: 26, width: W - 52, height: H - 52, fill: 'transparent', stroke: '#fbbf24', strokeWidth: 0.5, opacity: 0.1, rx: 3, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H/2 - 38, 58, '#fbbf24', 'rgba(251,191,36,0.04)')
  canvas.add(IT(fabric, 'Apex Finance Group'.toUpperCase(), { left: W/2, top: H/2 + 35, fontSize: 24, fill: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'bold', charSpacing: 40, originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'Wealth Management · Investment Advisory', { left: W/2, top: H/2 + 75, fontSize: 11, fill: '#fbbf24', fontFamily: 'Arial, sans-serif', charSpacing: 10, originX: 'center', name: 'Tagline' }))
  canvas.add(L(fabric, [W/2 - 80, H/2 + 105, W/2 + 80, H/2 + 105], { stroke: '#fbbf24', strokeWidth: 1, opacity: 0.3 }))
  canvas.add(IT(fabric, 'Excellence Since 2005', { left: W/2, top: H/2 + 115, fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'Georgia, serif', fontStyle: 'italic', originX: 'center', name: 'Est' }))
  qrBox(canvas, fabric, W - 116, H - 116, '#0f172a', '#fbbf24', 76)
}

// ═══════════════════════════════════════════════════════════════════════════
//  BUILDERS MAP & PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
//  SQUARE TEMPLATES  (720 × 720)
// ═══════════════════════════════════════════════════════════════════════════

function buildSquareMinimal_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:W*.1,top:H*.1,width:W*.8,height:H*.8,fill:'transparent',stroke:'#e2e8f0',strokeWidth:2,rx:4,selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Name', { left:W/2,top:H*.3,fontSize:42,fill:'#1e293b',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left:W/2,top:H*.38,fontSize:16,fill:'#3b82f6',fontFamily:'Arial, sans-serif',originX:'center',name:'Title' }))
  canvas.add(L(fabric, [W*.3,H*.45,W*.7,H*.45], { stroke:'#e5e7eb',strokeWidth:1.5,selectable:true,evented:true }))
  ;['+91 9876543210','hello@example.com','www.example.com'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W/2,top:H*.5+i*40,fontSize:14,fill:'#475569',fontFamily:'Arial, sans-serif',originX:'center',name:['Phone','Email','Website'][i] })))
}
function buildSquareMinimal_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 0, top: H * 0.5, width: W, height: H * 0.5, fill: '#f8fafc', selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#cbd5e1', strokeWidth: 1, rx: 4, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H * 0.28, 58, '#3b82f6', '#eff6ff')
  canvas.add(IT(fabric, 'Company Name', { left:W/2,top:H*.55,fontSize:26,fill:'#1e293b',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Clean & Minimal', { left:W/2,top:H*.63,fontSize:13,fill:'#3b82f6',fontFamily:'Arial, sans-serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(L(fabric, [W/2 - 60, H * 0.7, W/2 + 60, H * 0.7], { stroke: '#e2e8f0', strokeWidth: 1 }))
  qrBox(canvas, fabric, W/2 - 38, H * 0.74, '#ffffff', '#3b82f6', 76)
}

function buildSquareBold_Front(canvas, fabric) {
  setBg(canvas, '#111827')
  const W = canvas.width, H = canvas.height
  canvas.add(C(fabric, { left:-50,top:-50,radius:120,fill:'#f43f5e',opacity:0.2,selectable:true,evented:true }))
  canvas.add(C(fabric, { left:W-80,top:H-80,radius:160,fill:'#f43f5e',opacity:0.1,selectable:true,evented:true }))
  canvas.add(R(fabric, { left:40,top:40,width:8,height:40,fill:'#f43f5e',selectable:true,evented:true }))
  canvas.add(IT(fabric, 'YOUR NAME', { left:60,top:50,fontSize:40,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',charSpacing:20,name:'Name' }))
  canvas.add(IT(fabric, 'DESIGN DIRECTOR', { left:60,top:100,fontSize:14,fill:'#f43f5e',fontFamily:'Arial, sans-serif',charSpacing:40,name:'Title' }))
  canvas.add(L(fabric, [60,140,W-60,140], { stroke:'rgba(255,255,255,0.1)',strokeWidth:1,selectable:true,evented:true }))
  ;['+91 9876543210','hello@design.co','design.co'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:60,top:170+i*38,fontSize:14,fill:'#9ca3af',fontFamily:'Arial, sans-serif',name:['Phone','Email','Website'][i] })))
  personAvatar(canvas, fabric, W-100, H-100, 55, '#f43f5e', 'rgba(244,63,94,0.1)')
  canvas.add(IT(fabric, 'DESIGN.CO', { left:60,top:H-110,fontSize:26,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',name:'Company' }))
}
function buildSquareBold_Back(canvas, fabric) {
  setBg(canvas, '#111827')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 32, top: 32, width: W - 64, height: H - 64, fill: 'transparent', stroke: '#f43f5e', strokeWidth: 3, opacity: 0.75, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 40, top: 40, width: W - 80, height: H - 80, fill: 'transparent', stroke: '#ffffff', strokeWidth: 0.5, opacity: 0.15, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H * 0.32, 65, '#f43f5e', 'rgba(244,63,94,0.06)')
  canvas.add(IT(fabric, 'DESIGN.CO', { left: W/2, top: H * 0.58, fontSize: 32, fill: '#ffffff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 40, originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'WE BUILD BRANDS', { left: W/2, top: H * 0.66, fontSize: 12, fill: '#f43f5e', fontFamily: 'Arial, sans-serif', charSpacing: 20, originX: 'center', name: 'Tagline' }))
  qrBox(canvas, fabric, W/2 - 38, H * 0.73, '#111827', '#f43f5e', 76)
}

function buildSquareCreative_Front(canvas, fabric) {
  setBg(canvas, '#fdf4ff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:W/2-40,top:H*.2,width:80,height:80,fill:'rgba(217,70,239,0.15)',stroke:'#d946ef',strokeWidth:3,angle:15,originX:'center',originY:'center',selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Name', { left:W/2,top:H*.45,fontSize:46,fill:'#4a044e',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Name' }))
  canvas.add(IT(fabric, 'Creative Thinker', { left:W/2,top:H*.55,fontSize:16,fill:'#d946ef',fontFamily:'Arial, sans-serif',originX:'center',name:'Title' }))
  ;['+91 9876543210','hello@creative.art','@creative_art'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W/2,top:H*.68+i*34,fontSize:14,fill:'#701a75',fontFamily:'Courier New, monospace',originX:'center',name:['Phone','Email','Instagram'][i] })))
}
function buildSquareCreative_Back(canvas, fabric) {
  setBg(canvas, '#fdf4ff')
  const W = canvas.width, H = canvas.height
  canvas.add(C(fabric, { left: W/2 - 200, top: H/2 - 200, radius: 200, fill: 'rgba(217,70,239,0.06)', selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#d946ef', strokeWidth: 1.5, opacity: 0.25, rx: 12, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H * 0.3, 62, '#d946ef', 'rgba(217,70,239,0.06)')
  canvas.add(IT(fabric, 'Creative Art', { left: W/2, top: H * 0.54, fontSize: 30, fill: '#4a044e', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontStyle: 'italic', originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'Make it pop!', { left: W/2, top: H * 0.62, fontSize: 13, fill: '#d946ef', fontFamily: 'Arial, sans-serif', originX: 'center', name: 'Tagline' }))
  qrBox(canvas, fabric, W/2 - 38, H * 0.7, '#ffffff', '#d946ef', 76)
}

// ═══════════════════════════════════════════════════════════════════════════
//  NEW BATCH TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

// --- Horizontal ---
function buildHorizontalRedDots_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  // Red dots top left
  for(let i=0; i<3; i++) {
    for(let j=0; j<3; j++) {
      canvas.add(C(fabric, { left:30+i*20, top:30+j*20, radius:4, fill:'#ef4444', selectable:true,evented:true }))
    }
  }
  // Bottom left circle accent
  canvas.add(C(fabric, { left:-50, top:H-100, radius:150, fill:'transparent', stroke:'#ef4444', strokeWidth:15, opacity:0.1, selectable:true,evented:true }))
  canvas.add(IT(fabric, 'YOUR NAME', { left:100, top:H/2-30, fontSize:42, fill:'#1f2937', fontFamily:'Arial, sans-serif', fontWeight:'bold', name:'Name' }))
  canvas.add(IT(fabric, 'Creative Director', { left:100, top:H/2+20, fontSize:18, fill:'#ef4444', fontFamily:'Arial, sans-serif', name:'Title' }))
  canvas.add(L(fabric, [100, H/2+50, 250, H/2+50], { stroke:'#ef4444', strokeWidth:2, selectable:true,evented:true }))
  personAvatar(canvas, fabric, W-150, H/2, 60, '#ef4444', 'rgba(239,68,68,0.1)')
}
function buildHorizontalRedDots_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#ef4444', strokeWidth: 1, opacity: 0.18, rx: 6, selectable: true, evented: true }))
  for(let i=0; i<3; i++) {
    for(let j=0; j<3; j++) {
      canvas.add(C(fabric, { left: 40+i*16, top: H-80+j*16, radius: 3, fill: '#ef4444', opacity: 0.25, selectable: true, evented: true }))
    }
  }
  logoCircle(canvas, fabric, W/2, H/2-45, 62, '#ef4444', 'rgba(239,68,68,0.06)')
  canvas.add(IT(fabric, 'COMPANY NAME', { left: W/2, top: H/2+35, fontSize: 24, fill: '#1f2937', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 40, originX: 'center', name: 'Company' }))
  canvas.add(L(fabric, [W/2 - 70, H/2 + 75, W/2 + 70, H/2 + 75], { stroke: '#ef4444', strokeWidth: 1, opacity: 0.35 }))
  ;['+1 234 567 890', 'hello@company.com', 'www.company.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left: W/2, top: H/2+90+i*24, fontSize: 12, fill: '#4b5563', fontFamily: 'Arial, sans-serif', originX: 'center', name: ['Phone','Email','Website'][i] }))
  })
  qrBox(canvas, fabric, W - 116, H - 116, '#ffffff', '#ef4444', 76)
}

function buildHorizontalPurpleWavy_Front(canvas, fabric) {
  setBg(canvas, '#fdf4ff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0, top:0, width:W*0.4, height:H, fill:'#7e22ce', selectable:true,evented:true, rx:0, ry:0 })) // pseudo wave
  canvas.add(C(fabric, { left:W*0.4, top:H/2, radius:H/2, fill:'#7e22ce', selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Name', { left:50, top:H/2-20, fontSize:40, fill:'#ffffff', fontFamily:'Georgia, serif', name:'Name' }))
  canvas.add(IT(fabric, 'Founder', { left:50, top:H/2+30, fontSize:18, fill:'#f3e8ff', fontFamily:'Arial, sans-serif', name:'Title' }))
  personAvatar(canvas, fabric, W-150, H/2, 60, '#7e22ce', 'transparent')
  canvas.add(IT(fabric, 'Brand', { left:W-150, top:H/2+80, fontSize:22, fill:'#7e22ce', fontFamily:'Georgia, serif', originX:'center', name:'Company' }))
}
function buildHorizontalPurpleWavy_Back(canvas, fabric) {
  setBg(canvas, '#7e22ce')
  const W = canvas.width, H = canvas.height
  canvas.add(C(fabric, { left: -100, top: -100, radius: 260, fill: '#6b21a8', opacity: 0.4, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#ffffff', strokeWidth: 1, opacity: 0.25, rx: 6, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H/2-40, 60, '#ffffff', 'transparent')
  canvas.add(IT(fabric, 'Company Name', { left: W/2, top: H/2+35, fontSize: 28, fill: '#ffffff', fontFamily: 'Georgia, serif', originX: 'center', name: 'Company' }))
  canvas.add(L(fabric, [W/2 - 80, H/2 + 75, W/2 + 80, H/2 + 75], { stroke: '#ffffff', strokeWidth: 1, opacity: 0.35 }))
  ;['123-456-7890', 'contact@brand.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left: W/2, top: H/2+90+i*26, fontSize: 12, fill: '#f3e8ff', fontFamily: 'Arial, sans-serif', originX: 'center', name: ['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W - 116, H - 116, '#7e22ce', '#ffffff', 76)
}

function buildHorizontalBrownTriangles_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:0,y:0},{x:300,y:0},{x:0,y:300}], { fill:'#78350f', selectable:true,evented:true }))
  canvas.add(new fabric.Polygon([{x:0,y:H},{x:0,y:H-200},{x:200,y:H}], { fill:'#451a03', selectable:true,evented:true }))
  canvas.add(IT(fabric, 'Your Name', { left:W*0.4, top:H/2-20, fontSize:44, fill:'#451a03', fontFamily:'Arial, sans-serif', fontWeight:'bold', name:'Name' }))
  canvas.add(IT(fabric, 'Architect', { left:W*0.4, top:H/2+30, fontSize:18, fill:'#78350f', fontFamily:'Arial, sans-serif', name:'Title' }))
  personAvatar(canvas, fabric, W-150, H/2, 60, '#78350f', 'rgba(120,53,15,0.1)')
}
function buildHorizontalBrownTriangles_Back(canvas, fabric) {
  setBg(canvas, '#451a03')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:W,y:H},{x:W-200,y:H},{x:W,y:H-200}], { fill:'#78350f', selectable:true,evented:true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#78350f', strokeWidth: 1.5, opacity: 0.35, rx: 4, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H/2-35, 58, '#ffffff', 'transparent')
  canvas.add(IT(fabric, 'STUDIO ARCH', { left: W/2, top: H/2+40, fontSize: 24, fill: '#ffffff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 40, originX: 'center', name: 'Company' }))
  canvas.add(L(fabric, [W/2 - 60, H/2 + 75, W/2 + 60, H/2 + 75], { stroke: '#78350f', strokeWidth: 1.5, opacity: 0.6 }))
  ;['+1 555 123 4567', 'hello@studioarch.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left: W/2, top: H/2+90+i*26, fontSize: 12, fill: '#d4d4d8', fontFamily: 'Arial, sans-serif', originX: 'center', name: ['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W - 116, H - 116, '#451a03', '#ffffff', 76)
}

function buildHorizontalLuxuryGold_Front(canvas, fabric) {
  setBg(canvas, '#171717')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:20, top:20, width:W-40, height:H-40, fill:'transparent', stroke:'#d97706', strokeWidth:2, opacity:0.5, selectable:true,evented:true }))
  canvas.add(R(fabric, { left:30, top:30, width:W-60, height:H-60, fill:'transparent', stroke:'#d97706', strokeWidth:1, opacity:0.3, selectable:true,evented:true }))
  canvas.add(IT(fabric, 'YOUR NAME', { left:80, top:H/2-25, fontSize:38, fill:'#ffffff', fontFamily:'Georgia, serif', fontWeight:'bold', charSpacing:40, name:'Name' }))
  canvas.add(IT(fabric, 'CEO & FOUNDER', { left:80, top:H/2+25, fontSize:14, fill:'#d97706', fontFamily:'Arial, sans-serif', charSpacing:20, name:'Title' }))
  
  canvas.add(R(fabric, { left:W-160, top:H/2, width:60, height:60, angle:45, fill:'transparent', stroke:'#d97706', strokeWidth:2, originX:'center', originY:'center', selectable:true,evented:true }))
  canvas.add(IT(fabric, 'LG', { left:W-160, top:H/2-15, fontSize:24, fill:'#d97706', fontFamily:'Georgia, serif', originX:'center', name:'CompanyLogo' }))
}
function buildHorizontalLuxuryGold_Back(canvas, fabric) {
  setBg(canvas, '#171717')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 20, top: 20, width: W-40, height: H-40, fill: 'transparent', stroke: '#d97706', strokeWidth: 2, opacity: 0.6, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 28, top: 28, width: W-56, height: H-56, fill: 'transparent', stroke: '#d97706', strokeWidth: 0.5, opacity: 0.3, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: W/2, top: H/2-50, width: 62, height: 62, angle: 45, fill: 'transparent', stroke: '#d97706', strokeWidth: 1.5, originX: 'center', originY: 'center', selectable: true, evented: true }))
  const company = useEditorStore.getState().profileDetails.company || 'Company'
  const companyInitial = company.trim().charAt(0).toUpperCase() || 'C'
  canvas.add(IT(fabric, companyInitial, { left: W/2, top: H/2-62, fontSize: 24, fill: '#d97706', fontFamily: 'Georgia, serif', fontWeight: 'bold', originX: 'center', name: 'Monogram Letter' }))
  canvas.add(IT(fabric, 'LUXURY BRAND', { left: W/2, top: H/2+25, fontSize: 22, fill: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'bold', charSpacing: 50, originX: 'center', name: 'Company' }))
  canvas.add(L(fabric, [W/2 - 100, H/2 + 60, W/2 + 100, H/2 + 60], { stroke: '#d97706', strokeWidth: 1, opacity: 0.4 }))
  ;['+1 800 123 4567', 'contact@luxury.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left: W/2, top: H/2+75+i*26, fontSize: 12, fill: '#d97706', fontFamily: 'Arial, sans-serif', charSpacing: 20, originX: 'center', name: ['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W - 116, H - 116, '#171717', '#d97706', 76)
}

// --- Vertical ---
function buildVerticalTealCorners_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:W,y:0},{x:W/2,y:0},{x:W,y:H/3}], { fill:'#14b8a6', selectable:true,evented:true }))
  canvas.add(new fabric.Polygon([{x:0,y:H},{x:W*0.6,y:H},{x:0,y:H-H/4}], { fill:'#0f766e', selectable:true,evented:true }))
  personAvatar(canvas, fabric, W/2, H*0.2, 70, '#14b8a6', 'transparent')
  canvas.add(IT(fabric, 'Your Name', { left:W/2, top:H*0.4, fontSize:46, fill:'#0f766e', fontFamily:'Arial, sans-serif', fontWeight:'bold', originX:'center', name:'Name' }))
  canvas.add(IT(fabric, 'Profession', { left:W/2, top:H*0.48, fontSize:20, fill:'#14b8a6', fontFamily:'Arial, sans-serif', originX:'center', name:'Title' }))
}
function buildVerticalTealCorners_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:0,y:H},{x:W*0.5,y:H},{x:0,y:H-H*0.18}], { fill:'#0f766e', selectable:true,evented:true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#14b8a6', strokeWidth: 1.5, opacity: 0.25, rx: 6, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H*0.25, 56, '#14b8a6', 'rgba(20,184,166,0.04)')
  canvas.add(IT(fabric, 'Company Name', { left:W/2, top:H*0.4, fontSize:28, fill:'#0f766e', fontFamily:'Arial, sans-serif', fontWeight:'bold', originX:'center', name:'Company' }))
  canvas.add(L(fabric, [W/2-80, H*0.47, W/2+80, H*0.47], { stroke: '#14b8a6', strokeWidth: 1, opacity: 0.3 }))
  ;['123-456-7890', 'email@example.com', 'www.example.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left:W/2, top:H*0.5+i*28, fontSize:12, fill:'#374151', fontFamily:'Arial, sans-serif', originX:'center', name:['Phone','Email','Website'][i] }))
  })
  qrBox(canvas, fabric, W/2-36, H*0.75, '#ffffff', '#14b8a6', 72)
}

function buildVerticalNavyTriangle_Front(canvas, fabric) {
  setBg(canvas, '#1e3a5f')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:W/2,y:H-H/3},{x:W,y:H},{x:0,y:H}], { fill:'#ffffff', selectable:true,evented:true }))
  personAvatar(canvas, fabric, W/2, H*0.25, 80, '#ffffff', 'transparent')
  canvas.add(IT(fabric, 'YOUR NAME', { left:W/2, top:H*0.5, fontSize:40, fill:'#ffffff', fontFamily:'Arial, sans-serif', fontWeight:'bold', charSpacing:20, originX:'center', name:'Name' }))
  canvas.add(IT(fabric, 'Director', { left:W/2, top:H*0.57, fontSize:18, fill:'#93c5fd', fontFamily:'Arial, sans-serif', charSpacing:20, originX:'center', name:'Title' }))
}
function buildVerticalNavyTriangle_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:W/2,y:0},{x:W,y:H*0.25},{x:0,y:H*0.25}], { fill:'#1e3a5f', selectable:true,evented:true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#1e3a5f', strokeWidth: 1.5, opacity: 0.2, rx: 6, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H*0.35, 56, '#1e3a5f', 'rgba(30,58,95,0.04)')
  canvas.add(IT(fabric, 'COMPANY', { left:W/2, top:H*0.49, fontSize:28, fill:'#1e3a5f', fontFamily:'Arial, sans-serif', fontWeight:'bold', charSpacing:40, originX:'center', name:'Company' }))
  canvas.add(L(fabric, [W/2-80, H*0.56, W/2+80, H*0.56], { stroke: '#1e3a5f', strokeWidth: 1, opacity: 0.3 }))
  ;['+1 234 567 890', 'contact@company.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left:W/2, top:H*0.6+i*28, fontSize:12, fill:'#4b5563', fontFamily:'Arial, sans-serif', originX:'center', name:['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W/2-36, H*0.75, '#ffffff', '#1e3a5f', 72)
}

function buildVerticalTealSolid_Front(canvas, fabric) {
  setBg(canvas, '#0d9488')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:W-40, top:0, width:40, height:H, fill:'#0f766e', selectable:true,evented:true }))
  canvas.add(R(fabric, { left:W/2, top:H*0.3, width:100, height:100, fill:'transparent', stroke:'#ffffff', strokeWidth:4, originX:'center', originY:'center', selectable:true,evented:true }))
  canvas.add(IT(fabric, 'T', { left:W/2, top:H*0.3-25, fontSize:50, fill:'#ffffff', fontFamily:'Georgia, serif', fontWeight:'bold', originX:'center', name:'CompanyLogo' }))
  canvas.add(IT(fabric, 'Your Name', { left:W/2, top:H*0.6, fontSize:42, fill:'#ffffff', fontFamily:'Arial, sans-serif', fontWeight:'bold', originX:'center', name:'Name' }))
  canvas.add(IT(fabric, 'Title Here', { left:W/2, top:H*0.68, fontSize:20, fill:'#ccfbf1', fontFamily:'Arial, sans-serif', originX:'center', name:'Title' }))
}
function buildVerticalTealSolid_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:W-30, top:0, width:30, height:H, fill:'#0d9488', selectable:true,evented:true }))
  canvas.add(R(fabric, { left: 20, top: 20, width: W-50, height: H-40, fill: 'transparent', stroke: '#0d9488', strokeWidth: 1, opacity: 0.25, rx: 6 }))
  logoCircle(canvas, fabric, W/2-15, H*0.22, 54, '#0d9488', 'rgba(13,148,136,0.04)')
  canvas.add(IT(fabric, 'COMPANY NAME', { left:W/2-15, top:H*0.37, fontSize:24, fill:'#0f766e', fontFamily:'Arial, sans-serif', fontWeight:'bold', originX:'center', name:'Company' }))
  canvas.add(L(fabric, [W/2-80, H*0.44, W/2+50, H*0.44], { stroke: '#0d9488', strokeWidth: 1, opacity: 0.3 }))
  ;['Phone: +1 234 567 890', 'Email: hello@example.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left:W/2-15, top:H*0.48+i*28, fontSize:12, fill:'#374151', fontFamily:'Arial, sans-serif', originX:'center', name:['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W/2-51, H*0.72, '#ffffff', '#0d9488', 72)
}

function buildVerticalNavyYellow_Front(canvas, fabric) {
  setBg(canvas, '#1e1b4b')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0, top:H-H/4, width:W, height:H/4, fill:'#eab308', selectable:true,evented:true }))
  // pseudo logo
  canvas.add(R(fabric, { left:W/2, top:H*0.25, width:60, height:40, fill:'transparent', stroke:'#eab308', strokeWidth:4, originX:'center', originY:'center', rx:30, ry:30, selectable:true,evented:true }))
  canvas.add(R(fabric, { left:W/2, top:H*0.25+20, width:80, height:8, fill:'#eab308', originX:'center', selectable:true,evented:true }))
  canvas.add(IT(fabric, 'YOUR NAME', { left:W/2, top:H*0.5, fontSize:40, fill:'#ffffff', fontFamily:'Arial, sans-serif', fontWeight:'bold', originX:'center', name:'Name' }))
  canvas.add(IT(fabric, 'Position', { left:W/2, top:H*0.57, fontSize:20, fill:'#eab308', fontFamily:'Arial, sans-serif', originX:'center', name:'Title' }))
}
function buildVerticalNavyYellow_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0, top:0, width:W, height:H/5, fill:'#1e1b4b', selectable:true,evented:true }))
  canvas.add(R(fabric, { left:0, top:H-12, width:W, height:12, fill:'#eab308', selectable:true,evented:true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#1e1b4b', strokeWidth: 1, opacity: 0.15, rx: 6 }))
  logoCircle(canvas, fabric, W/2, H*0.3, 56, '#1e1b4b', 'rgba(30,27,75,0.04)')
  canvas.add(IT(fabric, 'BRAND', { left:W/2, top:H*0.44, fontSize:28, fill:'#1e1b4b', fontFamily:'Arial, sans-serif', fontWeight:'bold', charSpacing: 40, originX:'center', name:'Company' }))
  canvas.add(L(fabric, [W/2-80, H*0.51, W/2+80, H*0.51], { stroke: '#eab308', strokeWidth: 1.5, opacity: 0.6 }))
  ;['+1 234 567 890', 'contact@brand.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left:W/2, top:H*0.55+i*28, fontSize:12, fill:'#4b5563', fontFamily:'Arial, sans-serif', originX:'center', name:['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W/2-36, H*0.72, '#ffffff', '#1e1b4b', 72)
}

// --- Square ---
function buildSquareRedSidebar_Front(canvas, fabric) {
  setBg(canvas, '#171717')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:W-80, top:0, width:80, height:H, fill:'#dc2626', selectable:true,evented:true }))
  logoCircle(canvas, fabric, 120, 120, 40, '#dc2626', 'transparent')
  canvas.add(IT(fabric, 'Your Name', { left:60, top:H/2, fontSize:48, fill:'#ffffff', fontFamily:'Arial, sans-serif', fontWeight:'bold', name:'Name' }))
  canvas.add(IT(fabric, 'Founder & CEO', { left:60, top:H/2+60, fontSize:18, fill:'#dc2626', fontFamily:'Arial, sans-serif', name:'Title' }))
}
function buildSquareRedSidebar_Back(canvas, fabric) {
  setBg(canvas, '#171717')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:W-60, top:0, width:60, height:H, fill:'#dc2626', selectable:true,evented:true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#dc2626', strokeWidth: 1.5, opacity: 0.35, rx: 4 }))
  logoCircle(canvas, fabric, W/2-30, H*0.25, 54, '#ffffff', 'transparent')
  canvas.add(IT(fabric, 'COMPANY', { left:W/2-30, top:H*0.45, fontSize:32, fill:'#ffffff', fontFamily:'Arial, sans-serif', fontWeight:'bold', charSpacing:40, originX:'center', name:'Company' }))
  canvas.add(L(fabric, [W/2-90, H*0.54, W/2+30, H*0.54], { stroke: '#dc2626', strokeWidth: 1.5, opacity: 0.5 }))
  ;['123-456-7890', 'email@example.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left:W/2-30, top:H*0.6+i*28, fontSize:12, fill:'#a1a1aa', fontFamily:'Arial, sans-serif', originX:'center', name:['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W/2-68, H*0.74, '#171717', '#dc2626', 76)
}

function buildSquareRedDiagonal_Front(canvas, fabric) {
  setBg(canvas, '#ef4444')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:W,y:0},{x:W/2,y:0},{x:W,y:H/2}], { fill:'#b91c1c', selectable:true,evented:true }))
  logoCircle(canvas, fabric, 120, 120, 50, '#ffffff', 'transparent')
  canvas.add(IT(fabric, 'YOUR NAME', { left:80, top:H-160, fontSize:46, fill:'#ffffff', fontFamily:'Arial, sans-serif', fontWeight:'bold', name:'Name' }))
  canvas.add(IT(fabric, 'Position Title', { left:80, top:H-100, fontSize:20, fill:'#fee2e2', fontFamily:'Arial, sans-serif', name:'Title' }))
}
function buildSquareRedDiagonal_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:0,y:H},{x:W*0.4,y:H},{x:0,y:H*0.6}], { fill:'#ef4444', selectable:true,evented:true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#ef4444', strokeWidth: 1.5, opacity: 0.25, rx: 6 }))
  logoCircle(canvas, fabric, W/2, H*0.25, 56, '#ef4444', 'rgba(239,68,68,0.04)')
  canvas.add(IT(fabric, 'COMPANY', { left:W/2, top:H*0.45, fontSize:32, fill:'#ef4444', fontFamily:'Arial, sans-serif', fontWeight:'bold', charSpacing:40, originX:'center', name:'Company' }))
  canvas.add(L(fabric, [W/2-80, H*0.52, W/2+80, H*0.52], { stroke: '#ef4444', strokeWidth: 1.5, opacity: 0.35 }))
  ;['123-456-7890', 'email@company.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left:W/2, top:H*0.58+i*28, fontSize:12, fill:'#374151', fontFamily:'Arial, sans-serif', originX:'center', name:['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W/2-38, H*0.72, '#ffffff', '#ef4444', 76)
}

function buildSquareTealMinimal_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0, top:H-H/4, width:W, height:H/4, fill:'#0d9488', selectable:true,evented:true }))
  logoCircle(canvas, fabric, W-120, 120, 50, '#0d9488', 'transparent')
  canvas.add(IT(fabric, 'Your Name', { left:80, top:H/2-40, fontSize:48, fill:'#134e4a', fontFamily:'Arial, sans-serif', fontWeight:'bold', name:'Name' }))
  canvas.add(IT(fabric, 'CEO & Founder', { left:80, top:H/2+20, fontSize:20, fill:'#0d9488', fontFamily:'Arial, sans-serif', name:'Title' }))
}
function buildSquareTealMinimal_Back(canvas, fabric) {
  setBg(canvas, '#0d9488')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#ffffff', strokeWidth: 1.5, opacity: 0.2, rx: 6 }))
  logoCircle(canvas, fabric, W/2, H*0.25, 58, '#ffffff', 'transparent')
  canvas.add(IT(fabric, 'COMPANY', { left:W/2, top:H*0.46, fontSize:32, fill:'#ffffff', fontFamily:'Arial, sans-serif', fontWeight:'bold', charSpacing:40, originX:'center', name:'Company' }))
  canvas.add(L(fabric, [W/2-80, H*0.54, W/2+80, H*0.54], { stroke: '#ffffff', strokeWidth: 1, opacity: 0.35 }))
  ;['123-456-7890', 'contact@company.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left:W/2, top:H*0.6+i*26, fontSize:12, fill:'#ccfbf1', fontFamily:'Arial, sans-serif', originX:'center', name:['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W/2-38, H*0.74, '#0d9488', '#ffffff', 76)
}

function buildSquareGreenElegant_Front(canvas, fabric) {
  setBg(canvas, '#064e3b')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:30, top:30, width:W-60, height:H-60, fill:'transparent', stroke:'#d97706', strokeWidth:2, opacity:0.5, selectable:true,evented:true }))
  canvas.add(R(fabric, { left:20, top:20, width:15, height:15, fill:'#d97706', selectable:true,evented:true }))
  canvas.add(R(fabric, { left:W-35, top:20, width:15, height:15, fill:'#d97706', selectable:true,evented:true }))
  canvas.add(R(fabric, { left:20, top:H-35, width:15, height:15, fill:'#d97706', selectable:true,evented:true }))
  canvas.add(R(fabric, { left:W-35, top:H-35, width:15, height:15, fill:'#d97706', selectable:true,evented:true }))
  
  canvas.add(IT(fabric, 'YOUR NAME', { left:W/2, top:H/2-30, fontSize:44, fill:'#d97706', fontFamily:'Georgia, serif', fontWeight:'bold', charSpacing:20, originX:'center', name:'Name' }))
  canvas.add(IT(fabric, 'JOB TITLE', { left:W/2, top:H/2+30, fontSize:18, fill:'#ffffff', fontFamily:'Arial, sans-serif', charSpacing:40, originX:'center', name:'Title' }))
}
function buildSquareGreenElegant_Back(canvas, fabric) {
  setBg(canvas, '#064e3b')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:30, top:30, width:W-60, height:H-60, fill:'transparent', stroke:'#d97706', strokeWidth:2, opacity:0.5, selectable:true,evented:true }))
  canvas.add(R(fabric, { left:36, top:36, width:W-72, height:H-72, fill:'transparent', stroke:'#d97706', strokeWidth:0.5, opacity:0.2, selectable:true,evented:true }))
  logoCircle(canvas, fabric, W/2, H/2-60, 60, '#d97706', 'transparent')
  canvas.add(IT(fabric, 'BRAND', { left:W/2, top:H/2+25, fontSize:28, fill:'#d97706', fontFamily:'Georgia, serif', fontWeight:'bold', charSpacing:40, originX:'center', name:'Company' }))
  canvas.add(L(fabric, [W/2-100, H/2+65, W/2+100, H/2+65], { stroke: '#d97706', strokeWidth: 1, opacity: 0.4 }))
  ;['+1 234 567 890', 'email@example.com'].forEach((t,i) => {
    canvas.add(IT(fabric, t, { left:W/2, top:H/2+80+i*28, fontSize:12, fill:'#ffffff', fontFamily:'Arial, sans-serif', originX:'center', name:['Phone','Email'][i] }))
  })
  qrBox(canvas, fabric, W/2-38, H*0.74, '#064e3b', '#d97706', 76)
}

// ═══════════════════════════════════════════════════════════════════════════
//  NEW CANVA-STYLE PREMIUM TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

function buildEstelleDarcyGreen_Front(canvas, fabric) {
  setBg(canvas, '#faf6f0')
  const W = canvas.width, H = canvas.height
  const { profileDetails } = useEditorStore.getState()
  const nameVal = profileDetails.name || 'ESTELLE DARCY'
  const titleVal = profileDetails.title || 'designer'
  const phoneVal = profileDetails.phone || '+123-456-7890'
  const websiteVal = profileDetails.website || 'www.reallygreatsite.com'
  const emailVal = profileDetails.email || 'hello@reallygreatsite.com'
  const companyVal = profileDetails.company || 'ED STUDIOS'

  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#2c5e43', strokeWidth: 1, opacity: 0.25, rx: 6, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 30, top: 30, width: W - 60, height: H - 60, fill: 'transparent', stroke: '#2c5e43', strokeWidth: 0.5, opacity: 0.1, rx: 5, selectable: true, evented: true }))

  logoCircle(canvas, fabric, W*0.25, H*0.4, 58, '#2c5e43', 'rgba(44,94,67,0.03)')
  canvas.add(IT(fabric, companyVal.toUpperCase(), { left: W*0.25, top: H*0.4 + 75, fontSize: 13, fill: '#2c5e43', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 40, originX: 'center', name: 'Company' }))

  canvas.add(IT(fabric, nameVal.toUpperCase(), { left: W*0.52, top: H*0.25, fontSize: 32, fill: '#2c5e43', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, titleVal.toUpperCase(), { left: W*0.52, top: H*0.35 + 8, fontSize: 11, fill: '#2c5e43', fontFamily: 'Georgia, serif', charSpacing: 50, name: 'Title' }))
  canvas.add(L(fabric, [W*0.52, H*0.42 + 8, W - 60, H*0.42 + 8], { stroke: '#2c5e43', strokeWidth: 1.5, opacity: 0.25, selectable: true, evented: true }))

  ;[phoneVal, websiteVal, emailVal].forEach((txt, i) => {
    canvas.add(IT(fabric, txt, { left: W*0.52, top: H*0.48 + 8 + i*28, fontSize: 12, fill: '#2c5e43', fontFamily: 'Arial, sans-serif', name: ['Phone', 'Website', 'Email'][i] }))
  })
}

function buildEstelleDarcyGreen_Back(canvas, fabric) {
  setBg(canvas, '#faf6f0')
  const W = canvas.width, H = canvas.height
  const { profileDetails } = useEditorStore.getState()
  const nameVal = profileDetails.name || 'ESTELLE DARCY'
  const companyVal = profileDetails.company || 'ED STUDIOS'
  canvas.add(R(fabric, { left: 36, top: 36, width: W-72, height: H-72, fill: 'transparent', stroke: '#2c5e43', strokeWidth: 1.5, opacity: 0.35, rx: 3, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 42, top: 42, width: W-84, height: H-84, fill: 'transparent', stroke: '#2c5e43', strokeWidth: 0.5, opacity: 0.15, rx: 2, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W/2, H*0.32, 58, '#2c5e43', 'rgba(44,94,67,0.03)')
  canvas.add(IT(fabric, nameVal.toUpperCase(), { left: W/2, top: H*0.54, fontSize: 14, fill: '#2c5e43', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 40, originX: 'center', name: 'Name' }))
  canvas.add(L(fabric, [W/2 - 70, H*0.6, W/2 + 70, H*0.6], { stroke: '#2c5e43', strokeWidth: 1, opacity: 0.25 }))
  canvas.add(IT(fabric, companyVal.toUpperCase(), { left: W/2, top: H*0.64, fontSize: 10, fill: '#2c5e43', fontFamily: 'Arial, sans-serif', opacity: 0.6, charSpacing: 60, originX: 'center', name: 'Company' }))
  qrBox(canvas, fabric, W-116, H-116, '#faf6f0', '#2c5e43', 76)
}

function buildNailsOlivia_Front(canvas, fabric) {
  setBg(canvas, '#ebdcd0')
  const W = canvas.width, H = canvas.height
  const { profileDetails } = useEditorStore.getState()
  const nameVal = profileDetails.name || 'Olivia Wilson'
  const titleVal = profileDetails.title || 'NAIL STUDIO'

  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#ffffff', strokeWidth: 1.5, opacity: 0.75, rx: 6, selectable: true, evented: true }))
  const names = nameVal.trim().split(/\s+/)
  const initials = ((names[0] ? names[0].charAt(0) : '') + (names[names.length - 1] && names.length > 1 ? names[names.length - 1].charAt(0) : '')).toUpperCase() || 'O'
  canvas.add(IT(fabric, initials, { left: W/2, top: H/2 - 95, fontSize: 160, fill: '#f5eae2', fontFamily: 'Georgia, serif', fontWeight: 'bold', charSpacing: 20, opacity: 0.65, originX: 'center', name: 'Initials Watermark' }))
  canvas.add(IT(fabric, nameVal, { left: W/2, top: H/2 - 12, fontSize: 44, fill: '#1a1a1a', fontFamily: 'Georgia, serif', fontStyle: 'italic', originX: 'center', name: 'Name' }))
  canvas.add(IT(fabric, titleVal.toUpperCase(), { left: W/2, top: H/2 + 45, fontSize: 10, fill: '#1a1a1a', fontFamily: 'Arial, sans-serif', charSpacing: 60, originX: 'center', name: 'Title' }))
}

function buildNailsOlivia_Back(canvas, fabric) {
  setBg(canvas, '#ebdcd0')
  const W = canvas.width, H = canvas.height
  const { profileDetails } = useEditorStore.getState()
  const nameVal = profileDetails.name || 'Olivia'
  const emailVal = profileDetails.email || 'hello@reallygreatsite.com'
  const phoneVal = profileDetails.phone || '+123-456-7890'
  const addressVal = profileDetails.address || '123 Anywhere St., Any City'
  canvas.add(C(fabric, { left: -120, top: -120, radius: 240, fill: '#f5eae2', opacity: 0.5, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#1a1a1a', strokeWidth: 1, opacity: 0.18, rx: 8, selectable: true, evented: true }))
  logoCircle(canvas, fabric, W*0.22, H/2 - 40, 52, '#1a1a1a', '#f5eae2')
  canvas.add(IT(fabric, 'NAIL STUDIO', { left: W*0.22, top: H/2 + 25, fontSize: 10, fill: '#1a1a1a', fontFamily: 'Arial, sans-serif', charSpacing: 40, originX: 'center', name: 'Studio Tagline' }))
  canvas.add(IT(fabric, `by ${nameVal}`, { left: W*0.44, top: H*0.23, fontSize: 26, fill: '#1a1a1a', fontFamily: 'Georgia, serif', fontStyle: 'italic', name: 'Name' }))
  canvas.add(L(fabric, [W*0.44, H*0.38, W-60, H*0.38], { stroke: 'rgba(26,26,26,0.15)', strokeWidth: 1.5, selectable: true, evented: true }))
  ;[phoneVal, emailVal, addressVal].forEach((txt, i) => {
    canvas.add(IT(fabric, txt, { left: W*0.44, top: H*0.44 + i*28, fontSize: 12, fill: '#1a1a1a', fontFamily: 'Arial, sans-serif', name: ['Phone', 'Email', 'Address'][i] }))
  })
  qrBox(canvas, fabric, W-116, H-116, '#ebdcd0', '#1a1a1a', 76)
}

function buildBorcelleBlueFlower_Front(canvas, fabric) {
  setBg(canvas, '#004aad')
  const W = canvas.width, H = canvas.height
  const { profileDetails } = useEditorStore.getState()
  const nameVal = profileDetails.name || 'Your Name'
  const titleVal = profileDetails.title || 'Your Title'
  const phoneVal = profileDetails.phone || '+123-456-7890'
  const websiteVal = profileDetails.website || 'www.reallygreatsite.com'
  const emailVal = profileDetails.email || 'hello@reallygreatsite.com'
  const companyVal = profileDetails.company || 'borcelle'
  
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#ffffff', strokeWidth: 1.5, opacity: 0.18, rx: 6, selectable: true, evented: true }))
  canvas.add(L(fabric, [W*0.48, H*0.18, W*0.48, H*0.82], { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1.5, selectable: true, evented: true }))

  const cx = W*0.24, cy = H*0.38, radius = 30
  for(let i=0; i<8; i++) {
    const angle = (i * 45 * Math.PI) / 180
    const px = cx + Math.cos(angle) * (radius * 0.4)
    const py = cy + Math.sin(angle) * (radius * 0.4)
    canvas.add(C(fabric, { left: px - radius, top: py - radius, radius: radius, fill: '#ffffff', opacity: 0.12, selectable: true, evented: true }))
  }
  canvas.add(C(fabric, { left: cx - 6, top: cy - 6, radius: 6, fill: '#ffffff', opacity: 0.5, selectable: true, evented: true }))
  canvas.add(IT(fabric, companyVal.toUpperCase(), { left: W*0.24, top: H*0.38 + 50, fontSize: 18, fill: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'bold', charSpacing: 20, originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'VISUAL STUDIO', { left: W*0.24, top: H*0.38 + 80, fontSize: 9, fill: '#93c5fd', fontFamily: 'Arial, sans-serif', charSpacing: 40, originX: 'center', name: 'Tagline' }))

  canvas.add(IT(fabric, nameVal, { left: W*0.54, top: H*0.22, fontSize: 28, fill: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, titleVal.toUpperCase(), { left: W*0.54, top: H*0.34, fontSize: 10, fill: '#93c5fd', fontFamily: 'Arial, sans-serif', charSpacing: 40, name: 'Title' }))
  canvas.add(L(fabric, [W*0.54, H*0.42, W-60, H*0.42], { stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }))

  ;[phoneVal, emailVal, websiteVal].forEach((txt, i) => {
    canvas.add(IT(fabric, txt, { left: W*0.54, top: H*0.48 + i*28, fontSize: 12, fill: '#ffffff', opacity: 0.9, fontFamily: 'Arial, sans-serif', name: ['Phone', 'Email', 'Website'][i] }))
  })
}

function buildBorcelleBlueFlower_Back(canvas, fabric) {
  setBg(canvas, '#004aad')
  const W = canvas.width, H = canvas.height
  const { profileDetails } = useEditorStore.getState()
  const nameVal = profileDetails.name || 'Your Name'
  const titleVal = profileDetails.title || 'Your Title'
  const phoneVal = profileDetails.phone || '+123-456-7890'
  const websiteVal = profileDetails.website || 'www.reallygreatsite.com'
  canvas.add(R(fabric, { left: 24, top: 24, width: W-48, height: H-48, fill: 'transparent', stroke: '#ffffff', strokeWidth: 1.5, opacity: 0.2, rx: 6, selectable: true, evented: true }))
  const cx = 135, cy = H/2, radius = 28
  for(let i=0; i<6; i++) {
    const angle = (i * 60 * Math.PI) / 180
    const px = cx + Math.cos(angle) * (radius * 0.4)
    const py = cy + Math.sin(angle) * (radius * 0.4)
    canvas.add(C(fabric, { left: px - radius, top: py - radius, radius: radius, fill: '#ffffff', opacity: 0.12, selectable: true, evented: true }))
  }
  canvas.add(C(fabric, { left: cx - 6, top: cy - 6, radius: 6, fill: '#ffffff', opacity: 0.6, selectable: true, evented: true }))
  canvas.add(IT(fabric, nameVal, { left: W*0.38, top: H*0.22, fontSize: 32, fill: '#ffffff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, titleVal.toUpperCase(), { left: W*0.38, top: H*0.37, fontSize: 11, fill: '#93c5fd', fontFamily: 'Arial, sans-serif', charSpacing: 40, name: 'Title' }))
  canvas.add(L(fabric, [W*0.38, H*0.47, W-75, H*0.47], { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1.5, selectable: true, evented: true }))
  ;[phoneVal, websiteVal].forEach((txt, i) => {
    canvas.add(IT(fabric, txt, { left: W*0.38, top: H*0.53 + i*26, fontSize: 12, fill: '#ffffff', opacity: 0.85, fontFamily: 'Arial, sans-serif', name: ['Phone', 'Website'][i] }))
  })
  qrBox(canvas, fabric, W-116, H-116, '#004aad', '#ffffff', 76)
}

function buildMonsoonBold_Front(canvas, fabric) {
  setBg(canvas, '#faf8f5')
  const W = canvas.width, H = canvas.height
  const { profileDetails } = useEditorStore.getState()
  const nameVal = profileDetails.name || 'Your Name'
  const titleVal = profileDetails.title || 'Creative Director'
  const phoneVal = profileDetails.phone || '+123-456-7890'
  const emailVal = profileDetails.email || 'hello@reallygreatsite.com'
  const websiteVal = profileDetails.website || 'www.reallygreatsite.com'
  const companyVal = profileDetails.company || 'MONSOON'

  canvas.add(R(fabric, { left: 24, top: 24, width: W - 48, height: H - 48, fill: 'transparent', stroke: '#111111', strokeWidth: 1.5, opacity: 0.18, rx: 6, selectable: true, evented: true }))
  canvas.add(L(fabric, [W*0.48, H*0.2, W*0.48, H*0.8], { stroke: 'rgba(17,17,17,0.15)', strokeWidth: 1.5 }))

  const logoText = companyVal.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  canvas.add(IT(fabric, logoText, { left: W*0.24, top: H*0.32, fontSize: 80, fill: '#111111', fontFamily: 'Georgia, serif', fontWeight: 'bold', originX: 'center', name: 'Monogram' }))
  canvas.add(IT(fabric, companyVal.toUpperCase(), { left: W*0.24, top: H*0.52, fontSize: 13, fill: '#111111', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 40, originX: 'center', name: 'Company' }))

  canvas.add(IT(fabric, nameVal, { left: W*0.54, top: H*0.25, fontSize: 30, fill: '#111111', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, titleVal.toUpperCase(), { left: W*0.54, top: H*0.35 + 8, fontSize: 10, fill: '#666666', fontFamily: 'Arial, sans-serif', charSpacing: 50, name: 'Title' }))
  canvas.add(L(fabric, [W*0.54, H*0.42 + 8, W - 60, H*0.42 + 8], { stroke: '#111111', strokeWidth: 1, opacity: 0.2 }))

  ;[phoneVal, emailVal, websiteVal].forEach((txt, i) => {
    canvas.add(IT(fabric, txt, { left: W*0.54, top: H*0.48 + 8 + i*28, fontSize: 12, fill: '#444444', fontFamily: 'Arial, sans-serif', name: ['Phone', 'Email', 'Website'][i] }))
  })
}

function buildMonsoonBold_Back(canvas, fabric) {
  setBg(canvas, '#faf8f5')
  const W = canvas.width, H = canvas.height
  const { profileDetails } = useEditorStore.getState()
  const nameVal = profileDetails.name || 'Your Name'
  const emailVal = profileDetails.email || 'hello@reallygreatsite.com'
  const phoneVal = profileDetails.phone || '+123-456-7890'
  const websiteVal = profileDetails.website || 'www.reallygreatsite.com'
  const titleVal = profileDetails.title || 'Creative Director'
  canvas.add(R(fabric, { left: 28, top: 28, width: W-56, height: H-56, fill: 'transparent', stroke: '#111111', strokeWidth: 1.5, opacity: 0.22, rx: 6, selectable: true, evented: true }))
  canvas.add(R(fabric, { left: 34, top: 34, width: W-68, height: H-68, fill: 'transparent', stroke: '#111111', strokeWidth: 0.5, opacity: 0.08, rx: 5, selectable: true, evented: true }))
  canvas.add(IT(fabric, nameVal, { left: 80, top: H*0.22, fontSize: 34, fill: '#111111', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, titleVal.toUpperCase(), { left: 80, top: H*0.33, fontSize: 11, fill: '#666666', fontFamily: 'Arial, sans-serif', charSpacing: 80, name: 'Title' }))
  canvas.add(L(fabric, [80, H*0.42, 420, H*0.42], { stroke: '#111111', strokeWidth: 1.5, opacity: 0.35, selectable: true, evented: true }))
  ;[phoneVal, emailVal, websiteVal].forEach((txt, i) => {
    canvas.add(IT(fabric, txt, { left: 80, top: H*0.48 + i*28, fontSize: 12, fill: '#444444', fontFamily: 'Arial, sans-serif', name: ['Phone', 'Email', 'Website'][i] }))
  })
  logoCircle(canvas, fabric, W * 0.73, H * 0.32, 42, '#111111', 'rgba(17,17,17,0.04)')
  const company = profileDetails.company || 'Monsoon'
  canvas.add(IT(fabric, company.toUpperCase(), { left: W * 0.73, top: H * 0.48, fontSize: 13, fill: '#111111', fontFamily: 'Georgia, serif', fontWeight: 'bold', charSpacing: 40, originX: 'center', name: 'Company' }))
  qrBox(canvas, fabric, W * 0.73 - 38, H * 0.58, '#faf8f5', '#111111', 76)
}

const BUILDERS = {
  'estelle-darcy-green':  { front: buildEstelleDarcyGreen_Front,  back: buildEstelleDarcyGreen_Back },
  'nails-olivia':         { front: buildNailsOlivia_Front,         back: buildNailsOlivia_Back },
  'borcelle-blue-flower': { front: buildBorcelleBlueFlower_Front, back: buildBorcelleBlueFlower_Back },
  'monsoon-bold':         { front: buildMonsoonBold_Front,         back: buildMonsoonBold_Back },
  'corporate-blue':     { front: buildCorporateBlue_Front,     back: buildCorporateBlue_Back },
  'corporate-black':    { front: buildCorporateBlack_Front,    back: buildCorporateBlack_Back },
  'green-professional': { front: buildGreenProfessional_Front, back: buildGreenProfessional_Back },
  'tech-modern':        { front: buildTechModern_Front,        back: buildTechModern_Back },
  'floral-creative':    { front: buildFloralCreative_Front,    back: buildFloralCreative_Back },
  'minimal-white':      { front: buildMinimalWhite_Front,      back: buildMinimalWhite_Back },
  'horizontal-red-dots':      { front: buildHorizontalRedDots_Front, back: buildHorizontalRedDots_Back },
  'horizontal-purple-wavy':   { front: buildHorizontalPurpleWavy_Front, back: buildHorizontalPurpleWavy_Back },
  'horizontal-brown-triangles': { front: buildHorizontalBrownTriangles_Front, back: buildHorizontalBrownTriangles_Back },
  'horizontal-luxury-gold':   { front: buildHorizontalLuxuryGold_Front, back: buildHorizontalLuxuryGold_Back },
  'vertical-executive': { front: buildVerticalExecutive_Front, back: buildVerticalExecutive_Back },
  'vertical-minimal':   { front: buildVerticalMinimal_Front,   back: buildVerticalMinimal_Back },
  'vertical-creative':  { front: buildVerticalCreative_Front,  back: buildVerticalCreative_Back },
  'vertical-botanical': { front: buildVerticalBotanical_Front, back: buildVerticalBotanical_Back },
  'vertical-teal-corners':  { front: buildVerticalTealCorners_Front, back: buildVerticalTealCorners_Back },
  'vertical-navy-triangle': { front: buildVerticalNavyTriangle_Front, back: buildVerticalNavyTriangle_Back },
  'vertical-teal-solid':    { front: buildVerticalTealSolid_Front, back: buildVerticalTealSolid_Back },
  'vertical-navy-yellow':   { front: buildVerticalNavyYellow_Front, back: buildVerticalNavyYellow_Back },
  'medical-health':      { front: buildMedical_Front,     back: buildMedical_Back },
  'legal-professional':  { front: buildLegal_Front,       back: buildLegal_Back },
  'real-estate':         { front: buildRealEstate_Front,  back: buildRealEstate_Back },
  'food-restaurant':     { front: buildFood_Front,        back: buildFood_Back },
  'photography':         { front: buildPhotography_Front, back: buildPhotography_Back },
  'beauty-spa':          { front: buildBeauty_Front,      back: buildBeauty_Back },
  'tech-startup':        { front: buildTechStartup_Front, back: buildTechStartup_Back },
  'consulting-finance':  { front: buildConsulting_Front,  back: buildConsulting_Back },
  'square-minimal':      { front: buildSquareMinimal_Front, back: buildSquareMinimal_Back },
  'square-bold':         { front: buildSquareBold_Front,    back: buildSquareBold_Back },
  'square-creative':     { front: buildSquareCreative_Front, back: buildSquareCreative_Back },
  'square-red-sidebar':  { front: buildSquareRedSidebar_Front, back: buildSquareRedSidebar_Back },
  'square-red-diagonal': { front: buildSquareRedDiagonal_Front, back: buildSquareRedDiagonal_Back },
  'square-teal-minimal': { front: buildSquareTealMinimal_Front, back: buildSquareTealMinimal_Back },
  'square-green-elegant':{ front: buildSquareGreenElegant_Front, back: buildSquareGreenElegant_Back },
}

/**
 * Build a card onto the canvas.
 * Canvas must already be resized to correct dimensions (900x540 or 540x900).
 */
export function buildCard(canvas, fabric, templateId, side) {
  templateId = templateId || 'corporate-blue'
  side       = side       || 'front'
  const builders = BUILDERS[templateId] || BUILDERS['corporate-blue']
  const build    = side === 'front' ? builders.front : builders.back

  canvas.renderOnAddRemove = false
  canvas.clear()
  canvas.discardActiveObject()
  build(canvas, fabric)
  canvas.renderOnAddRemove = true
  canvas.renderAll()
  return canvas.backgroundColor
}

export async function buildDefaultCard(canvas, fabric) {
  buildCard(canvas, fabric, 'corporate-blue', 'front')
}

