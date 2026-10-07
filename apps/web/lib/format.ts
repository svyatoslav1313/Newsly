/** Склеивает классы, пропуская пустые значения. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

// timeZone: 'UTC' — чтобы сервер и браузер отрисовали одну и ту же дату.
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso)).replace(' г.', '');
}

/** Склонение: pluralize(3, ['лайк', 'лайка', 'лайков']) → 'лайка'. */
export function pluralize(count: number, forms: [string, string, string]) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return forms[0];
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return forms[1];
  }

  return forms[2];
}

/** Время чтения в минутах из расчёта ~180 слов в минуту. */
export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(words / 180));
}

/** Первый обычный абзац текста, обрезанный по словам. */
export function excerptFrom(content: string, maxLength = 170) {
  const paragraph =
    content
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block && !block.startsWith('#')) ?? '';

  const plain = paragraph.replace(/^>\s*/, '');

  if (plain.length <= maxLength) {
    return plain;
  }

  return `${plain.slice(0, plain.lastIndexOf(' ', maxLength))}…`;
}

const TRANSLIT: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

/** «Привет, мир» → «privet-mir» для адреса новости. */
export function slugify(title: string) {
  return title
    .toLowerCase()
    .split('')
    .map((char) => TRANSLIT[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
