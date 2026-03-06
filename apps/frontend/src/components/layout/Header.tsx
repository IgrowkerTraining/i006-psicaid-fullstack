import * as React from "react"
import { useNavigate } from "react-router-dom"

import { ROUTES } from "@/constants/routes"

import { UserAvatarDropdown } from "../shared/UserAvatar"

type HeaderProps = {
  user: { name: string; avatar?: string }
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate()
  const [visible, setVisible] = React.useState(true)
  const lastScrollY = React.useRef(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setVisible(currentY < lastScrollY.current || currentY < 10)
      lastScrollY.current = currentY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-end border-b border-gray-200 bg-white/90 px-6 py-4 backdrop-blur-md shadow-sm transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <UserAvatarDropdown
        name={user.name}
        role="Psicologo"
        imageUrl={user.avatar}
        onProfile={() => navigate(ROUTES.PROFILE)}
        onLogout={onLogout}
      />
    </header>
  )
}
