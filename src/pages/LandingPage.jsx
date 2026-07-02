import React, { useMemo, useState } from 'react'
import { Sparkles, Search, ChevronDown } from 'lucide-react'
import useEditorStore from '@/store/editorStore'
import { templates } from '@/templates'

const categoryLabelMap = {
  all: 'All Templates',
  corporate: 'Corporate',
  modern: 'Modern',
  minimal: 'Minimal',
  creative: 'Creative',
  vertical: 'Vertical Cards',
  industry: 'Industry',
}

const orientationOptions = [
  { id: 'horizontal', label: 'Horizontal' },
  { id: 'vertical', label: 'Vertical' },
  { id: 'square', label: 'Square' },
]

// ── Horizontal thumbnails ────────────────────────────────────────────────────
function HorizThumbnail({ id, bg, ac, tx }) {
  if (id === 'corporate-blue') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative flex" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg }}>
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

  // ── Industry horizontal thumbnails
  if (id === 'medical-health') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-sky-100" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-pink-100" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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

  if (id === 'horizontal-red-dots') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg }}>
      <div className="absolute top-2 left-2 flex flex-wrap w-8 gap-1 opacity-20">
        {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: ac }} />)}
      </div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border-4 opacity-10" style={{ borderColor: ac }} />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 relative" style={{ borderColor: ac }}>
          <div className="absolute inset-2 rounded-full opacity-10" style={{ background: ac }} />
        </div>
      </div>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-1.5 w-1/3">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: ac }} />
        <div className="h-0.5 rounded-full w-full mt-3" style={{ background: ac }} />
      </div>
    </div>
  )

  if (id === 'horizontal-purple-wavy') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 left-0 bottom-0 w-1/3" style={{ background: ac, borderRadius: '0 50% 50% 0' }} />
      <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-1.5 w-1/4">
        <div className="h-2 rounded-full w-full" style={{ background: tx, opacity: 0.9 }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: bg, opacity: 0.7 }} />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-2 mb-2" style={{ borderColor: ac }} />
        <div className="h-1.5 rounded-full w-12" style={{ background: tx }} />
      </div>
    </div>
  )

  if (id === 'horizontal-brown-triangles') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 left-0 border-l-[40px] border-b-[40px] border-transparent" style={{ borderLeftColor: ac }} />
      <div className="absolute bottom-0 left-0 border-l-[60px] border-t-[60px] border-transparent" style={{ borderLeftColor: tx }} />
      <div className="absolute bottom-2 left-2 flex gap-1">
        <div className="w-0 h-0 border-l-[5px] border-b-[5px] border-r-[5px] border-transparent" style={{ borderBottomColor: ac }} />
        <div className="w-0 h-0 border-l-[5px] border-b-[5px] border-r-[5px] border-transparent" style={{ borderBottomColor: tx }} />
      </div>
      <div className="absolute left-16 top-1/2 -translate-y-1/2 space-y-1.5 w-1/4">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: ac }} />
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-2 mb-2" style={{ borderColor: ac }} />
        <div className="h-1.5 rounded-full w-12" style={{ background: tx }} />
      </div>
    </div>
  )

  if (id === 'horizontal-luxury-gold') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute inset-1 border" style={{ borderColor: ac, opacity: 0.3 }} />
      <div className="absolute inset-2 border" style={{ borderColor: ac, opacity: 0.1 }} />
      <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-1.5 w-1/3">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: ac }} />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-12 h-12 rounded-sm border mb-2 flex items-center justify-center rotate-45" style={{ borderColor: ac }}>
          <div className="w-8 h-8 border opacity-50" style={{ borderColor: ac }} />
        </div>
        <div className="h-1.5 rounded-full w-12 mt-2" style={{ background: ac }} />
      </div>
    </div>
  )

  // generic horizontal fallback
  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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

