import React from 'react'
import { Sparkles, Terminal } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 px-6 py-2.5 flex items-center justify-between text-[11px] shrink-0 select-none">
      <div className="flex items-center gap-1.5 font-medium">
        <span>&copy; {new Date().getFullYear()} BizCard Studio. All rights reserved.</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Terminal size={12} className="text-slate-500" />
          <span className="font-mono text-slate-500">v1.2.0-stable</span>
        </div>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-white transition-colors">Documentation</a>
      </div>
    </footer>
  )
}
