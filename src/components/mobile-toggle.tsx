import { Navbar, NavbarSkeleton } from '@/components/navbar'
import {
  ServerSidebar,
  ServerSidebarSkeleton,
} from '@/components/server-sidebar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Suspense, memo } from 'react'

// Memoize the Navbar wrapper to prevent re-renders
const NavbarWrapper = memo(function NavbarWrapper() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <Navbar />
    </Suspense>
  )
})
export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <SheetTitle className="hidden"></SheetTitle>
        <div className="w-[72px]">
          <NavbarWrapper />
        </div>
        {/* <Suspense fallback={<ServerSidebarSkeleton />}>
          <ServerSidebar serverId={serverId} />
        </Suspense> */}
      </SheetContent>
    </Sheet>
  )
}
