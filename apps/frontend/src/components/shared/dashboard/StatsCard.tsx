import * as React from "react";

type StatCardProps = {
    label: string,
    value: string,
    subText: string,
    icon: React.ReactNode
};

export function StatsCard({ label, value, subText, icon }: StatCardProps) {
    return (
        <div
            className="bg-[var(--brand-acento)] border border-gray-200 p-5 rounded-2xl hover:border-[var(--brand-secundario)] transition-all duration-300 group shadow-sm"
        >
            <div className="text-lg text-[var(--brand-primario)] mb-4 flex justify-between font-bold">
                {label}
                {icon}
            </div>
            <p className="text-[var(--brand-primario)] text-lg font-medium uppercase tracking-wider">
                {value}
            </p>
            <h3 className="text-sm text-gray-600 mt-1">
                {subText}
            </h3>
        </div>
    )
}
