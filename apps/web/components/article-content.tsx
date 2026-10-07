import { cn } from '@/lib/format';

/**
 * Превращает текст новости в разметку: блоки разделены пустой строкой,
 * «## » в начале — подзаголовок, «> » — цитата, остальное — абзацы.
 */
export function ArticleContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={cn('article-body', className)}>
      {blocks.map((block, index) => {
        if (block.startsWith('## ')) {
          return <h2 key={index}>{block.slice(3)}</h2>;
        }

        if (block.startsWith('> ')) {
          return <blockquote key={index}>{block.slice(2)}</blockquote>;
        }

        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
