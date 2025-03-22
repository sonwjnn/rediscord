import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";


type HeaderDropdownItemProps = {
  label: string
  icon:LucideIcon | IconType 
  onClick?: () => void
  className? :string
}

export const HeaderDropdownItem = ({
  label,
  icon: Icon,
  onClick,
  className
}: HeaderDropdownItemProps) => {
  const handleClick = () => {
    onClick?.()
  }

  return (
    <DropdownMenuItem
      onClick={handleClick}
      className={cn("cursor-pointer px-3 py-2 text-sm !leading-[18px] hover:!text-white hover:!bg-[#5865f2]", className)}
    >
      {label}
      <Icon className="ml-auto size-4" />
    </DropdownMenuItem>
  )
}
