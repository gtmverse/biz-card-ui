export const templates = [
  // ─── Existing horizontal ─────────────────────────────────────────────────
  {
    id: 'corporate-blue', name: 'Corporate Blue', category: 'Corporate',
    orientation: 'horizontal',
    bgColor: '#1e3a5f', accentColor: '#4F46E5', textColor: '#ffffff',
    description: 'Professional corporate template with navy blue background',
  },
  {
    id: 'corporate-black', name: 'Corporate Black', category: 'Corporate',
    orientation: 'horizontal',
    bgColor: '#111111', accentColor: '#FFD700', textColor: '#ffffff',
    description: 'Premium black corporate design with gold accents',
  },
  {
    id: 'green-professional', name: 'Green Professional', category: 'Corporate',
    orientation: 'horizontal',
    bgColor: '#064e3b', accentColor: '#10b981', textColor: '#ffffff',
    description: 'Nature-inspired professional green design',
  },
  {
    id: 'tech-modern', name: 'Tech Modern', category: 'Modern',
    orientation: 'horizontal',
    bgColor: '#0f172a', accentColor: '#7c3aed', textColor: '#ffffff',
    description: 'Sleek dark tech-inspired modern design',
  },
  {
    id: 'floral-creative', name: 'Floral Creative', category: 'Creative',
    orientation: 'horizontal',
    bgColor: '#fdf2f8', accentColor: '#ec4899', textColor: '#1f2937',
    description: 'Elegant floral creative design with pink accents',
  },
  {
    id: 'minimal-white', name: 'Minimal White', category: 'Minimal',
    orientation: 'horizontal',
    bgColor: '#ffffff', accentColor: '#4F46E5', textColor: '#1f2937',
    description: 'Clean minimalist white design with subtle accents',
  },

  // ─── Vertical cards ──────────────────────────────────────────────────────
  {
    id: 'vertical-executive', name: 'Executive Dark', category: 'Vertical',
    orientation: 'vertical',
    bgColor: '#0f172a', accentColor: '#d4a017', textColor: '#ffffff',
    description: 'Premium vertical executive card with gold accents',
  },
  {
    id: 'vertical-minimal', name: 'Minimal Vertical', category: 'Vertical',
    orientation: 'vertical',
    bgColor: '#ffffff', accentColor: '#6366f1', textColor: '#1e1b4b',
    description: 'Clean minimal portrait card with indigo accent',
  },
  {
    id: 'vertical-creative', name: 'Creative Dark', category: 'Vertical',
    orientation: 'vertical',
    bgColor: '#120524', accentColor: '#a855f7', textColor: '#ffffff',
    description: 'Bold creative vertical card with violet glow',
  },
  {
    id: 'vertical-botanical', name: 'Botanical', category: 'Vertical',
    orientation: 'vertical',
    bgColor: '#052e16', accentColor: '#4ade80', textColor: '#ffffff',
    description: 'Nature-inspired vertical card in deep emerald',
  },

  // ─── Industry-specific horizontal ────────────────────────────────────────
  {
    id: 'medical-health', name: 'Medical / Health', category: 'Industry',
    orientation: 'horizontal',
    bgColor: '#f0f9ff', accentColor: '#0ea5e9', textColor: '#0c4a6e',
    description: 'Clean clinical card for healthcare professionals',
  },
  {
    id: 'legal-professional', name: 'Legal Professional', category: 'Industry',
    orientation: 'horizontal',
    bgColor: '#0c1a2e', accentColor: '#c9a227', textColor: '#ffffff',
    description: 'Premium dark card for attorneys & law firms',
  },
  {
    id: 'real-estate', name: 'Real Estate', category: 'Industry',
    orientation: 'horizontal',
    bgColor: '#1c1917', accentColor: '#d97706', textColor: '#ffffff',
    description: 'Luxury card for real estate professionals',
  },
  {
    id: 'food-restaurant', name: 'Food & Restaurant', category: 'Industry',
    orientation: 'horizontal',
    bgColor: '#2d0f07', accentColor: '#f97316', textColor: '#ffffff',
    description: 'Warm elegant card for chefs & restaurants',
  },
  {
    id: 'photography', name: 'Photography', category: 'Industry',
    orientation: 'horizontal',
    bgColor: '#0a0a0a', accentColor: '#e2e8f0', textColor: '#ffffff',
    description: 'Cinematic dark card for photographers',
  },
  {
    id: 'beauty-spa', name: 'Beauty & Spa', category: 'Industry',
    orientation: 'horizontal',
    bgColor: '#fff0f3', accentColor: '#e11d48', textColor: '#4a0518',
    description: 'Elegant card for salons & beauty studios',
  },
  {
    id: 'tech-startup', name: 'Tech Startup', category: 'Industry',
    orientation: 'horizontal',
    bgColor: '#020617', accentColor: '#22c55e', textColor: '#ffffff',
    description: 'Electric card for founders & engineers',
  },
  {
    id: 'consulting-finance', name: 'Consulting & Finance', category: 'Industry',
    orientation: 'horizontal',
    bgColor: '#1e293b', accentColor: '#fbbf24', textColor: '#ffffff',
    description: 'Premium card for consultants & finance professionals',
  },
]

export const getTemplateById = (id) => templates.find((t) => t.id === id)
