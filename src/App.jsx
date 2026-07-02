import React from 'react'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/ui/AuthModal'
import useEditorStore from './store/editorStore'

export default function App() {
  const { user, skipLandingPage } = useEditorStore()

  const showEditor = !!user || skipLandingPage

  if (!showEditor) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900">
        <LandingPage />
        <AuthModal />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden relative">
        <Dashboard />
      </div>
      <Footer />
      <AuthModal />
    </div>
  )
}

