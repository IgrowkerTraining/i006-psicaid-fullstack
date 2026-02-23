import { cn } from "@/lib/utils";

type IconActionButtonProps = {
    label: string;
    tone?: 'default' | 'danger';
    onClick?: () => void;
    children: React.ReactNode;
};

export default function IconActionButton({
    label,
    tone = 'default',
    onClick,
    children,
}: IconActionButtonProps) {
    const toneClasses =
        tone === 'danger'
            ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800';

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            disabled={!onClick}
            className={cn(
                'rounded-md p-2 transition-colors cursor-pointer',
                toneClasses
            )}
        >
            {children}
        </button>
    );
}