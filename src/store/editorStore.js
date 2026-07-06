import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const PERSONA_PRESETS = [
  {
    name: 'Charlotte Vance',
    title: 'Creative Director',
    company: 'Vance & Co.',
    tagline: 'Smarter design for digital products.',
    phone: '+1 (234) 567-8900',
    email: 'charlotte@vance.co',
    website: 'www.vance.co',
    address: '452 Design District, New York, NY',
    avatarSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    logoSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Alexander Mercer',
    title: 'VP of Technology',
    company: 'Aether Systems',
    tagline: 'Next-generation cloud engineering.',
    phone: '+1 (415) 888-0192',
    email: 'a.mercer@aether.io',
    website: 'www.aether.io',
    address: '500 Innovation Way, San Francisco, CA',
    avatarSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300',
    logoSrc: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Sofia Sterling',
    title: 'Managing Partner',
    company: 'Sterling & Associates',
    tagline: 'Counsel you trust, results you expect.',
    phone: '+1 (212) 555-0143',
    email: 's.sterling@sterlinglaw.com',
    website: 'www.sterlinglaw.com',
    address: '10 Wall Street, 24th Floor, New York, NY',
    avatarSrc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300',
    logoSrc: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Dr. Emily Taylor, MD',
    title: 'Chief Cardiologist',
    company: 'Taylor Health Plaza',
    tagline: 'Excellence and compassion in patient care.',
    phone: '+1 (312) 444-9876',
    email: 'emily.taylor@taylorhealth.org',
    website: 'www.taylorhealth.org',
    address: '742 Medical Plaza, Chicago, IL',
    avatarSrc: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    logoSrc: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Marcus Thorne',
    title: 'Principal Architect',
    company: 'Thorne Design Studio',
    tagline: 'Crafting timeless, sustainable spaces.',
    phone: '+44 20 7946 0192',
    email: 'marcus@thorne.design',
    website: 'www.thorne.design',
    address: '88 Architecture Lane, London, UK',
    avatarSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300',
    logoSrc: 'https://images.unsplash.com/photo-1603366445787-09714680cbf1?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Aria Kobayashi',
    title: 'VP of Creative Strategy',
    company: 'Kobayashi Media',
    tagline: 'Connecting global brands with modern culture.',
    phone: '+81 3 5555 0199',
    email: 'aria@kobayashimedia.jp',
    website: 'www.kobayashimedia.jp',
    address: '15 Shibuya Crossing, Tokyo, Japan',
    avatarSrc: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
    logoSrc: 'https://images.unsplash.com/photo-1568200022067-17559e37ccfb?auto=format&fit=crop&q=80&w=200&h=200',
  }
]

const storeApi = subscribeWithSelector((set, get) => ({
  // Canvas instance
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),

  // Profile details (auto-saved details that persist across template switches)
  profileDetails: {
    ...PERSONA_PRESETS[0]
  },
  setProfileDetail: (key, value) => set((state) => ({
    profileDetails: { ...state.profileDetails, [key]: value }
  })),
  setProfileDetails: (details) => set((state) => ({
    profileDetails: { ...state.profileDetails, ...details },
    templateChangeId: state.templateChangeId + 1, // force rebuild of active side
  })),

  // Custom logo source (base64 data URL) to persist logo uploads across templates
  customLogoSrc: null,
  setCustomLogoSrc: (src) => set({ customLogoSrc: src }),

  // Active tool
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Active sidebar item
  activeSidebarItem: 'templates',
  setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),

  // Selected template
  selectedTemplate: 'corporate-blue',
  templateChangeId: 0,
  setSelectedTemplate: (id) => {
    set((state) => ({
      selectedTemplate: id,
      templateChangeId: state.templateChangeId + 1,
    }))
  },

  // ─── Card side (front / back) ───────────────────────────────────────────
  currentSide: 'front',
  setCurrentSide: (side) => set({ currentSide: side }),

  // Serialized Fabric JSON for each side; null = not yet edited / use default
  frontJSON: null,
  backJSON: null,
  setFrontJSON: (json) => set({ frontJSON: json }),
  setBackJSON:  (json) => set({ backJSON:  json }),
  // Called when the user picks a new template — discard stale per-side edits
  resetSideJSON: () => set({ frontJSON: null, backJSON: null }),

  // Selected objects on canvas
  selectedObjects: [],
  setSelectedObjects: (objects) => set({ selectedObjects: objects }),

  // Zoom level
  zoom: 100,
  setZoom: (zoom) => set({ zoom }),

  // Layers
  layers: [],
  setLayers: (layers) => set({ layers }),

  // Active properties tab
  activePropertiesTab: 'design',
  setActivePropertiesTab: (tab) => set({ activePropertiesTab: tab }),

  // Canvas background color
  canvasBg: '#ffffff',
  setCanvasBg: (color) => {
    set({ canvasBg: color })
    const { canvas } = get()
    if (canvas) canvas.setBackgroundColor(color, () => canvas.renderAll())
  },
  setCanvasBgSilent: (color) => set({ canvasBg: color }),

  // Template filter
  templateFilter: 'all',
  setTemplateFilter: (filter) => set({ templateFilter: filter }),

  // Preview mode
  previewMode: false,
  setPreviewMode: (mode) => set({ previewMode: mode }),

  // History (undo/redo)
  history: [],
  historyIndex: -1,
  pushHistory: (state) => {
    const { history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(state)
    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },
  undo: () => {
    const { canvas, history, historyIndex } = get()
    if (historyIndex <= 0 || !canvas) return
    const newIndex = historyIndex - 1
    canvas.loadFromJSON(history[newIndex], () => canvas.renderAll())
    set({ historyIndex: newIndex })
  },
  redo: () => {
    const { canvas, history, historyIndex } = get()
    if (historyIndex >= history.length - 1 || !canvas) return
    const newIndex = historyIndex + 1
    canvas.loadFromJSON(history[newIndex], () => canvas.renderAll())
    set({ historyIndex: newIndex })
  },

  // Card dimensions (updated when template orientation changes)
  cardWidth: 900,
  cardHeight: 540,
  setCardDimensions: (w, h) => set({ cardWidth: w, cardHeight: h }),

  // Selected object properties
  selectedObjectProps: null,
  setSelectedObjectProps: (props) => set({ selectedObjectProps: props }),

  // Authentication & Auth Modal State
  user: (() => {
    try {
      const saved = localStorage.getItem('bizcard_user')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  })(),
  authModalOpen: false,
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  login: (user) => {
    try {
      localStorage.setItem('bizcard_user', JSON.stringify(user))
    } catch (e) {}
    set({ user })
  },
  logout: () => {
    try {
      localStorage.removeItem('bizcard_user')
      localStorage.removeItem('bizcard_token')
      localStorage.removeItem('bizcard_skip_landing')
    } catch (e) {}
    set({ user: null, skipLandingPage: false })
  },

  // Landing page bypass state
  skipLandingPage: (() => {
    try {
      return localStorage.getItem('bizcard_skip_landing') === 'true'
    } catch (e) {
      return false
    }
  })(),
  setSkipLandingPage: (skip) => {
    try {
      localStorage.setItem('bizcard_skip_landing', skip ? 'true' : 'false')
    } catch (e) {}
    set({ skipLandingPage: skip })
  },
}))

const isDev = import.meta.env.DEV
let useEditorStore

if (isDev && window.__ZUSTAND_STORE__) {
  useEditorStore = window.__ZUSTAND_STORE__
} else {
  useEditorStore = create(storeApi)
  if (isDev) {
    window.__ZUSTAND_STORE__ = useEditorStore
  }
}

export default useEditorStore

