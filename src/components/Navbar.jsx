import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, LogOut, CheckCircle2, Pencil, Check, Undo2, Redo2, Eye, ChevronDown, Crown, FileDown, Archive, FileImage } from 'lucide-react'
import useEditorStore from '@/store/editorStore'
import { downloadCanvas } from '@/utils/downloadHelpers'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { 
    user, 
    logout, 
    setAuthModalOpen, 
    setPreviewMode, 
    canvas,
    undo,
    redo,
    history,
    historyIndex
  } = useEditorStore()
  const [docName, setDocName] = useState('Untitled Design')
  const [editing, setEditing] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const inputRef = useRef(null)
  
  const exportRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const startEdit = () => {
    setEditing(true)
    setTimeout(() => { inputRef.current?.select() }, 10)
  }
  const commitEdit = () => setEditing(false)

  const handleExport = (format) => {
    setExportOpen(false)
    if (canvas) downloadCanvas(canvas, format)
  }

  return (
    <nav
      className="shrink-0 flex items-center justify-between px-4 select-none bg-white border-b border-slate-200"
      style={{
        height: 48,
        minHeight: 48,
      }}
    >
      {/* ── LEFT: Brand + document name ──────────────────── */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Logo mark */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}
          >
            B
          </div>
          <div className="flex flex-col leading-none shrink-0">
            <span className="font-bold text-sm tracking-wide text-slate-800">BIZCARD</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Studio</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-2 shrink-0" />

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />

        {/* Document name */}
        <div className="flex items-center gap-1.5 group min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={docName}
              onChange={e => setDocName(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') commitEdit() }}
              className="text-xs font-medium text-slate-800 bg-slate-100 border border-indigo-500/60 rounded px-1.5 py-0.5 outline-none w-36"
              style={{ caretColor: '#6366f1' }}
            />
          ) : (
            <span className="text-xs font-medium text-slate-600 truncate max-w-[140px]">{docName}</span>
          )}
          <button
            onClick={editing ? commitEdit : startEdit}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-slate-300 shrink-0"
          >
            {editing ? <Check size={11} /> : <Pencil size={11} />}
          </button>
        </div>

        {/* Auto-saved pill */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 ml-4">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">All changes saved</span>
            <span className="text-[10px] text-slate-500 leading-tight">Just now</span>
          </div>
        </div>
      </div>

      {/* ── CENTER: Undo / Redo ─────────────────────────────── */}
      <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <button 
          onClick={undo}
          disabled={historyIndex <= 0}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
            historyIndex > 0 
              ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100" 
              : "text-slate-400 opacity-50 cursor-not-allowed"
          )}
        >
          <Undo2 size={16} />
        </button>
        <button 
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
            historyIndex < history.length - 1
              ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              : "text-slate-400 opacity-50 cursor-not-allowed"
          )}
        >
          <Redo2 size={16} />
        </button>
      </div>

      {/* ── RIGHT: Auth & Actions ───────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={() => setPreviewMode(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-[13px] font-medium"
        >
          <Eye size={14} />
          Preview
        </button>
        
        <div className="relative" ref={exportRef}>
          <button 
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-[13px] font-medium shadow-sm shadow-indigo-500/20"
          >
            <LogOut size={14} className="rotate-[-90deg]" />
            Export
            <ChevronDown size={14} className="ml-1 opacity-70" />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 py-1 animate-fade-in">
              <button onClick={() => handleExport('png')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                <FileImage size={16} className="text-slate-400" /> PNG (Current Side)
              </button>
              <button onClick={() => handleExport('zip')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                <Archive size={16} className="text-indigo-500" /> PNG (Front & Back)
              </button>
              <button onClick={() => handleExport('pdf')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                <FileDown size={16} className="text-red-400" /> PDF Document
              </button>
              <button onClick={() => handleExport('svg')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                <FileImage size={16} className="text-amber-500" /> SVG Vector
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

        {user ? (
          <>
            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">
              <Crown size={14} />
              <span className="text-[12px] font-bold uppercase tracking-wide">Premium</span>
            </div>
            
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm bg-indigo-500 ml-2 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 py-1 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => { setProfileOpen(false); logout(); }} 
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 px-2"
            >
              Log in
            </button>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-1.5 text-[13px] font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
