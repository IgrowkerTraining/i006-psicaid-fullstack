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
            className="bg-brand-acento border border-gray-200 p-5 rounded-2xl hover:border-brand-primario transition-all duration-300 group shadow-sm"
        >
            <div className="text-lg text-gray-900 mb-4 flex justify-between font-bold">
                {label}
                {icon}
            </div>
            <p className="text-primary-foreground text-lg font-medium uppercase tracking-wider">
                {value}
            </p>
            <h3 className="text-sm text-gray-600 mt-1">
                {subText}
            </h3>
        </div>
    )
}

export function StatsCardSkeleton() {
    return (
        <div className="bg-brand-acento border border-gray-200 p-5 rounded-2xl shadow-sm">
            <div className="animate-pulse">
                <div className="mb-4 flex items-center justify-between">
                    <div className="h-5 w-28 rounded bg-slate-300/70" />
                    <div className="h-5 w-5 rounded bg-slate-300/70" />
                </div>
                <div className="h-6 w-16 rounded bg-slate-300/80" />
                <div className="mt-2 h-4 w-24 rounded bg-slate-300/60" />
            </div>
        </div>
    )
}