// ── Vertical thumbnails ────────────────────────────────────────────────────
function VertThumbnail({ id, bg, ac, tx }) {
  if (id === 'vertical-executive') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 right-0 w-full h-1/3 opacity-15" style={{ background: `linear-gradient(135deg, transparent 50%, ${ac} 50%)` }} />
      <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: ac }}>
          <div className="w-5 h-5 rounded-full" style={{ background: ac, opacity: 0.3 }} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: ac }} />
      <div className="absolute bottom-6 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-sm mx-auto" style={{ width: '65%', background: tx, opacity: 0.9 }} />
        <div className="h-1.5 rounded-sm mx-auto" style={{ width: '45%', background: ac, opacity: 0.8 }} />
        <div className="h-1 rounded-full mx-auto" style={{ width: '55%', background: tx, opacity: 0.3 }} />
      </div>
    </div>
  )

  if (id === 'vertical-minimal') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac, background: `${ac}15` }} />
      </div>
      <div className="absolute left-1/2 top-[45%] bottom-12 w-px" style={{ background: '#e5e7eb' }} />
      <div className="absolute bottom-6 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-full mx-auto" style={{ width: '60%', background: tx, opacity: 0.85 }} />
        <div className="h-1.5 rounded-full mx-auto" style={{ width: '40%', background: ac, opacity: 0.7 }} />
        <div className="h-1 rounded-full mx-auto" style={{ width: '50%', background: tx, opacity: 0.3 }} />
      </div>
    </div>
  )

  if (id === 'vertical-creative') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-20 h-20 rounded-full blur-sm" style={{ background: ac, opacity: 0.3 }} />
      <div className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac, background: `${ac}20` }}>
          <div className="absolute inset-1 rounded-full" style={{ background: ac, opacity: 0.2 }} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-6" style={{ background: `linear-gradient(to top, ${ac}40, transparent)` }} />
      <div className="absolute bottom-8 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-sm mx-auto" style={{ width: '62%', background: tx, opacity: 0.9 }} />
        <div className="h-1.5 rounded-sm mx-auto" style={{ width: '40%', background: ac, opacity: 0.8 }} />
        <div className="h-1 rounded-full mx-auto" style={{ width: '50%', background: tx, opacity: 0.3 }} />
      </div>
    </div>
  )

  if (id === 'vertical-botanical') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full" style={{ background: ac, opacity: 0.15 }} />
      <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full" style={{ background: ac, opacity: 0.2 }} />
      <div className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full" style={{ background: ac, opacity: 0.12 }} />
      <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac, background: `${ac}15` }} />
      </div>
      <div className="absolute bottom-6 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-full mx-auto" style={{ width: '60%', background: tx, opacity: 0.9 }} />
        <div className="h-1.5 rounded-full mx-auto" style={{ width: '42%', background: ac, opacity: 0.8 }} />
        <div className="h-1 rounded-full mx-auto" style={{ width: '52%', background: tx, opacity: 0.3 }} />
      </div>
    </div>
  )

  if (id === 'vertical-teal-corners') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 right-0 w-1/2 h-1/3" style={{ background: ac, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
      <div className="absolute bottom-0 left-0 w-2/3 h-1/4" style={{ background: tx, clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }} />
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2" style={{ borderColor: ac }} />
      <div className="absolute top-24 left-4 right-4 space-y-1.5">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: ac }} />
      </div>
    </div>
  )

  if (id === 'vertical-navy-triangle') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: ac, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2" style={{ borderColor: ac }} />
      <div className="absolute top-20 left-4 right-4 space-y-1.5">
        <div className="h-2 rounded-full mx-auto w-3/4" style={{ background: tx }} />
        <div className="h-1.5 rounded-full mx-auto w-1/2" style={{ background: tx, opacity: 0.7 }} />
      </div>
      <div className="absolute bottom-4 left-4 right-4 space-y-1">
        <div className="h-1 rounded-full mx-auto w-1/2" style={{ background: bg }} />
        <div className="h-1 rounded-full mx-auto w-1/3" style={{ background: bg }} />
      </div>
    </div>
  )

  if (id === 'vertical-teal-solid') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 right-0 bottom-0 w-4" style={{ background: '#0f766e' }} />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-14 h-14 border-4 flex items-center justify-center" style={{ borderColor: ac }}>
        <div className="w-8 h-8 font-serif font-bold flex items-center justify-center text-xl" style={{ color: ac }}>T</div>
      </div>
      <div className="absolute bottom-16 left-4 right-4 space-y-1.5 text-center">
        <div className="h-2.5 rounded-full mx-auto w-3/4" style={{ background: tx }} />
        <div className="h-1.5 rounded-full mx-auto w-1/2" style={{ background: ac, opacity: 0.8 }} />
      </div>
    </div>
  )

  if (id === 'vertical-navy-yellow') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute bottom-0 left-0 right-0 h-1/4" style={{ background: ac }} />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12">
        <div className="w-10 h-6 border-2 rounded-t-full border-b-0" style={{ borderColor: ac }} />
        <div className="absolute bottom-0 w-12 h-2" style={{ background: ac }} />
      </div>
      <div className="absolute top-28 left-4 right-4 space-y-1.5">
        <div className="h-2 rounded-full mx-auto w-3/4" style={{ background: tx }} />
        <div className="h-1.5 rounded-full mx-auto w-1/2" style={{ background: ac }} />
      </div>
    </div>
  )

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
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

