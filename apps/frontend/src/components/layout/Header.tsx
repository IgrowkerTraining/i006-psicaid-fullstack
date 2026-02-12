import { UserAvatarDropdown } from "../shared/UserAvatar";

type HeaderProps = {
  user: { name: string; avatar?: string }
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-end">
      <UserAvatarDropdown
        name={user.name}
        role="Psicólogo"
        imageUrl={user.avatar}
        onProfile={() => console.log("perfil")}
        onSettings={() => console.log("settings")}
        onLogout={onLogout}
      />
    </header>
  )
}
