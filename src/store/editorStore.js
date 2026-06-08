import { create } from 'zustand'

const useEditorStore = create((set, get) => ({
  // Canvas instance
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),

  // Active tool
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Active sidebar item
  activeSidebarItem: 'templates',
  setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),

  // Selected template
  selectedTemplate: 'corporate-blue',
  setSelectedTemplate: (id) => set({ selectedTemplate: id }),

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
  canvasBg: '#1e3a5f',
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
}))

export default useEditorStore
