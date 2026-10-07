'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { buttonStyles } from './ui/button';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_EVENT = 'themechange';

/**
 * Скрипт выполняется в <head> до первой отрисовки и ставит data-theme,
 * поэтому страница не мигает светлой темой при загрузке.
 * Порядок: сохранённый выбор → системная настройка.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  // Пока пользователь не выбрал тему сам, следуем за системной настройкой.
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  };

  window.addEventListener(THEME_EVENT, onChange);
  media.addEventListener('change', onSystemChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    media.removeEventListener('change', onSystemChange);
  };
}

export function ThemeToggle() {
  // Тема хранится в DOM, а не в состоянии React: читаем её как внешний источник.
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light');
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  function toggle() {
    localStorage.setItem(STORAGE_KEY, next);

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // View Transitions даёт плавное перетекание всей страницы без миганий.
    if (!reduceMotion && 'startViewTransition' in document) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        next === 'dark' ? 'Включить тёмную тему' : 'Включить светлую тему'
      }
      className={buttonStyles({ variant: 'ghost', size: 'icon' })}
    >
      {theme === 'dark' ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
