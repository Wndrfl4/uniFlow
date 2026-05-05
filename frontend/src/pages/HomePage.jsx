import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import PostCard from '../components/PostCard'
import Spinner from '../components/Spinner'
import { PenSquare, BookOpen, Search, X } from 'lucide-react'

const tabs = [
  { key: 'feed', label: 'Лента' },
  { key: 'my', label: 'Мои посты' },
]

const PAGE_SIZE = 12

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('feed')
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

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

  const handleSearch = (e) => {
    e.preventDefault()
  }

  const list = tab === 'feed' ? posts : myPosts

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Университетский{' '}
          <span className="gradient-text">блог</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Делитесь знаниями, опытом и идеями с университетским сообществом
        </p>
      </div>

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
            <form onSubmit={handleSearch} className="relative flex-1">
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

      {loading ? (
        <Spinner />
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
