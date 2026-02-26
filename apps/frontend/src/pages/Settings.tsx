import React from "react"

const Settings: React.FC = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Configuracion</h1>
        <p className="text-sm text-gray-600">
          Ajustes generales de la plataforma. Esta vista queda lista para su
          implementacion.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Placeholder</h2>
        <p className="mt-2 text-sm text-gray-600">
          Aqui iran las preferencias de la cuenta, configuraciones de uso y
          opciones del sistema.
        </p>
      </section>
    </>
  )
}

export default Settings
