import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  commandPaletteOpen: boolean
  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  commandPaletteOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}))
