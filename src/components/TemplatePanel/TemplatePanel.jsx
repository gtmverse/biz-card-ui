import React from 'react'
import { Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useEditorStore from '@/store/editorStore'
import { templates } from '@/templates'
import { cn } from '@/lib/utils'

const categoryColors = {
  Corporate: 'bg-blue-100 text-blue-700',
  Modern: 'bg-purple-100 text-purple-700',
  Minimal: 'bg-gray-100 text-gray-600',
  Creative: 'bg-pink-100 text-pink-700',
  Vertical: 'bg-indigo-100 text-indigo-700',
  Industry: 'bg-orange-100 text-orange-700',
}

// ── Horizontal thumbnails ────────────────────────────────────────────────────

function HorizThumbnail({ id, bg, ac, tx }) {
  if (id === 'corporate-blue') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative flex" style={{ background: bg }}>
      <div className="flex-1 p-3 flex flex-col justify-between z-10">
        <div>
          <div className="w-16 h-2 rounded-full mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-full mb-2" style={{ background: tx, opacity: 0.5 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.4 }} />)}
        </div>
      </div>
      <div className="w-1/3 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: ac, opacity: 0.9, clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div className="w-7 h-7 rounded-full border" style={{ borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.15)' }} />
          <div className="w-9 h-1 rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  )

  if (id === 'corporate-black') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: ac }} />
      <div className="absolute inset-0 opacity-25" style={{ background: `linear-gradient(135deg, transparent 40%, ${ac} 40%, ${ac} 55%, transparent 55%)` }} />
      <div className="absolute inset-0 p-3 pl-4 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2.5 rounded-sm mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-sm" style={{ background: ac, opacity: 0.8 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.4 }} />)}
        </div>
      </div>
      <div className="absolute right-4 top-3">
        <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: ac, background: 'rgba(255,215,0,0.08)' }} />
      </div>
    </div>
  )

  if (id === 'green-professional') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute left-0 right-0 bottom-0" style={{ height: '42%', background: '#065f46' }} />
      <div className="absolute right-3 top-0 bottom-0 w-8 opacity-15 rounded-full" style={{ background: ac }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-full mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-full" style={{ background: ac, opacity: 0.7 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.35 }} />)}
        </div>
      </div>
      <div className="absolute right-4 top-3 w-8 h-8 rounded-full border-2" style={{ borderColor: ac, background: 'rgba(16,185,129,0.1)' }} />
    </div>
  )

  if (id === 'tech-modern') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: ac }} />
      <div className="absolute right-0 top-0 w-10 h-10 opacity-20" style={{ background: ac, clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
      <div className="absolute inset-0 pl-4 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-sm mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-16 h-1.5 rounded-sm" style={{ background: ac, opacity: 0.6 }} />
        </div>
        <div className="space-y-1">
          {[16,14,18].map((w,i) => <div key={i} className="h-1 rounded-sm" style={{ width: w*4, background: tx, opacity: 0.3 }} />)}
        </div>
      </div>
      <div className="absolute right-4 top-3 w-8 h-8 rounded-full border-2" style={{ borderColor: ac, background: 'rgba(124,58,237,0.1)' }} />
    </div>
  )

  if (id === 'floral-creative') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full" style={{ background: ac, opacity: 0.25 }} />
      <div className="absolute -right-2 -top-2 w-10 h-10 rounded-full" style={{ background: ac, opacity: 0.2 }} />
      <div className="absolute -left-3 -bottom-3 w-12 h-12 rounded-full" style={{ background: ac, opacity: 0.15 }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-full mb-1" style={{ background: '#831843', opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-full" style={{ background: ac, opacity: 0.7 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: '#4b5563', opacity: 0.5 }} />)}
        </div>
      </div>
      <div className="absolute right-4 top-3 w-8 h-8 rounded-full border-2" style={{ borderColor: ac, background: `${ac}22` }} />
    </div>
  )

  if (id === 'minimal-white') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="absolute right-[30%] top-4 bottom-4 w-px" style={{ background: '#e5e7eb' }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div className="mt-1">
          <div className="w-14 h-2 rounded-full mb-1" style={{ background: '#1e1b4b', opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-full" style={{ background: ac, opacity: 0.7 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: '#374151', opacity: 0.35 }} />)}
        </div>
      </div>
      <div className="absolute right-4 top-4 w-8 h-8 rounded-full border-2" style={{ borderColor: ac, background: '#eef2ff' }} />
    </div>
  )

  // ── Industry horizontal thumbnails ──────────────────────────────────────────

  if (id === 'medical-health') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative border border-sky-100" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="absolute right-3 top-3 w-7 h-7 flex items-center justify-center opacity-25">
        <div className="absolute w-2 h-6 rounded-full" style={{ background: ac }} />
        <div className="absolute w-6 h-2 rounded-full" style={{ background: ac }} />
      </div>
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div className="mt-1">
          <div className="w-14 h-2 rounded-full mb-1" style={{ background: tx, opacity: 0.85 }} />
          <div className="w-10 h-1.5 rounded-full" style={{ background: ac, opacity: 0.7 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.35 }} />)}
        </div>
      </div>
    </div>
  )

  if (id === 'legal-professional') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute left-0 right-0 bottom-[38%] h-px" style={{ background: ac, opacity: 0.6 }} />
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: ac }} />
      <div className="absolute inset-0 p-3 pl-4 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-sm mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-20 h-1.5 rounded-sm" style={{ background: ac, opacity: 0.8 }} />
        </div>
        <div className="space-y-1">
          {[12,14,10].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.4 }} />)}
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: ac }}>
          <div className="w-3 h-3 rounded-full" style={{ background: ac, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  )

  if (id === 'real-estate') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute right-0 top-0 bottom-0" style={{ width: '35%', background: `linear-gradient(to left, ${ac}33, transparent)` }} />
      <div className="absolute right-4 top-3">
        <div className="w-0 h-0" style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: `8px solid ${ac}`, opacity: 0.7 }} />
        <div className="w-7 h-5 mx-auto" style={{ background: ac, opacity: 0.5 }} />
      </div>
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-16 h-2 rounded-sm mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-sm" style={{ background: ac, opacity: 0.8 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.35 }} />)}
        </div>
      </div>
    </div>
  )

  if (id === 'food-restaurant') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full" style={{ background: ac, opacity: 0.15 }} />
      <div className="absolute right-4 top-3 w-7 h-9 rounded-full opacity-30" style={{ background: ac, clipPath: 'ellipse(50% 50% at 50% 70%)' }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-sm mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-sm" style={{ background: ac, opacity: 0.8 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.35 }} />)}
        </div>
      </div>
    </div>
  )

  if (id === 'photography') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center" style={{ borderColor: ac, opacity: 0.7 }}>
          <div className="w-4 h-4 rounded-full border" style={{ borderColor: ac, opacity: 0.5 }} />
          <div className="absolute w-2 h-2 rounded-full" style={{ background: ac, opacity: 0.4 }} />
        </div>
      </div>
      <div className="absolute left-0 bottom-0 right-0 h-px" style={{ background: ac, opacity: 0.3 }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-sm mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-12 h-1.5 rounded-sm" style={{ background: tx, opacity: 0.4 }} />
        </div>
        <div className="space-y-1">
          {[14,10,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.3 }} />)}
        </div>
      </div>
    </div>
  )

  if (id === 'beauty-spa') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative border border-pink-100" style={{ background: bg }}>
      <div className="absolute -right-2 -top-2 w-12 h-12 rounded-full" style={{ background: ac, opacity: 0.12 }} />
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full" style={{ background: ac, opacity: 0.07 }} />
      <div className="absolute -left-2 -bottom-2 w-10 h-10 rounded-full" style={{ background: ac, opacity: 0.1 }} />
      <div className="absolute top-0 right-0 left-0 h-0.5" style={{ background: ac, opacity: 0.4 }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-full mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-10 h-1.5 rounded-full" style={{ background: ac, opacity: 0.7 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.35 }} />)}
        </div>
      </div>
    </div>
  )

  if (id === 'tech-startup') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      {/* Grid dots */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle, ${ac}33 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: ac, opacity: 0.6 }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-sm mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-12 h-1.5 rounded-sm" style={{ background: ac, opacity: 0.8 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-sm" style={{ width: w*4, background: tx, opacity: 0.3 }} />)}
        </div>
      </div>
      <div className="absolute right-4 top-3 w-7 h-7 rounded-full border" style={{ borderColor: ac, opacity: 0.5 }} />
    </div>
  )

  if (id === 'consulting-finance') return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      {/* Bar chart silhouette */}
      <div className="absolute right-3 bottom-3 flex items-end gap-0.5" style={{ opacity: 0.4 }}>
        {[10,16,8,14,20].map((h,i) => (
          <div key={i} className="w-1.5 rounded-sm" style={{ height: h, background: ac }} />
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: ac }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-sm mb-1" style={{ background: tx, opacity: 0.9 }} />
          <div className="w-12 h-1.5 rounded-sm" style={{ background: ac, opacity: 0.8 }} />
        </div>
        <div className="space-y-1 mr-12">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.35 }} />)}
        </div>
      </div>
    </div>
  )

  // generic horizontal fallback
  return (
    <div className="w-full aspect-[1.75/1] rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div>
          <div className="w-14 h-2 rounded-full mb-1" style={{ background: tx, opacity: 0.85 }} />
          <div className="w-10 h-1.5 rounded-full" style={{ background: ac, opacity: 0.7 }} />
        </div>
        <div className="space-y-1">
          {[14,12,16].map((w,i) => <div key={i} className="h-1 rounded-full" style={{ width: w*4, background: tx, opacity: 0.35 }} />)}
        </div>
      </div>
    </div>
  )
}

