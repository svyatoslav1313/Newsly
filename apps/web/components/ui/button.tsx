import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'icon';

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg shadow-sm hover:bg-accent-hover',
  secondary:
    'border border-line-strong bg-surface text-ink hover:bg-surface-muted',
  ghost: 'text-ink-muted hover:bg-surface-muted hover:text-ink',
  danger: 'border border-line-strong bg-surface text-danger hover:bg-danger/10',
};

// Высота md и icon — 44 px: комфортная зона нажатия на телефоне.
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  icon: 'size-11',
};

interface ButtonStyleOptions {
  variant?: Variant;
  size?: Size;
  className?: string;
}

/** Классы кнопки — чтобы так же оформить ссылку (`<Link>`). */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  loading?: boolean;
}

export function Button({
  variant,
  size,
  className,
  loading = false,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {children}
      {loading && <LoadingDots />}
    </button>
  );
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1 animate-pulse rounded-full bg-current"
          style={{ animationDelay: `${delay}ms`, animationDuration: '900ms' }}
        />
      ))}
    </span>
  );
}
