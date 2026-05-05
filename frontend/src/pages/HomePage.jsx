import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import PostCard from '../components/PostCard'
import Spinner from '../components/Spinner'
import { PenSquare, BookOpen } from 'lucide-react'

const tabs = [
  { key: 'feed', label: 'Лента' },
  { key: 'my', label: 'Мои посты' },
]

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('feed')

  useEffect(() => {
    const load = async () => {
      try {
        const [feedRes, myRes] = await Promise.all([
          client.get('/posts?size=20&sort=createdAt,desc'),
          client.get('/posts/my?size=20&sort=createdAt,desc'),
        ])
        setPosts(feedRes.data.content ?? [])
        setMyPosts(myRes.data.content ?? [])
      } catch {
        /* ignore */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const list = tab === 'feed' ? posts : myPosts

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Университетский{' '}
          <span className="gradient-text">блог</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Делитесь знаниями, опытом и идеями с университетским сообществом
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
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
      </div>

      {loading ? (
        <Spinner />
      ) : list.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((post) => (
            <PostCard key={post.id} post={post} showStatus={tab === 'my'} />
          ))}
        </div>
      ) : (
        <EmptyState tab={tab} />
      )}
    </div>
  )
}

function EmptyState({ tab }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-slate-300" />
      </div>
      <p className="text-slate-400 text-sm mb-4">
        {tab === 'feed' ? 'Постов пока нет' : 'Вы ещё не написали ни одного поста'}
      </p>
      <Link to="/posts/create" className="btn-primary inline-flex items-center gap-2 text-sm">
        <PenSquare className="w-4 h-4" />
        Написать первый пост
      </Link>
    </div>
  )
}
