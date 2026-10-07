'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from './ui/button';
import { Field, Input } from './ui/input';

type Mode = 'login' | 'register';
type Errors = Partial<Record<'name' | 'email' | 'password', string>>;

const copy = {
  login: {
    title: 'С возвращением',
    subtitle: 'Войдите, чтобы комментировать и ставить лайки.',
    submit: 'Войти',
    pending: 'Входим',
    switchText: 'Ещё нет аккаунта?',
    switchLabel: 'Зарегистрироваться',
    switchHref: '/register',
  },
  register: {
    title: 'Создать аккаунт',
    subtitle: 'Это займёт меньше минуты.',
    submit: 'Зарегистрироваться',
    pending: 'Создаём аккаунт',
    switchText: 'Уже есть аккаунт?',
    switchLabel: 'Войти',
    switchHref: '/login',
  },
} as const;

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { login } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const text = copy[mode];

  function validate(): Errors {
    const next: Errors = {};

    if (mode === 'register' && name.trim().length < 2) {
      next.name = 'Укажите имя — минимум 2 символа.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Введите корректный адрес, например name@mail.ru.';
    }

    if (password.length < 8) {
      next.password = 'Пароль должен быть не короче 8 символов.';
    }

    return next;
  }

  // Ошибка поля снимается, как только пользователь начинает его исправлять.
  function clearError(field: keyof Errors) {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setPending(true);
    // Без бэкенда вход всегда успешен; имя берём из формы или из адреса почты.
    await login({
      name: mode === 'register' ? name.trim() : email.trim().split('@')[0],
      email: email.trim(),
    });

    router.push('/');
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-20">
      <div className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {text.title}
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">{text.subtitle}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {mode === 'register' && (
            <Field label="Имя" htmlFor="auth-name" error={errors.name}>
              <Input
                id="auth-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  clearError('name');
                }}
                autoComplete="name"
                placeholder="Как к вам обращаться"
                aria-invalid={Boolean(errors.name)}
                aria-describedby="auth-name-message"
                disabled={pending}
              />
            </Field>
          )}

          <Field
            label="Электронная почта"
            htmlFor="auth-email"
            error={errors.email}
          >
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError('email');
              }}
              autoComplete="email"
              placeholder="name@mail.ru"
              aria-invalid={Boolean(errors.email)}
              aria-describedby="auth-email-message"
              disabled={pending}
            />
          </Field>

          <Field
            label="Пароль"
            htmlFor="auth-password"
            error={errors.password}
            hint={mode === 'register' ? 'Не короче 8 символов.' : undefined}
          >
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearError('password');
                }}
                autoComplete={
                  mode === 'register' ? 'new-password' : 'current-password'
                }
                className="pr-12"
                aria-invalid={Boolean(errors.password)}
                aria-describedby="auth-password-message"
                disabled={pending}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                aria-pressed={showPassword}
                className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-md text-ink-subtle transition-colors hover:text-ink"
              >
                {showPassword ? (
                  <EyeOff className="size-[18px]" aria-hidden="true" />
                ) : (
                  <Eye className="size-[18px]" aria-hidden="true" />
                )}
              </button>
            </div>
          </Field>

          <Button type="submit" loading={pending} className="w-full">
            {pending ? text.pending : text.submit}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-[15px] text-ink-muted">
        {text.switchText}{' '}
        <Link
          href={text.switchHref}
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          {text.switchLabel}
        </Link>
      </p>
    </div>
  );
}
