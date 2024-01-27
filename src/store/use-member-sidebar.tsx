import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface MemberSidebarStore {
  isCollapsed: boolean
  onExpand: () => void
  onCollapse: () => void
}

export const useMemberSidebar = create<MemberSidebarStore>()(
  persist(
    set => ({
      isCollapsed: false,
      onExpand: () => set(() => ({ isCollapsed: false })),
      onCollapse: () => set(() => ({ isCollapsed: true })),
    }),
    {
      name: 'member-sidebar-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
