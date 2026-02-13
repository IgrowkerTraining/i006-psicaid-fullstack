import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar"
import { Button } from "@/components/common/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { format } from "@/utils/format"

type UserAvatarDropdownProps = {
  name: string
  role?: string
  imageUrl?: string
  fallback?: string
  onProfile?: () => void
  onSettings?: () => void
  onLogout?: () => void
}

export function UserAvatarDropdown({
  name,
  role,
  imageUrl,
  fallback,
  onProfile,
  onSettings,
  onLogout,
}: UserAvatarDropdownProps) {
  const initials = fallback ?? format.getInitials(name)

  return (
    <DropdownMenu>
      {/*Trigger del menu, al darle click abre el contenido que se define Abajo*/}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 px-2 gap-3 rounded-full justify-start cursor-pointer"
        >
          <Avatar className="h-10 w-10">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={name} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 text-left leading-tight">
            <div className="truncate text-sm font-medium">{name}</div>
            {role ? (
              <div className="truncate text-xs text-muted-foreground">
                {role}
              </div>
            ) : null}
          </div>

          {/* Chevron */}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      {/*Contenido del menu que se muestra al presionar el Trigger*/}
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={onProfile}>
            <User />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onSettings}>
            <Settings />
            Configuración
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={onLogout}
          >
            <LogOut className="text-destructive focus:text-destructive" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
