// ─── Tiny construction helpers ───────────────────────────────────────────────

const setBg = (canvas, color) => { canvas.backgroundColor = color }
const IT  = (fabric, str, o) => new fabric.IText(str, o)
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
  canvas.add(C(fabric, {
    left: cx - r, top: cy - r, radius: r,
    fill: fill ?? 'rgba(255,255,255,0.08)', stroke, strokeWidth: 2, name: 'Logo Circle',
  }))
  canvas.add(IT(fabric, 'LOGO', {
    left: cx - 14, top: cy - 10, fontSize: 13, fill: stroke,
    fontFamily: 'Arial, sans-serif', fontWeight: 'bold', opacity: 0.6, name: 'Logo',
  }))
}

function qrBox(canvas, fabric, left, top, bgFill, cellFill, size) {
  size = size ?? 72
  canvas.add(R(fabric, { left, top, width: size, height: size, fill: bgFill, rx: 5, name: 'QR Placeholder', selectable: false, evented: false }))
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (Math.random() > 0.45) {
        const cell = size / 5
        canvas.add(R(fabric, { left: left + 3 + col * cell, top: top + 3 + row * cell, width: cell - 2, height: cell - 2, fill: cellFill, selectable: false, evented: false, name: 'QR Cell' }))
      }
    }
  }
}

