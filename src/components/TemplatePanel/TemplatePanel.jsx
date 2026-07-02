import React from 'react'
import { Search, Star, Heart } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import useEditorStore from '@/store/editorStore'
import { templates } from '@/templates'
import { cn } from '@/lib/utils'

const categoryColors = {
  Corporate: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Modern: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Minimal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Creative: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Vertical: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Industry: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

// ── Horizontal thumbnails ────────────────────────────────────────────────────

function HorizThumbnail({ id, bg, ac, tx }) {
  const { profileDetails } = useEditorStore()
  const nameVal = profileDetails.name || 'Your Name'
  const titleVal = profileDetails.title || 'Your Title'
  const companyVal = profileDetails.company || 'Company Name'
  const emailVal = profileDetails.email || 'hello@example.com'
  const phoneVal = profileDetails.phone || '+1 234 567 890'
  const websiteVal = profileDetails.website || 'www.example.com'
  const avatarUrl = profileDetails.avatarSrc
  const logoUrl = profileDetails.logoSrc

  if (id === 'estelle-darcy-green') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative p-2.5 flex flex-col justify-between text-left" style={{ background: '#faf6f0' }}>
      <div className="absolute top-[32%] left-2.5 right-2.5 h-px bg-[#2c5e43] opacity-40" />
      <div className="absolute top-[64%] left-2.5 right-2.5 h-px bg-[#2c5e43] opacity-40" />
      
      <div className="z-10 mt-1">
        <div className="text-[4.5px] text-[#2c5e43] font-serif italic select-none leading-none">{titleVal.toLowerCase()}</div>
        <div className="text-[8px] font-bold tracking-tight text-[#2c5e43] select-none uppercase mt-0.5 leading-none">{nameVal}</div>
      </div>
      
      <div className="z-10 mt-auto text-[3.5px] space-y-0.5 font-mono text-[#2c5e43] opacity-80">
        <div>{phoneVal}</div>
        <div className="truncate">{emailVal}</div>
      </div>
    </div>
  )

  if (id === 'nails-olivia') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative p-2.5 flex flex-col justify-between text-left" style={{ background: '#ebdcd0' }}>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-[34px] text-[#f5eae2] opacity-75 font-sans leading-none pointer-events-none select-none">
        NAILS
      </div>
      <div className="z-10 my-auto text-center w-full">
        <div className="text-[10px] text-[#1a1a1a] font-serif italic select-none leading-none">by {nameVal.split(' ')[0]}</div>
      </div>
      <div className="z-10 text-right mt-auto w-full">
        <span className="text-[4px] text-[#1a1a1a] tracking-widest font-sans uppercase font-bold">{titleVal || 'NAIL STUDIO'}</span>
      </div>
    </div>
  )

  if (id === 'borcelle-blue-flower') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex text-left p-2.5" style={{ background: '#004aad' }}>
      <div className="absolute -right-3 -bottom-3 w-10 h-10 rounded-full border-2 border-white/10 opacity-30" />
      <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full border border-white/20 opacity-40" />
      
      <div className="flex-1 flex flex-col justify-center z-10">
        <div className="text-[10px] font-bold text-white font-serif leading-none truncate">{companyVal.toLowerCase()}</div>
        <div className="text-[4px] text-[#93c5fd] font-sans tracking-widest mt-1 uppercase">VISUAL STUDIO BRAND</div>
      </div>
    </div>
  )

  if (id === 'monsoon-bold') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative p-2.5 flex flex-col justify-between text-left border border-stone-100" style={{ background: '#faf8f5' }}>
      <div className="absolute bottom-2 left-2.5 right-2.5 h-[1.5px] bg-[#111111]" />
      
      <div className="z-10 my-auto text-center w-full">
        <div className="text-[12px] font-bold text-[#111111] font-serif tracking-tighter select-none leading-tight">{companyVal.toUpperCase()}</div>
        <div className="text-[4.5px] text-[#666666] tracking-widest uppercase mt-0.5 select-none">{titleVal || 'CREATIVE AGENCY'}</div>
      </div>
    </div>
  )

  if (id === 'corporate-blue') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex" style={{ background: bg }}>
      <div className="flex-1 p-3 flex flex-col justify-between z-10 text-left">
        <div>
          <div className="text-[10px] font-bold tracking-tight mb-0.5 truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[6px] tracking-wide truncate opacity-60 leading-none" style={{ color: tx }}>{titleVal}</div>
        </div>
        <div className="text-[5px] space-y-0.5 leading-none opacity-50 font-mono" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: ac, opacity: 0.9, clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border border-white/40 object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full border border-white/40 bg-white/10 flex items-center justify-center"><span className="text-[6px] text-white/50">👤</span></div>
          )}
          <div className="text-[5px] font-bold text-white tracking-widest leading-none truncate max-w-[40px] text-center uppercase">{companyVal}</div>
        </div>
      </div>
    </div>
  )

  if (id === 'corporate-black') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: ac }} />
      <div className="absolute inset-0 opacity-25" style={{ background: `linear-gradient(135deg, transparent 40%, ${ac} 40%, ${ac} 55%, transparent 55%)` }} />
      <div className="absolute inset-0 p-3 pl-4 flex flex-col justify-between text-left">
        <div>
          <div className="text-[10px] font-bold tracking-tight mb-0.5 truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[6px] tracking-wide truncate opacity-60 leading-none" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[5px] space-y-0.5 leading-none opacity-50 font-mono" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="absolute right-4 top-3 flex flex-col items-center gap-0.5">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-[6px] text-white/40">👤</span></div>
        )}
        <div className="text-[5px] font-bold tracking-widest leading-none truncate max-w-[40px] text-center uppercase" style={{ color: ac }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'green-professional') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute left-0 right-0 bottom-0" style={{ height: '42%', background: '#065f46' }} />
      <div className="absolute right-3 top-0 bottom-0 w-8 opacity-15 rounded-full" style={{ background: ac }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between text-left">
        <div>
          <div className="text-[10px] font-bold tracking-tight mb-0.5 truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[6px] tracking-wide truncate opacity-60 leading-none" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[5px] space-y-0.5 leading-none opacity-50 font-mono" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="absolute right-4 top-3 flex flex-col items-center gap-0.5">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-[6px] text-white/40">👤</span></div>
        )}
        <div className="text-[5px] font-bold tracking-widest leading-none truncate max-w-[40px] text-center uppercase" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'tech-modern') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: ac }} />
      <div className="absolute right-0 top-0 w-10 h-10 opacity-20" style={{ background: ac, clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
      <div className="absolute inset-0 pl-4 p-3 flex flex-col justify-between text-left">
        <div>
          <div className="text-[10px] font-bold tracking-tight mb-0.5 truncate leading-tight font-mono" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5px] tracking-wide truncate opacity-60 leading-none font-mono" style={{ color: ac }}>{`< ${titleVal} />`}</div>
        </div>
        <div className="text-[5px] space-y-0.5 leading-none opacity-50 font-mono" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="absolute right-4 top-3 flex flex-col items-center gap-0.5">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-[6px] text-white/40">👤</span></div>
        )}
        <div className="text-[5px] font-bold tracking-widest leading-none truncate max-w-[40px] text-center uppercase" style={{ color: ac }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'floral-creative') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full" style={{ background: ac, opacity: 0.25 }} />
      <div className="absolute -right-2 -top-2 w-10 h-10 rounded-full" style={{ background: ac, opacity: 0.2 }} />
      <div className="absolute -left-3 -bottom-3 w-12 h-12 rounded-full" style={{ background: ac, opacity: 0.15 }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between text-left">
        <div>
          <div className="text-[10px] font-bold tracking-tight mb-0.5 truncate leading-tight font-serif italic" style={{ color: '#831843' }}>{nameVal}</div>
          <div className="text-[6px] tracking-wide truncate opacity-70 leading-none font-serif italic" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[5px] space-y-0.5 leading-none opacity-50 font-mono" style={{ color: '#4b5563' }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="absolute right-4 top-3 flex flex-col items-center gap-0.5">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border bg-pink-100/10 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-[6px] text-pink-700/50">👤</span></div>
        )}
        <div className="text-[5px] font-bold tracking-widest leading-none truncate max-w-[40px] text-center uppercase font-serif italic" style={{ color: '#831843' }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'minimal-white') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="absolute right-[30%] top-4 bottom-4 w-px" style={{ background: '#e5e7eb' }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between text-left">
        <div className="mt-1">
          <div className="text-[10px] font-bold tracking-tight mb-0.5 truncate leading-tight font-serif" style={{ color: '#1e1b4b' }}>{nameVal}</div>
          <div className="text-[6px] tracking-wide truncate opacity-70 leading-none" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[5px] space-y-0.5 leading-none opacity-50 font-mono" style={{ color: '#374151' }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="absolute right-4 top-4 flex flex-col items-center gap-0.5">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border bg-indigo-50/50 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-[6px] text-indigo-700/40">👤</span></div>
        )}
        <div className="text-[5px] font-bold tracking-widest leading-none truncate max-w-[40px] text-center uppercase font-serif" style={{ color: '#1e1b4b' }}>{companyVal}</div>
      </div>
    </div>
  )

  // ── Industry horizontal thumbnails

  if (id === 'medical-health') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-sky-100 flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] font-medium tracking-wide truncate opacity-80 mt-0.5" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-65" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-white" style={{ borderColor: ac }}><span className="text-[6px] text-sky-400">💙</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'legal-professional') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute left-0 right-0 bottom-[38%] h-px" style={{ background: ac, opacity: 0.3 }} />
      <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: ac }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight uppercase tracking-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wider truncate opacity-85 mt-0.5" style={{ color: ac }}>{titleVal.toUpperCase()}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-white/5" style={{ borderColor: ac }}><span className="text-[6px]" style={{ color: ac }}>⚖️</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: ac }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'real-estate') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-stone-900/50" />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide truncate opacity-80 mt-0.5" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1 z-10">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-stone-850" style={{ borderColor: ac }}><span className="text-[6px]">🏠</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: ac }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'food-restaurant') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: ac }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold font-serif truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide font-serif italic truncate mt-0.5" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-amber-950/20" style={{ borderColor: ac }}><span className="text-[6px]">🍳</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase font-serif" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'photography') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute left-0 bottom-0 right-0 h-px bg-white/10" />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold tracking-widest truncate leading-none uppercase" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-widest truncate opacity-60 mt-1 uppercase" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-50" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center bg-stone-900" style={{ borderColor: ac }}><span className="text-[6px]">📷</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-widest truncate max-w-[50px] text-center uppercase" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'beauty-spa') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-pink-100 flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: ac }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight font-serif italic" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide truncate mt-0.5 opacity-80" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-white" style={{ borderColor: ac }}><span className="text-[6px]">🌸</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase font-serif" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'tech-startup') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${ac}18 1px, transparent 1px)`, backgroundSize: '8px 8px' }} />
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: ac }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight font-mono" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] font-mono tracking-wider truncate mt-0.5" style={{ color: ac }}>{`< ${titleVal} />`}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1 z-10">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-slate-900" style={{ borderColor: ac }}><span className="text-[6px]">⚡</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase font-mono" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'consulting-finance') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: ac }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide truncate opacity-85 mt-0.5" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-slate-800" style={{ borderColor: ac }}><span className="text-[6px]">📊</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'horizontal-red-dots') return (
    <div className="w-full h-full rounded-md overflow-hidden relative border border-gray-100 flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute top-1 left-1 flex flex-wrap w-5 gap-0.5 opacity-20">
        {[...Array(9)].map((_, i) => <div key={i} className="w-0.5 h-0.5 rounded-full" style={{ background: ac }} />)}
      </div>
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide truncate opacity-80 mt-0.5" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-white" style={{ borderColor: ac }}><span className="text-[6px] text-red-500">🔴</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'horizontal-purple-wavy') return (
    <div className="w-full h-full rounded-md overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute top-0 left-0 bottom-0 w-1/3" style={{ background: ac, borderRadius: '0 50% 50% 0' }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight" style={{ color: bg }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide truncate opacity-80 mt-0.5" style={{ color: bg }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1 z-10 pl-2">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-white" style={{ borderColor: ac }}><span className="text-[6px] text-purple-600">💜</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'horizontal-brown-triangles') return (
    <div className="w-full h-full rounded-md overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute top-0 left-0 border-l-[18px] border-b-[18px] border-transparent" style={{ borderLeftColor: ac }} />
      <div className="absolute bottom-0 left-0 border-l-[25px] border-t-[25px] border-transparent" style={{ borderLeftColor: tx }} />
      <div className="flex-1 flex flex-col justify-between z-10 pl-6">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide truncate opacity-80 mt-0.5" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-white" style={{ borderColor: ac }}><span className="text-[6px] text-amber-800">🟫</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'horizontal-luxury-gold') return (
    <div className="w-full h-full rounded-md overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute inset-0.5 border" style={{ borderColor: ac, opacity: 0.2 }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide truncate opacity-80 mt-0.5" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-stone-900" style={{ borderColor: ac }}><span className="text-[6px] text-amber-500">✨</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: ac }}>{companyVal}</div>
      </div>
    </div>
  )

  // generic horizontal fallback
  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex p-2.5 text-left" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="text-[9px] font-bold truncate leading-tight" style={{ color: tx }}>{nameVal}</div>
          <div className="text-[5.5px] tracking-wide truncate opacity-80 mt-0.5" style={{ color: ac }}>{titleVal}</div>
        </div>
        <div className="text-[4px] space-y-0.5 font-mono opacity-70" style={{ color: tx }}>
          <div>{phoneVal}</div>
          <div className="truncate">{emailVal}</div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border object-cover" style={{ borderColor: ac }} />
        ) : (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center bg-white" style={{ borderColor: ac }}><span className="text-[6px] text-slate-400">👤</span></div>
        )}
        <div className="text-[4.5px] font-bold tracking-wider truncate max-w-[50px] text-center uppercase" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )
}

