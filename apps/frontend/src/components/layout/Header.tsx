import { useNavigate } from "react-router-dom"

import { ROUTES } from "@/constants/routes"

import { UserAvatarDropdown } from "../shared/UserAvatar"

type HeaderProps = {
  user: { name: string; avatar?: string }
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-end border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-md">
      <UserAvatarDropdown
        name={user.name}
        role="Psicologo"
        imageUrl={user.avatar}
        onProfile={() => navigate(ROUTES.PROFILE)}
        onSettings={() => navigate(ROUTES.SETTINGS)}
        onLogout={onLogout}
      />
    </header>
  )
}
