import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import PostCard from '../components/PostCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import { PenSquare, BookOpen, Search, X, Users, Sparkles, GraduationCap } from 'lucide-react'

const tabs = [
  { key: 'feed', label: 'Лента' },
  { key: 'my', label: 'Мои посты' },
]

const PAGE_SIZE = 12

export default function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('feed')
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalPosts, setTotalPosts] = useState(null)

  const loadFeed = useCallback(async (reset = true) => {
    const currentPage = reset ? 0 : page
    if (reset) setLoading(true)
    else setLoadingMore(true)
    try {
      const params = new URLSearchParams({
        size: PAGE_SIZE,
        page: currentPage,
        sort: 'createdAt,desc',
      })
      if (search) params.set('q', search)
      if (tagFilter) params.set('tag', tagFilter)
      const { data } = await client.get(`/posts?${params}`)
      const content = data.content ?? []
      if (reset) {
        setPosts(content)
        setPage(1)
        if (data.totalElements != null) setTotalPosts(data.totalElements)
      } else {
        setPosts((prev) => [...prev, ...content])
        setPage((p) => p + 1)
      }
      setHasMore(!data.last)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [search, tagFilter, page])

  const loadMyPosts = useCallback(async () => {
    try {
      const { data } = await client.get('/posts/my?size=50&sort=createdAt,desc')
      setMyPosts(data.content ?? [])
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (tab === 'feed') {
      loadFeed(true)
    } else {
      setLoading(true)
      loadMyPosts().finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search, tagFilter])

  const list = tab === 'feed' ? posts : myPosts

  return (
    <div>
      {/* Hero-баннер */}
      <HeroBanner user={user} totalPosts={totalPosts} />

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'feed' && (
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <form onSubmit={(e) => e.preventDefault()} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск постов..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 pr-4 py-2 text-sm w-full"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </form>
            <input
              type="text"
              placeholder="#тег"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="input py-2 text-sm w-24"
            />
          </div>
        )}
      </div>

      {/* Контент */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : list.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((post) => (
              <PostCard key={post.id} post={post} showStatus={tab === 'my'} />
            ))}
          </div>
          {tab === 'feed' && hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => loadFeed(false)}
                disabled={loadingMore}
                className="btn-secondary px-8"
              >
                {loadingMore ? 'Загрузка...' : 'Загрузить ещё'}
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState tab={tab} search={search} tagFilter={tagFilter} />
      )}
    </div>
  )
}

function HeroBanner({ user, totalPosts }) {
  const firstName = user?.firstName || user?.email?.split('@')[0] || ''

  return (
    <div className="relative overflow-hidden rounded-3xl mb-8">
      {/* Градиент фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700" />

      {/* Декоративные круги */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-sm" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white/5 rounded-full" />
      <div className="absolute top-4 right-32 w-20 h-20 bg-white/10 rounded-full" />

      {/* Точечный паттерн */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Контент */}
      <div className="relative z-10 px-8 py-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-blue-100 text-sm font-medium tracking-wide">UniFlow Blog</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
          {firstName ? `Сәлем, ${firstName}!` : 'Университет блогы'}
        </h1>
        <p className="text-blue-100 text-sm mb-8 max-w-md">
          Білімді бөліс, тәжірибе алмас, идея ұсын — университеттің жалпы кеңістігі
        </p>

        {/* Статистика */}
        <div className="flex flex-wrap gap-6 mb-8">
          <StatItem icon={<BookOpen className="w-4 h-4" />} value={totalPosts ?? '...'} label="пост жарияланды" />
          <StatItem icon={<GraduationCap className="w-4 h-4" />} value="6" label="мамандық" />
          <StatItem icon={<Sparkles className="w-4 h-4" />} value="AI" label="ассистент бар" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/posts/create"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl
                       hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 text-sm"
          >
            <PenSquare className="w-4 h-4" />
            Пост жазу
          </Link>
          <Link
            to="/ai"
            className="inline-flex items-center gap-2 bg-white/15 text-white font-medium px-5 py-2.5 rounded-xl
                       hover:bg-white/25 transition-all backdrop-blur-sm border border-white/20 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            AI-ге сұрақ қою
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatItem({ icon, value, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-white font-bold text-lg leading-none">{value}</div>
        <div className="text-blue-200 text-xs mt-0.5">{label}</div>
      </div>
    </div>
  )
}

function EmptyState({ tab, search, tagFilter }) {
  const hasFilters = search || tagFilter
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-slate-300" />
      </div>
      <p className="text-slate-400 text-sm mb-4">
        {hasFilters
          ? 'Ничего не найдено по вашему запросу'
          : tab === 'feed'
            ? 'Постов пока нет'
            : 'Вы ещё не написали ни одного поста'}
      </p>
      {!hasFilters && (
        <Link to="/posts/create" className="btn-primary inline-flex items-center gap-2 text-sm">
          <PenSquare className="w-4 h-4" />
          Написать первый пост
        </Link>
      )}
    </div>
  )
}