// Generic back: wave shape + centered logo + company info + QR
function stdBack(canvas, fabric, opts) {
  const { bg, wave, logoStroke, logoLabelColor, company, companyColor, tagline, taglineColor, website, websiteColor, qrBg, qrCell } = opts
  setBg(canvas, bg)
  const W = canvas.width, H = canvas.height
  const isV = H > W

  if (isV) {
    // Vertical: arc at bottom
    canvas.add(P(fabric, 'M 0 ' + (H * .65) + ' Q ' + (W * .5) + ' ' + (H * .52) + ' ' + W + ' ' + (H * .65) + ' L ' + W + ' ' + H + ' L 0 ' + H + ' Z', { fill: wave, opacity: 0.7, selectable: false, evented: false }))
    canvas.add(P(fabric, 'M 0 ' + (H * .73) + ' Q ' + (W * .5) + ' ' + (H * .61) + ' ' + W + ' ' + (H * .73) + ' L ' + W + ' ' + H + ' L 0 ' + H + ' Z', { fill: wave, opacity: 0.4, selectable: false, evented: false }))
    logoCircle(canvas, fabric, W / 2, H * .24, 62, logoStroke)
    canvas.add(IT(fabric, company, { left: W / 2, top: H * .44, fontSize: 24, fill: companyColor ?? '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', originX: 'center', name: 'Company' }))
    canvas.add(IT(fabric, tagline, { left: W / 2, top: H * .52, fontSize: 12, fill: taglineColor ?? logoStroke, fontFamily: 'Arial, sans-serif', fontStyle: 'italic', originX: 'center', name: 'Tagline' }))
    canvas.add(IT(fabric, website, { left: W / 2, top: H * .59, fontSize: 11, fill: websiteColor ?? '#94a3b8', fontFamily: 'Arial, sans-serif', originX: 'center', name: 'Website' }))
    qrBox(canvas, fabric, W / 2 - 36, H - 110, qrBg, qrCell)
  } else {
    // Horizontal: wave at bottom
    canvas.add(P(fabric, 'M 0 ' + (H * .55) + ' Q ' + (W * .3) + ' ' + (H * .42) + ' ' + W + ' ' + (H * .5) + ' L ' + W + ' ' + H + ' L 0 ' + H + ' Z', { fill: wave, opacity: 0.75, selectable: false, evented: false }))
    canvas.add(P(fabric, 'M 0 ' + (H * .66) + ' Q ' + (W * .4) + ' ' + (H * .54) + ' ' + W + ' ' + (H * .62) + ' L ' + W + ' ' + H + ' L 0 ' + H + ' Z', { fill: wave, opacity: 0.4, selectable: false, evented: false }))
    logoCircle(canvas, fabric, W / 2, 130, 65, logoStroke)
    canvas.add(IT(fabric, company, { left: W / 2, top: 220, fontSize: 32, fill: companyColor ?? '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', originX: 'center', name: 'Company' }))
    canvas.add(IT(fabric, tagline, { left: W / 2, top: 264, fontSize: 13, fill: taglineColor ?? logoStroke, fontFamily: 'Arial, sans-serif', fontStyle: 'italic', originX: 'center', name: 'Tagline' }))
    canvas.add(IT(fabric, website, { left: W / 2, top: 305, fontSize: 12, fill: websiteColor ?? '#94a3b8', fontFamily: 'Arial, sans-serif', originX: 'center', name: 'Website' }))
    qrBox(canvas, fabric, W - 110, H - 108, qrBg, qrCell)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  HORIZONTAL TEMPLATES  (900 × 540)
// ═══════════════════════════════════════════════════════════════════════════

function buildCorporateBlue_Front(canvas, fabric) {
  setBg(canvas, '#1e3a5f')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M ' + (W*.58) + ' 0 Q ' + (W*.5) + ' ' + (H*.5) + ' ' + (W*.58) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill: '#4F46E5', opacity: 0.9, name: 'Accent Shape' }))
  canvas.add(P(fabric, 'M ' + (W*.63) + ' 0 Q ' + (W*.55) + ' ' + (H*.5) + ' ' + (W*.63) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill: '#6366f1', opacity: 0.4, name: 'Accent Layer 2' }))
  canvas.add(IT(fabric, 'Your Name', { left: 48, top: 88, fontSize: 42, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left: 48, top: 146, fontSize: 15, fill: '#93c5fd', fontFamily: 'Arial, sans-serif', name: 'Title' }))
  canvas.add(L(fabric, [48, 183, 300, 183], { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, selectable: false, evented: false }))
  addContacts(canvas, fabric, 48, 200, 27, '#e0e7ff')
  logoCircle(canvas, fabric, W*.79, 128, 50, 'rgba(255,255,255,0.5)')
  canvas.add(IT(fabric, 'Company Name', { left: W*.79 - 55, top: 202, fontSize: 21, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Company' }))
  canvas.add(IT(fabric, 'Connecting the World', { left: W*.79 - 55, top: 232, fontSize: 11, fill: 'rgba(255,255,255,0.55)', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', name: 'Tagline' }))
}
function buildCorporateBlue_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg: '#1e3a5f', wave: '#4F46E5', logoStroke: 'rgba(255,255,255,0.4)', company: 'Company Name', tagline: 'Connecting the World with Smarter Data', website: 'www.example.com', qrBg: '#fff', qrCell: '#1e3a5f' })
}

function buildCorporateBlack_Front(canvas, fabric) {
  setBg(canvas, '#111111')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M 0 ' + (H*.72) + ' L ' + (W*.48) + ' 0 L ' + (W*.58) + ' 0 L ' + (W*.1) + ' ' + H + ' L 0 ' + H + ' Z', { fill: '#B8860B', opacity: 0.3, name: 'Gold Stripe' }))
  canvas.add(R(fabric, { left: 0, top: 0, width: 6, height: H, fill: '#FFD700', selectable: false, evented: false, name: 'Gold Bar' }))
  canvas.add(IT(fabric, 'YOUR NAME', { left: 48, top: 75, fontSize: 42, fill: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 80, name: 'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left: 50, top: 133, fontSize: 14, fill: '#FFD700', fontFamily: 'Arial, sans-serif', charSpacing: 40, name: 'Title' }))
  canvas.add(L(fabric, [48, 166, 380, 166], { stroke: '#FFD700', strokeWidth: 1, opacity: 0.45, selectable: false, evented: false }))
  addContacts(canvas, fabric, 50, 180, 27, '#d1d5db', 0.7)
  logoCircle(canvas, fabric, W - 130, 120, 65, '#FFD700', 'rgba(255,215,0,0.06)')
  canvas.add(IT(fabric, 'Company Name', { left: W - 190, top: 208, fontSize: 19, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Company' }))
  canvas.add(IT(fabric, 'Premium Data Solutions', { left: W - 186, top: 236, fontSize: 11, fill: '#FFD700', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', name: 'Tagline' }))
}
function buildCorporateBlack_Back(canvas, fabric) {
  setBg(canvas, '#111111')
  const W = canvas.width, H = canvas.height
  canvas.add(new fabric.Polygon([{x:W/2,y:40},{x:W-60,y:H/2},{x:W/2,y:H-40},{x:60,y:H/2}], { fill: 'transparent', stroke: '#FFD700', strokeWidth: 1.5, opacity: 0.3, name: 'Diamond Outline' }))
  logoCircle(canvas, fabric, W/2, H/2, 55, '#FFD700', 'rgba(255,215,0,0.06)')
  canvas.add(IT(fabric, 'COMPANY NAME', { left: W/2, top: H/2+70, fontSize: 26, fill: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', charSpacing: 60, originX: 'center', name: 'Company' }))
  canvas.add(IT(fabric, 'Premium Data Solutions', { left: W/2, top: H/2+108, fontSize: 12, fill: '#FFD700', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', originX: 'center', name: 'Tagline' }))
  qrBox(canvas, fabric, W - 108, H - 108, '#1a1a1a', '#FFD700')
}

function buildGreenProfessional_Front(canvas, fabric) {
  setBg(canvas, '#064e3b')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 0, top: H*.58, width: W, height: H*.42, fill: '#065f46', selectable: false, evented: false }))
  canvas.add(P(fabric, 'M ' + (W*.65) + ' -20 Q ' + (W*.9) + ' ' + (H*.3) + ' ' + (W*.7) + ' ' + (H*.6), { fill: 'transparent', stroke: '#10b981', strokeWidth: 28, opacity: 0.12, selectable: false, evented: false }))
  canvas.add(IT(fabric, 'Your Name', { left: 48, top: 80, fontSize: 42, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left: 48, top: 136, fontSize: 14, fill: '#6ee7b7', fontFamily: 'Arial, sans-serif', name: 'Title' }))
  canvas.add(L(fabric, [48, 168, 330, 168], { stroke: '#10b981', strokeWidth: 1.5, opacity: 0.5, selectable: false, evented: false }))
  addContacts(canvas, fabric, 48, 182, 27, '#d1fae5', 0.82)
  logoCircle(canvas, fabric, W - 120, 128, 55, '#6ee7b7')
  canvas.add(IT(fabric, 'Company Name', { left: W - 188, top: 206, fontSize: 19, fill: '#fff', fontFamily: 'Georgia, serif', fontWeight: 'bold', name: 'Company' }))
  canvas.add(IT(fabric, 'Green Tech Solutions', { left: W - 168, top: 234, fontSize: 11, fill: '#6ee7b7', fontFamily: 'Arial, sans-serif', fontStyle: 'italic', name: 'Tagline' }))
}
function buildGreenProfessional_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg: '#022c22', wave: '#064e3b', logoStroke: '#10b981', company: 'Company Name', tagline: 'Sustainable Data Solutions', website: 'www.example.com', qrBg: '#064e3b', qrCell: '#10b981' })
}

function buildTechModern_Front(canvas, fabric) {
  setBg(canvas, '#0f172a')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left: 0, top: 0, width: 5, height: H, fill: '#7c3aed', selectable: false, evented: false }))
  for (let col = 2; col <= 10; col++) for (let row = 1; row <= 7; row++)
    canvas.add(C(fabric, { left: col*80-2, top: row*70-2, radius: 1.5, fill: 'rgba(124,58,237,0.18)', selectable: false, evented: false }))
  canvas.add(IT(fabric, 'Your Name', { left: 30, top: 72, fontSize: 40, fill: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', name: 'Name' }))
  canvas.add(IT(fabric, '< Your Title />', { left: 32, top: 126, fontSize: 13, fill: '#a78bfa', fontFamily: 'Courier New, monospace', name: 'Title' }))
  canvas.add(L(fabric, [30, 160, 320, 160], { stroke: '#7c3aed', strokeWidth: 1, opacity: 0.5, selectable: false, evented: false }))
  ;['+91 9876543210','you@example.com','www.example.com','123 Business St.'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left: 32, top: 174+i*27, fontSize: 12, fill: '#cbd5e1', fontFamily: 'Courier New, monospace', name: ['Phone','Email','Website','Address'][i] })))
  logoCircle(canvas, fabric, W - 115, 126, 58, '#a78bfa')
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
    .forEach(([x,y,r,f,op]) => canvas.add(C(fabric, { left:x-r,top:y-r,radius:r,fill:f,opacity:op,selectable:false,evented:false })))
  canvas.add(IT(fabric, 'Your Name', { left: 48, top: 80, fontSize: 40, fill: '#831843', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontStyle: 'italic', name: 'Name' }))
  canvas.add(IT(fabric, 'Creative Director', { left: 50, top: 133, fontSize: 14, fill: '#be185d', fontFamily: 'Georgia, serif', fontStyle: 'italic', name: 'Title' }))
  canvas.add(L(fabric, [48, 164, 300, 164], { stroke: '#f9a8d4', strokeWidth: 2, selectable: false, evented: false }))
  addContacts(canvas, fabric, 48, 178, 27, '#4b5563', 0.85)
  logoCircle(canvas, fabric, W - 140, 122, 62, '#ec4899', 'rgba(249,168,212,0.15)')
  canvas.add(IT(fabric, 'Studio Bloom', { left: W-196, top: 204, fontSize: 19, fill: '#831843', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontStyle: 'italic', name: 'Company' }))
  canvas.add(IT(fabric, 'Art & Design Agency', { left: W-180, top: 232, fontSize: 11, fill: '#be185d', fontFamily: 'Georgia, serif', fontStyle: 'italic', name: 'Tagline' }))
}
function buildFloralCreative_Back(canvas, fabric) {
  setBg(canvas, '#fce7f3')
  const W = canvas.width, H = canvas.height
  canvas.add(C(fabric, { left:W/2-220,top:-80,radius:240,fill:'#fbcfe8',opacity:0.6,selectable:false,evented:false }))
  canvas.add(C(fabric, { left:W-80,top:H-100,radius:170,fill:'#f9a8d4',opacity:0.4,selectable:false,evented:false }))
  logoCircle(canvas, fabric, W/2, 130, 65, '#ec4899', 'rgba(236,72,153,0.08)')
  canvas.add(IT(fabric, 'Studio Bloom', { left:W/2,top:218,fontSize:32,fill:'#831843',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Where Creativity Blossoms', { left:W/2,top:262,fontSize:13,fill:'#be185d',fontFamily:'Georgia, serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(IT(fabric, '@studiobloom  ·  studiobloom.co', { left:W/2,top:300,fontSize:11,fill:'#9d174d',fontFamily:'Arial, sans-serif',originX:'center',name:'Handles' }))
  qrBox(canvas, fabric, W-108, H-108, '#fff', '#ec4899')
}

function buildMinimalWhite_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:W,height:5,fill:'#4F46E5',selectable:false,evented:false }))
  canvas.add(R(fabric, { left:0,top:5,width:3,height:H-5,fill:'#4F46E5',opacity:0.12,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Your Name', { left:48,top:70,fontSize:40,fill:'#1e1b4b',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left:50,top:124,fontSize:14,fill:'#4F46E5',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [48,155,320,155], { stroke:'#e5e7eb',strokeWidth:1.5,selectable:false,evented:false }))
  addContacts(canvas, fabric, 48, 170, 27, '#374151', 0.88)
  canvas.add(L(fabric, [W-200,46,W-200,H-46], { stroke:'#e5e7eb',strokeWidth:1,selectable:false,evented:false }))
  logoCircle(canvas, fabric, W-140, 122, 60, '#4F46E5', '#eef2ff')
  canvas.add(IT(fabric, 'Company Name', { left:W-200,top:200,fontSize:18,fill:'#1e1b4b',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Company' }))
  canvas.add(IT(fabric, 'Connecting the World', { left:W-192,top:228,fontSize:11,fill:'#6b7280',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'Tagline' }))
}
function buildMinimalWhite_Back(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:H*.62,width:W,height:H*.38,fill:'#4F46E5',selectable:false,evented:false }))
  logoCircle(canvas, fabric, W/2, 100, 65, '#4F46E5', '#eef2ff')
  canvas.add(IT(fabric, 'Company Name', { left:W/2,top:196,fontSize:32,fill:'#1e1b4b',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Connecting the World', { left:W/2,top:240,fontSize:13,fill:'#6b7280',fontFamily:'Arial, sans-serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(IT(fabric, 'www.example.com', { left:W/2,top:H*.62+28,fontSize:13,fill:'#fff',fontFamily:'Arial, sans-serif',originX:'center',name:'Website' }))
  canvas.add(IT(fabric, 'hello@example.com  ·  +91 9876543210', { left:W/2,top:H*.62+54,fontSize:11,fill:'rgba(255,255,255,0.7)',fontFamily:'Arial, sans-serif',originX:'center',name:'Contact' }))
  qrBox(canvas, fabric, W-108, H-100, '#fff', '#4F46E5')
}

// ═══════════════════════════════════════════════════════════════════════════
//  VERTICAL TEMPLATES  (540 × 900)
// ═══════════════════════════════════════════════════════════════════════════

function buildVerticalExecutive_Front(canvas, fabric) {
  setBg(canvas, '#0f172a')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:W,height:8,fill:'#d4a017',selectable:false,evented:false }))
  canvas.add(IT(fabric, 'YOUR NAME', { left:W/2,top:H*.1,fontSize:34,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',charSpacing:80,originX:'center',name:'Name' }))
  canvas.add(IT(fabric, 'Your Title', { left:W/2,top:H*.19,fontSize:13,fill:'#d4a017',fontFamily:'Arial, sans-serif',charSpacing:30,originX:'center',name:'Title' }))
  canvas.add(L(fabric, [48,H*.27,W-48,H*.27], { stroke:'rgba(212,160,23,0.4)',strokeWidth:1,selectable:false,evented:false }))
  ;['+91 9876543210','+91 9876543211','john@example.com','www.example.com'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W/2,top:H*.3+i*38,fontSize:13,fill:'#cbd5e1',fontFamily:'Arial, sans-serif',opacity:0.85,originX:'center',name:['Phone','Alt Phone','Email','Website'][i] })))
  canvas.add(L(fabric, [48,H*.68,W-48,H*.68], { stroke:'rgba(212,160,23,0.25)',strokeWidth:1,selectable:false,evented:false }))
  logoCircle(canvas, fabric, W/2, H*.77, 48, '#d4a017', 'rgba(212,160,23,0.08)')
  canvas.add(IT(fabric, 'Company Name', { left:W/2,top:H*.87,fontSize:20,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Connecting the World', { left:W/2,top:H*.92,fontSize:11,fill:'rgba(212,160,23,0.75)',fontFamily:'Arial, sans-serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(R(fabric, { left:0,top:H-8,width:W,height:8,fill:'#d4a017',selectable:false,evented:false }))
}
function buildVerticalExecutive_Back(canvas, fabric) {
  stdBack(canvas, fabric, { bg:'#0f172a',wave:'#d4a017',logoStroke:'#d4a017',company:'Company Name',tagline:'Premium Data Solutions Worldwide',website:'www.example.com',qrBg:'#1e293b',qrCell:'#d4a017' })
}

function buildVerticalMinimal_Front(canvas, fabric) {
  setBg(canvas, '#ffffff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:5,height:H,fill:'#6366f1',selectable:false,evented:false }))
  canvas.add(R(fabric, { left:0,top:H*.75,width:W,height:H*.25,fill:'#6366f1',selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Your Name', { left:28,top:H*.1,fontSize:38,fill:'#1e1b4b',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Name' }))
  canvas.add(L(fabric, [28,H*.19,W-28,H*.19], { stroke:'#e5e7eb',strokeWidth:1.5,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Your Title', { left:28,top:H*.22,fontSize:14,fill:'#6366f1',fontFamily:'Arial, sans-serif',name:'Title' }))
  ;['Phone: +91 9876543210','Email: john@example.com','Web: www.example.com','Addr: 123 Business Street'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:28,top:H*.3+i*44,fontSize:12,fill:'#374151',fontFamily:'Arial, sans-serif',opacity:0.85,name:['Phone','Email','Website','Address'][i] })))
  logoCircle(canvas, fabric, W/2, H*.63, 50, '#6366f1', '#eef2ff')
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
    canvas.add(C(fabric, { left:W/2-r,top:H*.08-r,radius:r,fill:col,opacity:op,selectable:false,evented:false })))
  canvas.add(IT(fabric, 'Your Name', { left:W/2,top:H*.37,fontSize:36,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',originX:'center',name:'Name' }))
  canvas.add(IT(fabric, 'Creative Technologist', { left:W/2,top:H*.44,fontSize:13,fill:'#c084fc',fontFamily:'Arial, sans-serif',charSpacing:30,originX:'center',name:'Title' }))
  canvas.add(L(fabric, [W/2-80,H*.51,W/2+80,H*.51], { stroke:'rgba(168,85,247,0.4)',strokeWidth:1,selectable:false,evented:false }))
  ;['+91 9876543210','john@creativeco.io','creativeco.io','@johncreative'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W/2,top:H*.54+i*40,fontSize:12,fill:'#e2d9f3',fontFamily:'Courier New, monospace',opacity:0.8,originX:'center',name:['Phone','Email','Website','Instagram'][i] })))
  canvas.add(IT(fabric, 'Creative Co.', { left:W/2,top:H*.83,fontSize:22,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, '— Design & Technology —', { left:W/2,top:H*.89,fontSize:10,fill:'rgba(192,132,252,0.7)',fontFamily:'Arial, sans-serif',originX:'center',name:'Tagline' }))
}
function buildVerticalCreative_Back(canvas, fabric) {
  setBg(canvas, '#120524')
  const W = canvas.width, H = canvas.height
  ;[[280,0.05],[200,0.09],[130,0.14],[80,0.2],[44,0.3]].forEach(([r,op]) =>
    canvas.add(C(fabric, { left:W/2-r,top:H*.32-r,radius:r,fill:'#a855f7',opacity:op,selectable:false,evented:false })))
  canvas.add(IT(fabric, 'Creative Co.', { left:W/2,top:H*.54,fontSize:28,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Design & Technology', { left:W/2,top:H*.62,fontSize:13,fill:'#c084fc',fontFamily:'Arial, sans-serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(IT(fabric, 'creativeco.io', { left:W/2,top:H*.69,fontSize:11,fill:'rgba(255,255,255,0.4)',fontFamily:'Courier New, monospace',originX:'center',name:'Website' }))
  qrBox(canvas, fabric, W/2-36, H*.76, '#1e0433', '#a855f7')
}

function buildVerticalBotanical_Front(canvas, fabric) {
  setBg(canvas, '#052e16')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M ' + W + ' 0 Q ' + (W*.5) + ' ' + (H*.15) + ' ' + (W*.9) + ' ' + (H*.35), { fill:'transparent',stroke:'#4ade80',strokeWidth:22,opacity:0.1,selectable:false,evented:false }))
  ;[[W*.9,H*.05,80,0.12],[W*.15,H*.9,100,0.1]].forEach(([cx,cy,r,op]) =>
    canvas.add(C(fabric, { left:cx-r,top:cy-r,radius:r,fill:'#4ade80',opacity:op,selectable:false,evented:false })))
  canvas.add(IT(fabric, 'Your Name', { left:W/2,top:H*.12,fontSize:36,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Name' }))
  canvas.add(IT(fabric, 'Sustainability Consultant', { left:W/2,top:H*.2,fontSize:13,fill:'#86efac',fontFamily:'Arial, sans-serif',originX:'center',name:'Title' }))
  canvas.add(L(fabric, [48,H*.27,W-48,H*.27], { stroke:'rgba(74,222,128,0.3)',strokeWidth:1,selectable:false,evented:false }))
  ;['+91 9876543210','jane@earthco.com','www.earthco.com','Nature Valley, Suite 4'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W/2,top:H*.3+i*40,fontSize:12,fill:'#bbf7d0',fontFamily:'Arial, sans-serif',opacity:0.85,originX:'center',name:['Phone','Email','Website','Address'][i] })))
  logoCircle(canvas, fabric, W/2, H*.72, 50, '#4ade80', 'rgba(74,222,128,0.08)')
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
  canvas.add(R(fabric, { left:0,top:0,width:W*.36,height:H,fill:'#0ea5e9',selectable:false,evented:false }))
  canvas.add(R(fabric, { left:W*.36,top:0,width:4,height:H,fill:'#0284c7',selectable:false,evented:false }))
  const cx=W*.18,cy=H*.42,cs=48,ct=14
  canvas.add(R(fabric, { left:cx-ct/2,top:cy-cs/2,width:ct,height:cs,fill:'rgba(255,255,255,0.85)',rx:3,selectable:false,evented:false,name:'Cross V' }))
  canvas.add(R(fabric, { left:cx-cs/2,top:cy-ct/2,width:cs,height:ct,fill:'rgba(255,255,255,0.85)',rx:3,selectable:false,evented:false,name:'Cross H' }))
  canvas.add(IT(fabric, 'HealthCare', { left:W*.18,top:H*.22,fontSize:18,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Clinic Name' }))
  canvas.add(IT(fabric, 'Clinic & Hospital', { left:W*.18,top:H*.32,fontSize:10,fill:'rgba(255,255,255,0.8)',fontFamily:'Arial, sans-serif',originX:'center',name:'Clinic Sub' }))
  canvas.add(IT(fabric, 'Dr. Your Name, MD', { left:W*.4,top:64,fontSize:32,fill:'#0c4a6e',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Senior Cardiologist', { left:W*.4,top:108,fontSize:14,fill:'#0ea5e9',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [W*.4,135,W-40,135], { stroke:'#bae6fd',strokeWidth:1.5,selectable:false,evented:false }))
  ;['+91 9876543210','dr.john@healthcare.com','www.healthcare.com','123 Medical Plaza, City'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:W*.4,top:150+i*28,fontSize:13,fill:'#0369a1',opacity:0.85,fontFamily:'Arial, sans-serif',name:['Phone','Email','Website','Address'][i] })))
  canvas.add(IT(fabric, 'MBBS, MD (Cardiology)', { left:W*.4,top:H-46,fontSize:11,fill:'#64748b',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'Credentials' }))
}
function buildMedical_Back(canvas, fabric) {
  setBg(canvas, '#f0f9ff')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:W,height:H*.18,fill:'#0ea5e9',selectable:false,evented:false }))
  const cx2=W/2,cy2=H*.1,cs2=36,ct2=11
  canvas.add(R(fabric, { left:cx2-ct2/2,top:cy2-cs2/2,width:ct2,height:cs2,fill:'rgba(255,255,255,0.85)',rx:2,selectable:false,evented:false }))
  canvas.add(R(fabric, { left:cx2-cs2/2,top:cy2-ct2/2,width:cs2,height:ct2,fill:'rgba(255,255,255,0.85)',rx:2,selectable:false,evented:false }))
  logoCircle(canvas, fabric, W/2, H*.4, 60, '#0ea5e9', 'rgba(14,165,233,0.08)')
  canvas.add(IT(fabric, 'HealthCare Clinic', { left:W/2,top:H*.57,fontSize:28,fill:'#0c4a6e',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Excellence in Patient Care', { left:W/2,top:H*.67,fontSize:13,fill:'#0ea5e9',fontFamily:'Georgia, serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(IT(fabric, 'www.healthcare.com', { left:W/2,top:H*.76,fontSize:12,fill:'#64748b',fontFamily:'Arial, sans-serif',originX:'center',name:'Website' }))
  qrBox(canvas, fabric, W-108, H-108, '#bae6fd', '#0ea5e9')
}

function buildLegal_Front(canvas, fabric) {
  setBg(canvas, '#0c1a2e')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:W-6,top:0,width:6,height:H,fill:'#c9a227',selectable:false,evented:false }))
  canvas.add(R(fabric, { left:30,top:20,width:W-66,height:1,fill:'#c9a227',opacity:0.25,selectable:false,evented:false }))
  canvas.add(R(fabric, { left:30,top:H-22,width:W-66,height:1,fill:'#c9a227',opacity:0.25,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'James Anderson', { left:90,top:72,fontSize:38,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Name' }))
  canvas.add(IT(fabric, 'Attorney at Law', { left:92,top:122,fontSize:14,fill:'#c9a227',fontFamily:'Georgia, serif',charSpacing:40,name:'Title' }))
  canvas.add(L(fabric, [90,152,500,152], { stroke:'rgba(201,162,39,0.3)',strokeWidth:1,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Bar No. CA-123456', { left:92,top:168,fontSize:12,fill:'rgba(255,255,255,0.45)',fontFamily:'Arial, sans-serif',fontStyle:'italic',name:'Bar No' }))
  ;['+91 9876543210','james@andersonlaw.com','www.andersonlaw.com'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:92,top:196+i*28,fontSize:13,fill:'#d1d5db',fontFamily:'Arial, sans-serif',name:['Phone','Email','Website'][i] })))
  logoCircle(canvas, fabric, W-130, 120, 58, '#c9a227', 'rgba(201,162,39,0.06)')
  canvas.add(IT(fabric, 'Anderson & Partners', { left:W-210,top:200,fontSize:16,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Company' }))
  canvas.add(IT(fabric, 'Law Firm', { left:W-155,top:226,fontSize:11,fill:'#c9a227',fontFamily:'Georgia, serif',name:'Tagline' }))
}
function buildLegal_Back(canvas, fabric) {
  setBg(canvas, '#0c1a2e')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:20,top:20,width:W-40,height:H-40,fill:'transparent',stroke:'#c9a227',strokeWidth:1,opacity:0.2,rx:2,selectable:false,evented:false }))
  canvas.add(R(fabric, { left:28,top:28,width:W-56,height:H-56,fill:'transparent',stroke:'#c9a227',strokeWidth:0.5,opacity:0.1,rx:2,selectable:false,evented:false }))
  logoCircle(canvas, fabric, W/2, 128, 62, '#c9a227', 'rgba(201,162,39,0.06)')
  canvas.add(IT(fabric, 'Anderson & Partners', { left:W/2,top:218,fontSize:28,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Excellence · Integrity · Justice', { left:W/2,top:262,fontSize:12,fill:'rgba(255,255,255,0.35)',fontFamily:'Georgia, serif',fontStyle:'italic',originX:'center',name:'Motto' }))
  qrBox(canvas, fabric, W-108, H-108, '#0c1a2e', '#c9a227')
  canvas.add(R(fabric, { left:W-108,top:H-108,width:72,height:72,fill:'transparent',stroke:'#c9a227',strokeWidth:1,rx:4,selectable:false,evented:false }))
}

function buildRealEstate_Front(canvas, fabric) {
  setBg(canvas, '#1c1917')
  const W = canvas.width, H = canvas.height
  canvas.add(P(fabric, 'M ' + (W*.6) + ' 0 Q ' + (W*.53) + ' ' + (H*.5) + ' ' + (W*.6) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill:'#d97706',opacity:0.9,selectable:false,evented:false,name:'Accent Shape' }))
  canvas.add(P(fabric, 'M ' + (W*.65) + ' 0 Q ' + (W*.58) + ' ' + (H*.5) + ' ' + (W*.65) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill:'#b45309',opacity:0.5,selectable:false,evented:false }))
  const hx=W*.82,hy=90,hs=40
  canvas.add(P(fabric, 'M ' + hx + ' ' + (hy+hs) + ' L ' + (hx-hs) + ' ' + (hy+hs) + ' L ' + (hx-hs) + ' ' + (hy+hs*.4) + ' L ' + hx + ' ' + hy + ' L ' + (hx+hs) + ' ' + (hy+hs*.4) + ' L ' + (hx+hs) + ' ' + (hy+hs) + ' Z', { fill:'rgba(255,255,255,0.15)',stroke:'rgba(255,255,255,0.3)',strokeWidth:1.5,selectable:false,evented:false,name:'House Icon' }))
  canvas.add(IT(fabric, 'REALTOR®', { left:W*.82,top:hy+hs+12,fontSize:9,fill:'rgba(255,255,255,0.7)',fontFamily:'Arial, sans-serif',fontWeight:'bold',originX:'center',name:'Designation' }))
  canvas.add(IT(fabric, 'Sarah Chen', { left:45,top:72,fontSize:40,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Name' }))
  canvas.add(IT(fabric, 'Licensed Real Estate Agent', { left:47,top:124,fontSize:13,fill:'#fcd34d',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [46,153,320,153], { stroke:'rgba(252,211,77,0.3)',strokeWidth:1,selectable:false,evented:false }))
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
  canvas.add(P(fabric, 'M ' + (W*.56) + ' 0 Q ' + (W*.48) + ' ' + (H*.5) + ' ' + (W*.56) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill:'#c2410c',opacity:0.85,selectable:false,evented:false }))
  canvas.add(P(fabric, 'M ' + (W*.62) + ' 0 Q ' + (W*.54) + ' ' + (H*.5) + ' ' + (W*.62) + ' ' + H + ' L ' + W + ' ' + H + ' L ' + W + ' 0 Z', { fill:'#ea580c',opacity:0.5,selectable:false,evented:false }))
  canvas.add(R(fabric, { left:12,top:12,width:W*.5,height:H-24,fill:'transparent',stroke:'rgba(255,150,50,0.1)',strokeWidth:1,rx:2,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Bella Cucina', { left:40,top:62,fontSize:38,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Restaurant Name' }))
  canvas.add(IT(fabric, '— Fine Italian Dining —', { left:40,top:113,fontSize:12,fill:'#fdba74',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Cuisine' }))
  canvas.add(L(fabric, [38,140,300,140], { stroke:'rgba(251,146,60,0.3)',strokeWidth:1,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Marco Rossi', { left:40,top:156,fontSize:22,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Chef Name' }))
  canvas.add(IT(fabric, 'Executive Chef & Owner', { left:40,top:186,fontSize:13,fill:'#fdba74',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [38,214,300,214], { stroke:'rgba(251,146,60,0.2)',strokeWidth:1,selectable:false,evented:false }))
  ;['+91 9876543210','reservations@bellacucina.com','123 Culinary Avenue'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:40,top:224+i*28,fontSize:13,fill:'#fcd9b6',fontFamily:'Arial, sans-serif',opacity:0.85,name:['Reservations','Email','Address'][i] })))
  logoCircle(canvas, fabric, W*.78, 128, 52, '#fdba74', 'rgba(253,186,116,0.08)')
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
    canvas.add(C(fabric, { left:ox-r,top:oy-r,radius:r,fill:'transparent',stroke:'#e2e8f0',strokeWidth:1.5,opacity:op,selectable:false,evented:false })))
  canvas.add(C(fabric, { left:ox-8,top:oy-8,radius:8,fill:'#e2e8f0',opacity:0.5,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Alex Kim', { left:44,top:82,fontSize:46,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Photography', { left:46,top:140,fontSize:20,fill:'#94a3b8',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Title' }))
  canvas.add(L(fabric, [44,176,300,176], { stroke:'rgba(255,255,255,0.1)',strokeWidth:1,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Portraits  ·  Events  ·  Commercial', { left:46,top:192,fontSize:12,fill:'#64748b',fontFamily:'Arial, sans-serif',charSpacing:20,name:'Specialty' }))
  ;['+91 9876543210','alex@alexkim.co','alexkim.co','@alexkimphoto'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:46,top:218+i*28,fontSize:13,fill:'#e2e8f0',fontFamily:'Arial, sans-serif',opacity:0.8,name:['Phone','Email','Website','Instagram'][i] })))
}
function buildPhotography_Back(canvas, fabric) {
  setBg(canvas, '#0a0a0a')
  const W = canvas.width, H = canvas.height
  const ox=W/2, oy=H*.38
  ;[[180,0.07],[130,0.11],[90,0.16],[60,0.22],[36,0.3],[18,0.4]].forEach(([r,op]) =>
    canvas.add(C(fabric, { left:ox-r,top:oy-r,radius:r,fill:'transparent',stroke:'#e2e8f0',strokeWidth:1.5,opacity:op,selectable:false,evented:false })))
  canvas.add(C(fabric, { left:ox-10,top:oy-10,radius:10,fill:'#e2e8f0',opacity:0.5,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Alex Kim Photography', { left:W/2,top:H*.62,fontSize:24,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Portraits · Events · Commercial', { left:W/2,top:H*.71,fontSize:12,fill:'#94a3b8',fontFamily:'Arial, sans-serif',charSpacing:20,originX:'center',name:'Specialty' }))
  canvas.add(IT(fabric, 'alexkim.co  ·  @alexkimphoto', { left:W/2,top:H*.79,fontSize:11,fill:'rgba(255,255,255,0.3)',fontFamily:'Arial, sans-serif',originX:'center',name:'Handles' }))
  qrBox(canvas, fabric, W-108, H-108, '#111', '#e2e8f0')
}

function buildBeauty_Front(canvas, fabric) {
  setBg(canvas, '#fff0f3')
  const W = canvas.width, H = canvas.height
  ;[[W,-20,130,0.25],[W-20,30,80,0.18],[-20,H-30,100,0.15],[40,H+10,70,0.12]].forEach(([x,y,r,op]) =>
    canvas.add(C(fabric, { left:x-r,top:y-r,radius:r,fill:'#fda4af',opacity:op,selectable:false,evented:false })))
  canvas.add(IT(fabric, 'Emma Williams', { left:45,top:70,fontSize:36,fill:'#4a0518',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Name' }))
  canvas.add(IT(fabric, 'Master Stylist & Beauty Consultant', { left:47,top:118,fontSize:13,fill:'#e11d48',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [45,148,330,148], { stroke:'#fda4af',strokeWidth:2,selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Cut  ·  Color  ·  Nails  ·  Facials', { left:47,top:162,fontSize:12,fill:'#be123c',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Services' }))
  ;['+91 9876543210','emma@bellasalon.com','www.bellasalon.com','@bellasalonofficial'].forEach((txt, i) =>
    canvas.add(IT(fabric, txt, { left:47,top:188+i*28,fontSize:13,fill:'#4b5563',fontFamily:'Arial, sans-serif',opacity:0.85,name:['Phone','Email','Website','Instagram'][i] })))
  logoCircle(canvas, fabric, W-145, 116, 60, '#e11d48', 'rgba(225,29,72,0.06)')
  canvas.add(IT(fabric, 'Bella Salon', { left:W-202,top:196,fontSize:20,fill:'#4a0518',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',name:'Company' }))
  canvas.add(IT(fabric, '& Spa Studio', { left:W-186,top:224,fontSize:13,fill:'#e11d48',fontFamily:'Georgia, serif',fontStyle:'italic',name:'Tagline' }))
}
function buildBeauty_Back(canvas, fabric) {
  setBg(canvas, '#fff0f3')
  const W = canvas.width, H = canvas.height
  canvas.add(C(fabric, { left:W/2-180,top:-60,radius:220,fill:'#fecdd3',opacity:0.6,selectable:false,evented:false }))
  canvas.add(C(fabric, { left:W-80,top:H-80,radius:140,fill:'#fda4af',opacity:0.35,selectable:false,evented:false }))
  logoCircle(canvas, fabric, W/2, 130, 65, '#e11d48', 'rgba(225,29,72,0.06)')
  canvas.add(IT(fabric, 'Bella Salon & Spa', { left:W/2,top:224,fontSize:28,fill:'#4a0518',fontFamily:'Georgia, serif',fontWeight:'bold',fontStyle:'italic',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Where Beauty Meets Confidence', { left:W/2,top:265,fontSize:13,fill:'#e11d48',fontFamily:'Georgia, serif',fontStyle:'italic',originX:'center',name:'Tagline' }))
  canvas.add(IT(fabric, '@bellasalonofficial  ·  bellasalon.com', { left:W/2,top:304,fontSize:11,fill:'#9f1239',fontFamily:'Arial, sans-serif',originX:'center',name:'Handles' }))
  qrBox(canvas, fabric, W-108, H-108, '#fff', '#e11d48')
}

function buildTechStartup_Front(canvas, fabric) {
  setBg(canvas, '#020617')
  const W = canvas.width, H = canvas.height
  canvas.add(R(fabric, { left:0,top:0,width:5,height:H,fill:'#22c55e',selectable:false,evented:false }))
  for (let col=1;col<=11;col++) for (let row=1;row<=7;row++)
    canvas.add(C(fabric, { left:col*76-2,top:row*70-2,radius:1.5,fill:'rgba(34,197,94,0.13)',selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Alex Rivera', { left:30,top:68,fontSize:42,fill:'#fff',fontFamily:'Arial, sans-serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Co-founder & Lead Engineer', { left:32,top:124,fontSize:13,fill:'#22c55e',fontFamily:'Courier New, monospace',name:'Title' }))
  canvas.add(L(fabric, [30,156,340,156], { stroke:'rgba(34,197,94,0.35)',strokeWidth:1,selectable:false,evented:false }))
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
  canvas.add(R(fabric, { left:0,top:0,width:W,height:4,fill:'#fbbf24',selectable:false,evented:false }))
  canvas.add(R(fabric, { left:W-5,top:4,width:5,height:H-4,fill:'rgba(251,191,36,0.35)',selectable:false,evented:false }))
  canvas.add(IT(fabric, 'Robert Chen, CFA', { left:45,top:60,fontSize:36,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',name:'Name' }))
  canvas.add(IT(fabric, 'Senior Financial Consultant', { left:47,top:108,fontSize:14,fill:'#fbbf24',fontFamily:'Arial, sans-serif',name:'Title' }))
  canvas.add(L(fabric, [45,137,380,137], { stroke:'rgba(251,191,36,0.25)',strokeWidth:1,selectable:false,evented:false }))
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
  canvas.add(R(fabric, { left:0,top:0,width:W,height:4,fill:'#fbbf24',selectable:false,evented:false }))
  canvas.add(R(fabric, { left:18,top:18,width:W-36,height:H-36,fill:'transparent',stroke:'#fbbf24',strokeWidth:1,opacity:0.15,rx:2,selectable:false,evented:false }))
  logoCircle(canvas, fabric, W/2, 124, 62, '#fbbf24', 'rgba(251,191,36,0.06)')
  canvas.add(IT(fabric, 'Apex Finance Group', { left:W/2,top:214,fontSize:28,fill:'#fff',fontFamily:'Georgia, serif',fontWeight:'bold',originX:'center',name:'Company' }))
  canvas.add(IT(fabric, 'Wealth Management · Investment Advisory', { left:W/2,top:256,fontSize:12,fill:'#fbbf24',fontFamily:'Arial, sans-serif',originX:'center',name:'Tagline' }))
  canvas.add(IT(fabric, 'Excellence Since 2005', { left:W/2,top:288,fontSize:11,fill:'rgba(255,255,255,0.28)',fontFamily:'Georgia, serif',fontStyle:'italic',originX:'center',name:'Est' }))
  qrBox(canvas, fabric, W-108, H-108, '#0f172a', '#fbbf24')
}

// ═══════════════════════════════════════════════════════════════════════════
//  BUILDERS MAP & PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

const BUILDERS = {
  'corporate-blue':     { front: buildCorporateBlue_Front,     back: buildCorporateBlue_Back },
  'corporate-black':    { front: buildCorporateBlack_Front,    back: buildCorporateBlack_Back },
  'green-professional': { front: buildGreenProfessional_Front, back: buildGreenProfessional_Back },
  'tech-modern':        { front: buildTechModern_Front,        back: buildTechModern_Back },
  'floral-creative':    { front: buildFloralCreative_Front,    back: buildFloralCreative_Back },
  'minimal-white':      { front: buildMinimalWhite_Front,      back: buildMinimalWhite_Back },
  'vertical-executive': { front: buildVerticalExecutive_Front, back: buildVerticalExecutive_Back },
  'vertical-minimal':   { front: buildVerticalMinimal_Front,   back: buildVerticalMinimal_Back },
  'vertical-creative':  { front: buildVerticalCreative_Front,  back: buildVerticalCreative_Back },
  'vertical-botanical': { front: buildVerticalBotanical_Front, back: buildVerticalBotanical_Back },
  'medical-health':      { front: buildMedical_Front,     back: buildMedical_Back },
  'legal-professional':  { front: buildLegal_Front,       back: buildLegal_Back },
  'real-estate':         { front: buildRealEstate_Front,  back: buildRealEstate_Back },
  'food-restaurant':     { front: buildFood_Front,        back: buildFood_Back },
  'photography':         { front: buildPhotography_Front, back: buildPhotography_Back },
  'beauty-spa':          { front: buildBeauty_Front,      back: buildBeauty_Back },
  'tech-startup':        { front: buildTechStartup_Front, back: buildTechStartup_Back },
  'consulting-finance':  { front: buildConsulting_Front,  back: buildConsulting_Back },
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

