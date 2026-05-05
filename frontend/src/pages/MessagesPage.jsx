import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import Spinner from '../components/Spinner'
import { MessageSquare, Search, User } from 'lucide-react'

const roleLabel = { STUDENT: 'Студент', TEACHER: 'Преподаватель', ADMIN: 'Администратор' }
const roleColor = {
  STUDENT: 'bg-blue-50 text-blue-600',
  TEACHER: 'bg-violet-50 text-violet-600',
  ADMIN: 'bg-slate-100 text-slate-600',
}

export default function MessagesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    client.get('/messages/conversations')
      .then((r) => setConversations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!query.trim()) { setSearchResults([]); return }
    const t = setTimeout(() => {
      setSearching(true)
      client.get(`/messages/users/search?q=${encodeURIComponent(query)}`)
        .then((r) => setSearchResults(r.data))
        .catch(() => {})
        .finally(() => setSearching(false))
    }, 350)
    return () => clearTimeout(t)
  }, [query])

  const formatTime = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diff = now - d
    if (diff < 60000) return 'Только что'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин`
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-100">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Сообщения</h1>
          <p className="text-slate-400 text-sm">Общайтесь со студентами и преподавателями</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="input pl-10"
          placeholder="Найти пользователя..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Search results */}
      {query.trim() && (
        <div className="card mb-4 overflow-hidden">
          {searching ? (
            <div className="p-4 flex justify-center"><Spinner /></div>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-6">Никого не найдено</p>
          ) : (
            searchResults.map((u) => (
              <button
                key={u.id}
                onClick={() => navigate(`/messages/${u.id}`)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {u.firstName[0]}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[u.role]}`}>
                  {roleLabel[u.role]}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Conversations */}
      {!query.trim() && (
        loading ? <Spinner /> : conversations.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Нет переписок</p>
            <p className="text-slate-400 text-sm mt-1">Найдите пользователя выше, чтобы начать чат</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            {conversations.map((conv, i) => (
              <Link
                key={conv.userId}
                to={`/messages/${conv.userId}`}
                className={`flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors ${i < conversations.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold">
                    {conv.firstName[0]}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`font-medium text-sm truncate ${conv.unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                      {conv.firstName} {conv.lastName}
                    </p>
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatTime(conv.lastMessageAt)}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}