// ── Square thumbnails ────────────────────────────────────────────────────────
function SquareThumbnail({ id, bg, ac, tx }) {
  if (id === 'square-minimal') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg }}>
      <div className="absolute top-4 left-4 right-4 h-1 rounded-full" style={{ background: ac }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <div className="w-12 h-12 rounded-full border-2 mb-4" style={{ borderColor: ac, background: `${ac}15` }} />
        <div className="w-20 h-2.5 rounded-full mb-2" style={{ background: tx, opacity: 0.9 }} />
        <div className="w-12 h-1.5 rounded-full" style={{ background: ac, opacity: 0.7 }} />
      </div>
    </div>
  )

  if (id === 'square-bold') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full" style={{ background: ac, opacity: 0.2 }} />
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full" style={{ background: ac, opacity: 0.1 }} />
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <div className="w-10 h-10 rounded-sm mb-auto border-l-4" style={{ borderColor: ac, background: `${ac}33` }} />
        <div className="w-24 h-2.5 rounded-sm mb-2" style={{ background: tx, opacity: 0.9 }} />
        <div className="w-16 h-1.5 rounded-sm mb-4" style={{ background: ac, opacity: 0.8 }} />
        <div className="space-y-1.5">
          {[20, 16, 24].map((w, i) => <div key={i} className="h-1 rounded-sm" style={{ width: w * 4, background: tx, opacity: 0.4 }} />)}
        </div>
      </div>
    </div>
  )

  if (id === 'square-creative') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${ac}22 0%, transparent 70%)` }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl border-2 mb-5 transform rotate-12" style={{ borderColor: ac, background: `${ac}20` }} />
        <div className="w-20 h-2 rounded-full mb-2" style={{ background: tx, opacity: 0.9 }} />
        <div className="w-14 h-1.5 rounded-full" style={{ background: ac, opacity: 0.8 }} />
      </div>
    </div>
  )

  if (id === 'square-red-sidebar') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 bottom-0 right-0 w-8" style={{ background: ac }} />
      <div className="absolute top-6 left-4 flex items-center">
        <div className="w-6 h-6 border rounded-sm" style={{ borderColor: ac }} />
        <div className="ml-2 h-1.5 w-10 rounded-sm" style={{ background: tx }} />
      </div>
      <div className="absolute bottom-6 left-4 space-y-1 w-1/2">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: tx, opacity: 0.7 }} />
      </div>
    </div>
  )

  if (id === 'square-red-diagonal') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 right-0 w-1/2 h-1/2" style={{ background: ac, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
      <div className="absolute top-6 left-6 w-8 h-8 rounded-full border-2" style={{ borderColor: tx }} />
      <div className="absolute bottom-6 left-6 space-y-1.5 w-1/2">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: tx, opacity: 0.8 }} />
      </div>
    </div>
  )

  if (id === 'square-teal-minimal') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg }}>
      <div className="absolute bottom-0 left-0 right-0 h-1/4" style={{ background: ac }} />
      <div className="absolute top-6 right-6 w-8 h-8 border-2" style={{ borderColor: ac }} />
      <div className="absolute top-6 left-6 space-y-1 w-1/3">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: tx, opacity: 0.7 }} />
      </div>
    </div>
  )

  if (id === 'square-green-elegant') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute inset-2 border" style={{ borderColor: ac, opacity: 0.5 }} />
      <div className="absolute top-2 left-2 w-2 h-2" style={{ background: ac }} />
      <div className="absolute top-2 right-2 w-2 h-2" style={{ background: ac }} />
      <div className="absolute bottom-2 left-2 w-2 h-2" style={{ background: ac }} />
      <div className="absolute bottom-2 right-2 w-2 h-2" style={{ background: ac }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-2/3 space-y-2">
        <div className="h-2.5 rounded-full w-full" style={{ background: ac }} />
        <div className="h-1.5 rounded-full w-1/2" style={{ background: tx, opacity: 0.8 }} />
      </div>
    </div>
  )

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute inset-0 p-4 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 mb-4" style={{ borderColor: ac }} />
        <div className="w-20 h-2 rounded-full mb-2" style={{ background: tx, opacity: 0.85 }} />
        <div className="w-12 h-1.5 rounded-full" style={{ background: ac, opacity: 0.7 }} />
      </div>
    </div>
  )
}

function TemplateThumbnail({ template }) {
  if (template.orientation === 'vertical') {
    return <VertThumbnail id={template.id} bg={template.bgColor} ac={template.accentColor} tx={template.textColor} />
  }
  if (template.orientation === 'square') {
    return <SquareThumbnail id={template.id} bg={template.bgColor} ac={template.accentColor} tx={template.textColor} />
  }
  return <HorizThumbnail id={template.id} bg={template.bgColor} ac={template.accentColor} tx={template.textColor} />
}

export default function LandingPage() {
  const { user, setAuthModalOpen, setSelectedTemplate, setSkipLandingPage } = useEditorStore()
  
  const [selectedOrientation, setSelectedOrientation] = useState('horizontal')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(templates.map((template) => template.category.toLowerCase())))
    return ['all', ...categories]
  }, [])

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchOrientation = template.orientation === selectedOrientation;
      const matchCategory = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory;
      const matchSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchOrientation && matchCategory && matchSearch;
    })
  }, [selectedOrientation, selectedCategory, searchQuery])

  const handleCardClick = (templateId) => {
    setSelectedTemplate(templateId)
    if (!user) {
      setAuthModalOpen(true)
    } else {
      setSkipLandingPage(true)
    }
  }

  const resultCount = filteredTemplates.length

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50/50">
      {/* Topbar */}
      <header className="flex-none h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xs font-extrabold text-white shadow-md shadow-indigo-100">
            BC
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-gray-900 leading-tight">BizCard</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md shadow-sm"
          >
            <Sparkles size={16} />
            Sign In to Edit
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col z-10 overflow-y-auto">
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Find Template</h3>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Card Format</h3>
              <div className="grid grid-cols-3 gap-2">
                {orientationOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOrientation(option.id)}
                    className={`h-11 rounded-lg text-sm font-semibold transition-all flex items-center justify-center border ${
                      selectedOrientation === option.id
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Industry / Category</h3>
              <div className="space-y-1.5">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white font-semibold shadow-md'
                        : 'bg-transparent text-gray-600 hover:bg-gray-100 font-medium'
                    }`}
                  >
                    <span>{categoryLabelMap[category] || category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Template Gallery</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Showing {resultCount} {selectedOrientation} template{resultCount !== 1 ? 's' : ''} in {categoryLabelMap[selectedCategory] || selectedCategory}.
                </p>
              </div>
            </div>

            {resultCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <div 
                    key={template.id} 
                    onClick={() => handleCardClick(template.id)}
                    className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-center">
                      <div className={
                        template.orientation === 'vertical' ? 'w-full max-w-[200px]' : 
                        template.orientation === 'square' ? 'w-full max-w-[220px]' : 'w-full'
                      }>
                        <div className={
                          template.orientation === 'vertical' ? 'aspect-[3/5] relative rounded-lg overflow-hidden shadow-sm' : 
                          template.orientation === 'square' ? 'aspect-square relative rounded-lg overflow-hidden shadow-sm' : 
                          'aspect-[1.75/1] relative rounded-lg overflow-hidden shadow-sm'
                        }>
                          <TemplateThumbnail template={template} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
                            {categoryLabelMap[template.category.toLowerCase()] || template.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{template.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{template.description}</p>
                      </div>
                      
                      <div className="mt-5">
                        <span className="inline-flex items-center justify-center w-full py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          Use Template
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No templates found</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  We couldn't find any templates matching your current filters. Try adjusting your search or category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedOrientation('horizontal')
                  }}
                  className="mt-6 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