// ── Vertical thumbnails (portrait 3:5 ratio) 

function VertThumbnail({ id, bg, ac, tx }) {
  const { profileDetails } = useEditorStore()
  const nameVal = profileDetails.name || 'Your Name'
  const titleVal = profileDetails.title || 'Your Title'
  const companyVal = profileDetails.company || 'Company Name'
  const avatarUrl = profileDetails.avatarSrc
  const logoUrl = profileDetails.logoSrc

  if (id === 'vertical-executive') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex flex-col justify-between p-3" style={{ background: bg }}>
      <div className="absolute top-0 right-0 w-full h-1/3 opacity-15" style={{ background: `linear-gradient(135deg, transparent 50%, ${ac} 50%)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: ac }} />
      
      <div className="z-10 flex flex-col items-center">
        <div className="text-[10px] font-bold text-center tracking-tight leading-tight" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[6px] text-center tracking-wide mt-0.5 leading-none" style={{ color: ac }}>{titleVal}</div>
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-1 my-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-xs">👤</span></div>
        )}
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="text-[7px] font-bold text-center tracking-wider truncate max-w-[80px]" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'vertical-minimal') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100 flex flex-col justify-between p-3" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      
      <div className="z-10 flex flex-col items-center">
        <div className="text-[10px] font-bold text-center tracking-tight leading-tight" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[6px] text-center tracking-wide mt-0.5 leading-none" style={{ color: ac }}>{titleVal}</div>
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-1 my-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 bg-slate-50 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-xs">👤</span></div>
        )}
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="text-[7px] font-bold text-center tracking-wider truncate max-w-[80px]" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'vertical-creative') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex flex-col justify-between p-3" style={{ background: bg }}>
      <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-20 h-20 rounded-full blur-sm" style={{ background: ac, opacity: 0.3 }} />
      <div className="absolute bottom-0 left-0 right-0 h-6" style={{ background: `linear-gradient(to top, ${ac}40, transparent)` }} />
      
      <div className="z-10 flex flex-col items-center">
        <div className="text-[10px] font-bold text-center tracking-tight leading-tight" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[6px] text-center tracking-wide mt-0.5 leading-none" style={{ color: ac }}>{titleVal}</div>
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-1 my-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-xs">👤</span></div>
        )}
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="text-[7px] font-bold text-center tracking-wider truncate max-w-[80px] font-serif" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  if (id === 'vertical-botanical') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex flex-col justify-between p-3" style={{ background: bg }}>
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full" style={{ background: ac, opacity: 0.15 }} />
      <div className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full" style={{ background: ac, opacity: 0.12 }} />
      
      <div className="z-10 flex flex-col items-center">
        <div className="text-[10px] font-bold text-center tracking-tight leading-tight font-serif italic" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[6px] text-center tracking-wide mt-0.5 leading-none font-serif italic" style={{ color: ac }}>{titleVal}</div>
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-1 my-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-xs">👤</span></div>
        )}
      </div>

      <div className="z-10 flex flex-col items-center font-serif">
        <div className="text-[7px] font-bold text-center tracking-wider truncate max-w-[80px]" style={{ color: tx }}>{companyVal}</div>
      </div>
    </div>
  )

  // generic vertical fallback
  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex flex-col justify-between p-3" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="z-10 flex flex-col items-center">
        <div className="text-[10px] font-bold text-center tracking-tight leading-tight" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[6px] text-center tracking-wide mt-0.5 leading-none" style={{ color: ac }}>{titleVal}</div>
      </div>
      <div className="z-10 flex flex-col items-center justify-center gap-1 my-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-11 h-11 rounded-full border-2 object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-11 h-11 rounded-full border-2 bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-xs">👤</span></div>
        )}
      </div>
    </div>
  )
}

// ── Square thumbnails ────────────────────────────────────────────────────────
function SquareThumbnail({ id, bg, ac, tx }) {
  const { profileDetails } = useEditorStore()
  const nameVal = profileDetails.name || 'Your Name'
  const titleVal = profileDetails.title || 'Your Title'
  const companyVal = profileDetails.company || 'Company Name'
  const avatarUrl = profileDetails.avatarSrc
  const logoUrl = profileDetails.logoSrc

  if (id === 'square-minimal') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100 flex flex-col justify-between p-4" style={{ background: bg }}>
      <div className="absolute top-4 left-4 right-4 h-1 rounded-full" style={{ background: ac }} />
      <div className="z-10 flex flex-col items-center justify-center gap-1 my-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full border-2 object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-14 h-14 rounded-full border-2 bg-slate-50 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-sm">👤</span></div>
        )}
      </div>
      <div className="z-10 flex flex-col items-center">
        <div className="text-[11px] font-bold text-center tracking-tight leading-tight" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[7px] text-center tracking-wide mt-0.5 leading-none" style={{ color: ac }}>{titleVal}</div>
      </div>
    </div>
  )

  if (id === 'square-bold') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex flex-col justify-between p-4" style={{ background: bg }}>
      <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full" style={{ background: ac, opacity: 0.2 }} />
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full" style={{ background: ac, opacity: 0.1 }} />
      
      <div className="z-10 flex flex-col items-start text-left">
        <div className="w-8 h-8 rounded-sm mb-2 border-l-4" style={{ borderColor: ac, background: `${ac}33` }} />
        <div className="text-[11px] font-bold tracking-tight leading-tight" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[7px] tracking-wide mt-0.5 leading-none uppercase" style={{ color: ac }}>{titleVal}</div>
      </div>

      <div className="z-10 flex items-center justify-between mt-auto">
        <span className="text-[8px] font-bold tracking-wider" style={{ color: tx }}>{companyVal}</span>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-10 h-10 rounded-full border bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-xs">👤</span></div>
        )}
      </div>
    </div>
  )

  if (id === 'square-creative') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex flex-col justify-between p-4" style={{ background: bg }}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${ac}22 0%, transparent 70%)` }} />
      
      <div className="z-10 flex flex-col items-center justify-center gap-1 my-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full border-2 object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-14 h-14 rounded-full border-2 bg-fuchsia-50 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-sm">👤</span></div>
        )}
      </div>

      <div className="z-10 flex flex-col items-center font-serif">
        <div className="text-[11px] font-bold text-center tracking-tight leading-tight italic" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[7px] text-center tracking-wide mt-0.5 leading-none" style={{ color: ac }}>{titleVal}</div>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex flex-col justify-between p-4" style={{ background: bg }}>
      <div className="z-10 flex flex-col items-center justify-center gap-1 my-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 object-cover animate-fade-in" style={{ borderColor: ac }} />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 bg-white/5 flex items-center justify-center" style={{ borderColor: ac }}><span className="text-xs">👤</span></div>
        )}
      </div>
      <div className="z-10 flex flex-col items-center">
        <div className="text-[10px] font-bold text-center tracking-tight leading-tight" style={{ color: tx }}>{nameVal}</div>
        <div className="text-[6px] text-center tracking-wide mt-0.5 leading-none" style={{ color: ac }}>{titleVal}</div>
      </div>
    </div>
  )
}

