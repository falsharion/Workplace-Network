import type { Article } from '@/types/database'

const AVATAR_INITIALS_COLORS = ['#4A5568', '#2B6CB0', '#2C7A7B', '#6B46C1']

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function AuthorAvatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
      style={{ backgroundColor: AVATAR_INITIALS_COLORS[index % AVATAR_INITIALS_COLORS.length] }}
    >
      {initials}
    </div>
  )
}

interface LatestArticlesProps {
  articles: Article[]
}

export function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section id="articles" className="bg-cream py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0B0E14' }}>
            Latest articles
          </h2>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Read More Articles
          </a>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto scroll-snap-x -mx-4 px-4 sm:-mx-6 sm:px-6 lg:hidden pb-2">
          {articles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden lg:grid grid-cols-3 gap-4">
          {articles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} isDesktop />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleCard({
  article,
  index,
  isDesktop = false,
}: {
  article: Article
  index: number
  isDesktop?: boolean
}) {
  return (
    <a
      href={article.slug ? `/articles/${article.slug}` : '#'}
      className={`scroll-snap-item flex-shrink-0 flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow group
        ${isDesktop ? '' : 'min-w-[260px] max-w-[280px]'}`}
      style={{ minHeight: '160px' }}
    >
      <div>
        {article.published_at && (
          <p className="text-gray-400 text-[10px] font-medium mb-3 uppercase tracking-wide">
            {formatDate(article.published_at)}
          </p>
        )}
        <h3 className="text-gray-900 font-semibold text-sm leading-snug group-hover:text-gray-700 transition-colors line-clamp-3">
          {article.title}
        </h3>
      </div>

      {article.author && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          {article.author_avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.author_avatar_url}
              alt={article.author}
              className="w-6 h-6 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <AuthorAvatar name={article.author} index={index} />
          )}
          <span className="text-gray-500 text-xs font-medium">{article.author}</span>
        </div>
      )}
    </a>
  )
}
