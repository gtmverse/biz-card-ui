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
    if (canvas) {
      canvas.setBackgroundColor(color, () => canvas.renderAll())
    }
  },

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
    const state = history[newIndex]
    canvas.loadFromJSON(state, () => canvas.renderAll())
    set({ historyIndex: newIndex })
  },
  redo: () => {
    const { canvas, history, historyIndex } = get()
    if (historyIndex >= history.length - 1 || !canvas) return
    const newIndex = historyIndex + 1
    const state = history[newIndex]
    canvas.loadFromJSON(state, () => canvas.renderAll())
    set({ historyIndex: newIndex })
  },

  // Card dimensions
  cardWidth: 900,
  cardHeight: 540,

  // Selected object properties
  selectedObjectProps: null,
  setSelectedObjectProps: (props) => set({ selectedObjectProps: props }),
}))

export default useEditorStore
