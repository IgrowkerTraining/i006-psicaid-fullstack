import * as React from "react"
import { cn } from "@/lib/utils"
import { ASSETS } from "@/constants/routes"

export type SidebarItem = {
  label: string
  path: string
  icon?: React.ReactNode
}

type SidebarProps = {
  items: SidebarItem[]
  activePath?: string
  onNavigate: (path: string) => void
}

export function Sidebar({
  items,
  activePath,
  onNavigate,
}: SidebarProps) {
  const currentPath = activePath ?? ""

  return (
    <aside className="h-full w-64 border-r border-gray-200 bg-brand-gradient">
      <div className="h-24 px-4 flex items-center">

        <div className="flex items-center gap-2">
          <img
            src={`${ASSETS.S3_BUCKET_BASE_URL}${ASSETS.IMAGES.LOGO}`}
            alt="Psicaid logo"
            className="size-10 object-contain"
          />
          <span className="font-semibold text-gray-900 text-2xl">Psicaid</span>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const isActive =
            currentPath === item.path ||
            (item.path !== "/" && currentPath.startsWith(`${item.path}/`))

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={cn(
                "w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all",
                isActive
                  ? "bg-brand-active-primario text-white font-medium"
                  : "text-gray-900 hover:bg-brand-hover-primario hover:text-white cursor-pointer"
              )}
            >
              {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