function TemplateThumbnail({ template }) {
  const { id, orientation, bgColor: bg, accentColor: ac, textColor: tx } = template
  if (orientation === 'vertical') {
    return <VertThumbnail id={id} bg={bg} ac={ac} tx={tx} />
  }
  if (orientation === 'square') {
    return <SquareThumbnail id={id} bg={bg} ac={ac} tx={tx} />
  }
  return <HorizThumbnail id={id} bg={bg} ac={ac} tx={tx} />
}

export default function TemplatePanel() {
  const { selectedTemplate, setSelectedTemplate, templateFilter, setTemplateFilter } = useEditorStore()
  const [search, setSearch] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('all') // 'all', 'featured', 'trending', 'new'

  const filtered = templates.filter(t => {
    // 1. Basic category filter
    if (templateFilter !== 'all' && t.category.toLowerCase() !== templateFilter) {
      if (templateFilter === 'vertical' && t.orientation !== 'vertical') return false
      if (templateFilter === 'industry' && t.category !== 'Industry') return false
    }

    // 2. Search text filter
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false

    // 3. Tab filter
    if (activeTab !== 'all') {
      if (!t.tags || !t.tags.includes(activeTab)) return false
    }

    return true
  })

  const handleSelect = (template) => {
    setSelectedTemplate(template.id)
  }

  return (
    <div className="w-80 h-full flex flex-col bg-white border-r border-slate-200 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      {/* Header */}
      <div className="p-4 pb-2 border-b border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide">Templates</h2>
          <button className="text-slate-400 hover:text-slate-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-12 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center justify-center h-4 px-1 rounded border border-slate-300 bg-white text-[8px] font-medium text-slate-400">⌘</kbd>
            <kbd className="hidden sm:inline-flex items-center justify-center h-4 px-1 rounded border border-slate-300 bg-white text-[8px] font-medium text-slate-400">K</kbd>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          <button 
            onClick={() => setActiveTab('all')}
            className={cn(
              "px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-colors",
              activeTab === 'all' 
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200" 
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
            )}
          >
            <Star size={12} className={activeTab === 'all' ? "fill-indigo-600" : ""} />
            Featured
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'trending' ? 'all' : 'trending')}
            className={cn(
              "px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-colors",
              activeTab === 'trending' 
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200" 
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            Trending
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'new' ? 'all' : 'new')}
            className={cn(
              "px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-colors",
              activeTab === 'new' 
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200" 
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
            )}
          >
            <div className={cn(
              "w-3 h-3 flex items-center justify-center rounded-full border",
              activeTab === 'new' ? "border-indigo-600" : "border-slate-400"
            )}>
              <span className="text-[8px] font-bold">+</span>
            </div>
            New
          </button>
        </div>
      </div>

      {/* Template Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {filtered.map((template, idx) => (
            <div
              key={template.id}
              onClick={() => handleSelect(template)}
              className={cn(
                'w-full text-left rounded-2xl overflow-hidden bg-white border transition-all duration-300 group cursor-pointer hover:-translate-y-1 relative',
                selectedTemplate === template.id
                  ? 'border-indigo-500 shadow-[0_8px_30px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500'
                  : 'border-slate-200 hover:border-indigo-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-slate-50'
              )}
            >
              {/* Badge */}
              {idx % 3 === 0 && (
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-md bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Featured
                </div>
              )}
              {idx === 2 && (
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  New
                </div>
              )}
              
              {/* Heart icon */}
              <button className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-500 shadow hover:text-pink-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <Heart size={14} />
              </button>

              {/* Thumbnail wrapper */}
              <div className={cn(
                'w-full overflow-hidden relative rounded-t-2xl border-b border-slate-100',
                template.orientation === 'vertical' ? 'aspect-[3/5]' : 
                template.orientation === 'square' ? 'aspect-square' : 'aspect-[1.75/1]'
              )}>
                <TemplateThumbnail template={template} />
                
                {/* Overlay hover action */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-indigo-600 text-white font-medium text-xs rounded-lg px-6 py-2 h-10 shadow-xl scale-95 group-hover:scale-100 transition-transform hover:bg-indigo-500">
                    Use Template
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-3 relative">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[13px] font-bold text-slate-800 leading-tight">{template.name}</span>
                  <span
                    className={cn(
                      'text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider',
                      categoryColors[template.category] || 'bg-slate-100 text-slate-600 border-slate-200'
                    )}
                  >
                    {template.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={10} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    {(Math.random() * (25 - 5) + 5).toFixed(1)}k
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
