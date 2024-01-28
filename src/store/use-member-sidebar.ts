import { create } from 'zustand'

interface MemberSidebarStore {
  isCollapsed: boolean
  onExpand: () => void
  onCollapse: () => void
}

export const useMemberSidebar = create<MemberSidebarStore>()(set => ({
  isCollapsed: false,
  onExpand: () => set(() => ({ isCollapsed: false })),
  onCollapse: () => set(() => ({ isCollapsed: true })),
}))
