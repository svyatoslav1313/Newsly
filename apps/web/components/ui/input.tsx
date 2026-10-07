import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/format';

const control =
  'w-full rounded-md border border-line-strong bg-surface px-3.5 text-[15px] text-ink ' +
  'placeholder:text-ink-subtle transition-[border-color,box-shadow] duration-150 ease-out ' +
  'hover:border-ink-subtle focus:border-accent focus:ring-3 focus:ring-accent/15 focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'aria-invalid:border-danger aria-invalid:focus:ring-danger/15';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, 'h-11', className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        control,
        'min-h-28 resize-y py-3 leading-relaxed',
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(control, 'h-11 appearance-none pr-10', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-subtle"
        aria-hidden="true"
      />
    </div>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/**
 * Подпись, поле и сообщение под ним. Полю нужно передать
 * aria-describedby={`${htmlFor}-message`} и aria-invalid при ошибке.
 */
export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {(error || hint) && (
        <p
          id={`${htmlFor}-message`}
          role={error ? 'alert' : undefined}
          className={cn('text-sm', error ? 'text-danger' : 'text-ink-subtle')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