// ── Vertical thumbnails (portrait 3:5 ratio) ─────────────────────────────────

function VertThumbnail({ id, bg, ac, tx }) {
  if (id === 'vertical-executive') return (
    <div className="w-full rounded-lg overflow-hidden relative" style={{ background: bg, aspectRatio: '3/5' }}>
      {/* Gold diagonal slash top-right */}
      <div className="absolute top-0 right-0 w-full h-1/3 opacity-15" style={{ background: `linear-gradient(135deg, transparent 50%, ${ac} 50%)` }} />
      {/* Center circle */}
      <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: ac }}>
          <div className="w-5 h-5 rounded-full" style={{ background: ac, opacity: 0.3 }} />
        </div>
      </div>
      {/* Bottom gold strip */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: ac }} />
      {/* Text lines */}
      <div className="absolute bottom-6 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-sm mx-auto" style={{ width: '65%', background: tx, opacity: 0.9 }} />
        <div className="h-1.5 rounded-sm mx-auto" style={{ width: '45%', background: ac, opacity: 0.8 }} />
        <div className="h-1 rounded-full mx-auto" style={{ width: '55%', background: tx, opacity: 0.3 }} />
      </div>
    </div>
  )

  if (id === 'vertical-minimal') return (
    <div className="w-full rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg, aspectRatio: '3/5' }}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      {/* Center circle logo */}
      <div className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac, background: `${ac}15` }} />
      </div>
      {/* Vertical divider */}
      <div className="absolute left-1/2 top-[45%] bottom-12 w-px" style={{ background: '#e5e7eb' }} />
      {/* Text lines */}
      <div className="absolute bottom-6 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-full mx-auto" style={{ width: '60%', background: tx, opacity: 0.85 }} />
        <div className="h-1.5 rounded-full mx-auto" style={{ width: '40%', background: ac, opacity: 0.7 }} />
        <div className="h-1 rounded-full mx-auto" style={{ width: '50%', background: tx, opacity: 0.3 }} />
      </div>
    </div>
  )

  if (id === 'vertical-creative') return (
    <div className="w-full rounded-lg overflow-hidden relative" style={{ background: bg, aspectRatio: '3/5' }}>
      {/* Glow blob top */}
      <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-20 h-20 rounded-full blur-sm" style={{ background: ac, opacity: 0.3 }} />
      {/* Circle logo */}
      <div className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac, background: `${ac}20` }}>
          <div className="absolute inset-1 rounded-full" style={{ background: ac, opacity: 0.2 }} />
        </div>
      </div>
      {/* Bottom glow accent */}
      <div className="absolute bottom-0 left-0 right-0 h-6" style={{ background: `linear-gradient(to top, ${ac}40, transparent)` }} />
      {/* Text lines */}
      <div className="absolute bottom-8 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-sm mx-auto" style={{ width: '62%', background: tx, opacity: 0.9 }} />
        <div className="h-1.5 rounded-sm mx-auto" style={{ width: '40%', background: ac, opacity: 0.8 }} />
        <div className="h-1 rounded-full mx-auto" style={{ width: '50%', background: tx, opacity: 0.3 }} />
      </div>
    </div>
  )

  if (id === 'vertical-botanical') return (
    <div className="w-full rounded-lg overflow-hidden relative" style={{ background: bg, aspectRatio: '3/5' }}>
      {/* Leaf circles */}
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full" style={{ background: ac, opacity: 0.15 }} />
      <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full" style={{ background: ac, opacity: 0.2 }} />
      <div className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full" style={{ background: ac, opacity: 0.12 }} />
      {/* Center circle */}
      <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac, background: `${ac}15` }} />
      </div>
      {/* Text lines */}
      <div className="absolute bottom-6 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-full mx-auto" style={{ width: '60%', background: tx, opacity: 0.9 }} />
        <div className="h-1.5 rounded-full mx-auto" style={{ width: '42%', background: ac, opacity: 0.8 }} />
        <div className="h-1 rounded-full mx-auto" style={{ width: '52%', background: tx, opacity: 0.3 }} />
      </div>
    </div>
  )

  // generic vertical fallback
  return (
    <div className="w-full rounded-lg overflow-hidden relative" style={{ background: bg, aspectRatio: '3/5' }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac }} />
      </div>
      <div className="absolute bottom-6 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-full mx-auto" style={{ width: '60%', background: tx, opacity: 0.85 }} />
        <div className="h-1.5 rounded-full mx-auto" style={{ width: '40%', background: ac, opacity: 0.7 }} />
      </div>
    </div>
  )
}

