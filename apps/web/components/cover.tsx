import { cn } from '@/lib/format';
import type { Cover as CoverData } from '@/lib/types';

/**
 * Обложка-плейсхолдер: спокойный градиент одного оттенка и геометрический
 * узор поверх. Позже заменяется на <Image> с настоящей картинкой.
 */
export function Cover({
  cover,
  className,
}: {
  cover: CoverData;
  className?: string;
}) {
  const { hue, pattern } = cover;
  const stroke = `oklch(0.42 0.09 ${hue})`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden dark:brightness-[0.82] dark:saturate-[0.9]',
        className,
      )}
      style={{
        background: `linear-gradient(135deg, oklch(0.92 0.04 ${hue}) 0%, oklch(0.8 0.08 ${hue + 20}) 100%)`,
      }}
    >
      <svg
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        fill="none"
        stroke={stroke}
      >
        {pattern === 'rings' &&
          [40, 80, 120, 160, 200, 240].map((radius) => (
            <circle
              key={radius}
              cx="300"
              cy="70"
              r={radius}
              strokeWidth="1"
              opacity={0.45 - radius / 800}
            />
          ))}

        {pattern === 'grid' &&
          Array.from({ length: 9 }, (_, row) =>
            Array.from({ length: 14 }, (_, column) => (
              <circle
                key={`${row}-${column}`}
                cx={20 + column * 28}
                cy={20 + row * 28}
                r={1.5 + ((row + column) % 4)}
                fill={stroke}
                stroke="none"
                opacity={0.12 + ((row * column) % 5) * 0.05}
              />
            )),
          )}

        {pattern === 'waves' &&
          [0, 1, 2, 3, 4, 5, 6].map((index) => (
            <path
              key={index}
              d={`M -20 ${60 + index * 28} C 80 ${10 + index * 28}, 160 ${120 + index * 28}, 240 ${60 + index * 28} S 380 ${20 + index * 28}, 440 ${70 + index * 28}`}
              strokeWidth="1.25"
              opacity={0.18 + index * 0.04}
            />
          ))}

        {pattern === 'blocks' && (
          <g stroke="none" fill={stroke}>
            <rect
              x="210"
              y="-30"
              width="170"
              height="170"
              rx="20"
              opacity="0.14"
              transform="rotate(18 295 55)"
            />
            <rect
              x="120"
              y="90"
              width="150"
              height="150"
              rx="20"
              opacity="0.1"
              transform="rotate(-12 195 165)"
            />
            <rect
              x="290"
              y="130"
              width="110"
              height="110"
              rx="16"
              opacity="0.18"
              transform="rotate(30 345 185)"
            />
            <circle cx="70" cy="60" r="28" opacity="0.12" />
          </g>
        )}
      </svg>
    </div>
  );
}
