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
  return (
    <aside className="h-full w-64 border-r border-slate-800 bg-slate-900/80">
      <div className="h-24 px-4 flex items-center border-b border-slate-800">

        <div className="flex items-center gap-2">
          <img
            src={`${ASSETS.S3_BUCKET_BASE_URL}${ASSETS.IMAGES.LOGO}`}
            alt="Psicaid logo"
            className="size-10 object-contain"
          />
          <span className="font-semibold text-white text-2xl">Psicaid</span>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const isActive = activePath === item.path

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={cn(
                "w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                isActive
                  ? "bg-slate-200 text-slate-900 font-medium"
                  : "text-white hover:bg-slate-100 hover:text-gray-800 cursor-pointer"
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