function TemplateThumbnail({ template }) {
  const { id, orientation, bgColor: bg, accentColor: ac, textColor: tx } = template
  if (orientation === 'vertical') {
    return <VertThumbnail id={id} bg={bg} ac={ac} tx={tx} />
  }
  return <HorizThumbnail id={id} bg={bg} ac={ac} tx={tx} />
}

export default function TemplatePanel() {
  const { selectedTemplate, setSelectedTemplate, templateFilter, setTemplateFilter } = useEditorStore()
  const [search, setSearch] = React.useState('')

  const filtered = templates.filter((t) => {
    const matchFilter = templateFilter === 'all' || t.category.toLowerCase() === templateFilter
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleSelect = (template) => {
    setSelectedTemplate(template.id)
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100" style={{ width: 300, minWidth: 300 }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Templates</h2>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <Input
            placeholder="Search templates..."
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={templateFilter} onValueChange={setTemplateFilter}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="vertical">Vertical Cards</SelectItem>
            <SelectItem value="industry">Industry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Template Grid */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {filtered.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className={cn(
                'w-full text-left rounded-xl overflow-hidden border-2 transition-all duration-200 hover:shadow-md group',
                selectedTemplate === template.id
                  ? 'border-indigo-500 shadow-md shadow-indigo-100'
                  : 'border-transparent hover:border-indigo-200'
              )}
            >
              <TemplateThumbnail template={template} />
              <div className="p-2.5 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-800">{template.name}</span>
                  <span
                    className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                      categoryColors[template.category] || 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {template.category}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
