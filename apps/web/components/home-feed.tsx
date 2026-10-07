'use client';

import { useState } from 'react';
import { Newspaper, SearchX } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CategoryChips, type CategoryFilter } from './category-chips';
import { EmptyState } from './empty-state';
import { HeroNews } from './hero-news';
import { NewsCard, NewsCardSkeleton } from './news-card';
import { Reveal } from './reveal';
import { Button } from './ui/button';
import { Container } from './ui/container';

const PAGE_SIZE = 6;

export function HomeFeed() {
  const { news, query, setQuery } = useStore();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const search = query.trim().toLowerCase();
  const filtering = category !== 'all' || search !== '';

  const sorted = news.toSorted((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const filtered = sorted.filter(
    (item) =>
      (category === 'all' || item.category === category) &&
      (search === '' ||
        `${item.title} ${item.excerpt}`.toLowerCase().includes(search)),
  );

  // Главная новость показывается только в общей ленте без фильтров.
  const hero = filtering ? undefined : filtered[0];
  const list = hero ? filtered.slice(1) : filtered;
  const visible = list.slice(0, visibleCount);
  const hasMore = list.length > visibleCount;

  function changeCategory(next: CategoryFilter) {
    setCategory(next);
    setVisibleCount(PAGE_SIZE);
  }

  function loadMore() {
    // Имитация запроса следующей страницы — на это время видны скелетоны.
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((count) => count + PAGE_SIZE);
      setLoadingMore(false);
    }, 700);
  }

  function resetFilters() {
    setQuery('');
    changeCategory('all');
  }

  return (
    <Container className="pt-8 sm:pt-12">
      <h1 className="sr-only">Новости</h1>

      {hero && (
        <section aria-label="Главная новость" className="mb-12 sm:mb-16">
          <HeroNews item={hero} />
        </section>
      )}

      <section aria-labelledby="feed-title">
        <div className="mb-6 flex flex-col gap-5 sm:mb-8">
          <h2
            id="feed-title"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            {search ? `Результаты по запросу «${query.trim()}»` : 'Свежее'}
          </h2>
          <CategoryChips value={category} onChange={changeCategory} />
        </div>

        {news.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="Новостей пока нет"
            hint="Как только редакция опубликует первую новость, она появится здесь."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Ничего не нашлось"
            hint="Попробуйте изменить запрос или выбрать другую категорию."
            action={
              <Button variant="secondary" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            }
          />
        ) : (
          <>
            {/* key: при смене фильтра сетка создаётся заново и появляется каскадом. */}
            <ul
              key={`${category}-${search}`}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            >
              {visible.map((item, index) => (
                <li key={item.id}>
                  <Reveal delay={(index % PAGE_SIZE) * 0.06} className="h-full">
                    <NewsCard item={item} />
                  </Reveal>
                </li>
              ))}
              {loadingMore &&
                [0, 1, 2].map((index) => (
                  <li key={`skeleton-${index}`}>
                    <NewsCardSkeleton />
                  </li>
                ))}
            </ul>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={loadMore}
                  loading={loadingMore}
                >
                  {loadingMore ? 'Загружаем' : 'Загрузить ещё'}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </Container>
  );
}
