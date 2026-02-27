import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { SessionStatus } from "./types";

const panelCardClass =
  "rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(9,2,36,0.06)] backdrop-blur sm:p-6";

const sectionCardClass =
  "rounded-2xl border border-[var(--border)] bg-[var(--brand-acento)]/75 p-4 shadow-[0_8px_24px_rgba(9,2,36,0.05)]";

export function PanelShell({ children }: { children: ReactNode }) {
  return <div className={panelCardClass}>{children}</div>;
}

export function SectionCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn(sectionCardClass, className)}>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function LabelValue({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-900">
        {label}
      </p>
      <p className="text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

export function BulletList({
  items,
  tone = "secondary",
}: {
  items: string[];
  tone?: "secondary" | "tertiary";
}) {
  const bulletClass =
    tone === "tertiary" ? "bg-[var(--brand-terciario)]" : "bg-[var(--brand-secundario)]";

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-2 text-sm leading-6 text-slate-700"
        >
          <span className={cn("mt-2 size-1.5 rounded-full", bulletClass)} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function StatusBadge({ status }: { status: SessionStatus }) {
  const classes =
    status === "completada"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
      : status === "programada"
        ? "border-[var(--brand-primario)]/30 bg-[var(--brand-primario)]/10 text-brand-primario"
        : "border-rose-300 bg-rose-50 text-rose-700";

  return (
    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", classes)}>
      {status}
    </span>
  );
}

