import React from "react"

const Profile: React.FC = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-sm text-gray-600">
          Informacion personal del profesional y datos de la cuenta.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Placeholder</h2>
        <p className="mt-2 text-sm text-gray-600">
          Aqui se mostraran los datos del profesional, informacion de contacto y
          acciones relacionadas con la cuenta.
        </p>
      </section>
    </>
  )
}

export default Profile
