import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import Spinner from '../components/Spinner'
import { ShieldCheck, Users, FileText, ScrollText, CheckCircle, EyeOff, Clock, User, Trash2, BarChart2 } from 'lucide-react'

const tabs = [
  { key: 'stats', label: 'Статистика', icon: BarChart2 },
  { key: 'pending', label: 'На проверке', icon: FileText },
  { key: 'deletions', label: 'Заявки на удаление', icon: Trash2 },
  { key: 'users', label: 'Пользователи', icon: Users },
  { key: 'audit', label: 'Аудит', icon: ScrollText },
]

export default function AdminPage() {
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState([])
  const [deletions, setDeletions] = useState([])
  const [users, setUsers] = useState([])
  const [audit, setAudit] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        if (tab === 'stats') {
          const { data } = await client.get('/admin/stats')
          setStats(data)
        } else if (tab === 'pending') {
          const { data } = await client.get('/posts/pending?size=50&sort=createdAt,desc')
          setPending(data.content ?? [])
        } else if (tab === 'deletions') {
          const { data } = await client.get('/admin/deletion-requests')
          setDeletions(data)
        } else if (tab === 'users') {
          const { data } = await client.get('/admin/users?size=50')
          setUsers(data.content ?? [])
        } else {
          const { data } = await client.get('/admin/audit?size=100&sort=createdAt,desc')
          setAudit(data.content ?? [])
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tab])

  const handleApprovePost = async (id) => {
    setActionId(id)
    try {
      await client.put(`/posts/${id}/approve`)
      setPending((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setActionId(null)
    }
  }

  const handleApproveDeletion = async (id) => {
    if (!confirm('Подтвердить удаление аккаунта? Пользователь будет анонимизирован.')) return
    setActionId(id)
    try {
      await client.post(`/admin/deletion-requests/${id}/approve`)
      setDeletions((prev) => prev.filter((d) => d.id !== id))
    } finally {
      setActionId(null)
    }
  }

  const handleAnonymize = async (userId) => {
    if (!confirm('Принудительно анонимизировать пользователя?')) return
    setActionId(userId)
    try {
      await client.post(`/admin/users/${userId}/anonymize`)
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, anonymized: true } : u))
    } finally {
      setActionId(null)
    }
  }

  const roleLabel = { STUDENT: 'Студент', TEACHER: 'Преподаватель', ADMIN: 'Администратор' }
  const roleColor = {
    STUDENT: 'bg-blue-50 text-blue-600 border-blue-100',
    TEACHER: 'bg-violet-50 text-violet-600 border-violet-100',
    ADMIN: 'bg-slate-100 text-slate-600 border-slate-200',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-100">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Панель администратора</h1>
          <p className="text-slate-400 text-sm">Управление платформой</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit flex-wrap">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Statistics */}
          {tab === 'stats' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Всего пользователей" value={stats.totalUsers} color="from-blue-500 to-blue-600" />
              <StatCard label="Всего постов" value={stats.totalPosts} color="from-violet-500 to-violet-600" />
              <StatCard label="Опубликовано" value={stats.publishedPosts} color="from-emerald-500 to-emerald-600" />
              <StatCard label="На проверке" value={stats.pendingPosts} color="from-amber-500 to-amber-600" />
              <StatCard label="Комментариев" value={stats.totalComments} color="from-pink-500 to-pink-600" />
              <StatCard label="AI-запросов" value={stats.totalAiRequests} color="from-slate-500 to-slate-600" />
            </div>
          )}

          {/* Pending posts */}
          {tab === 'pending' && (
            <div className="space-y-3">
              {pending.length === 0 ? (
                <EmptyState icon={<FileText className="w-8 h-8 text-slate-300" />} text="Нет постов на проверке" />
              ) : pending.map((post) => (
                <div key={post.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Link to={`/posts/${post.id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3" />{post.authorName}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{new Date(post.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{post.content}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprovePost(post.id)}
                        disabled={actionId === post.id}
                        className="btn-primary text-sm flex items-center gap-1.5 px-3 py-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Одобрить
                      </button>
                      <Link to={`/posts/${post.id}`} className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-2">
                        Открыть
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Deletion requests */}
          {tab === 'deletions' && (
            <div className="space-y-3">
              {deletions.length === 0 ? (
                <EmptyState icon={<Trash2 className="w-8 h-8 text-slate-300" />} text="Нет заявок на удаление" />
              ) : deletions.map((req) => (
                <div key={req.id} className="card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{req.userFirstName} {req.userLastName}</p>
                        <p className="text-xs text-slate-400">{req.userEmail}</p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Запрошено: {new Date(req.requestedAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApproveDeletion(req.id)}
                      disabled={actionId === req.id}
                      className="btn-danger text-sm flex items-center gap-1.5 flex-shrink-0"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Подтвердить удаление
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div className="card overflow-hidden">
              {users.length === 0 ? (
                <div className="p-8"><EmptyState icon={<Users className="w-8 h-8 text-slate-300" />} text="Пользователей нет" /></div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Пользователь</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Роль</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Статус</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {u.firstName?.[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-800">{u.firstName} {u.lastName}</p>
                              <p className="text-slate-400 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${roleColor[u.role]}`}>
                            {roleLabel[u.role]}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {u.anonymized
                            ? <span className="text-xs text-slate-400">Анонимизирован</span>
                            : <span className="text-xs text-emerald-600">Активен</span>}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {!u.anonymized && (
                            <button
                              onClick={() => handleAnonymize(u.id)}
                              disabled={actionId === u.id}
                              className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5 ml-auto"
                            >
                              <EyeOff className="w-3 h-3" />
                              Анонимизировать
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Audit */}
          {tab === 'audit' && (
            <div className="card overflow-hidden">
              {audit.length === 0 ? (
                <div className="p-8"><EmptyState icon={<ScrollText className="w-8 h-8 text-slate-300" />} text="Журнал пуст" /></div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {audit.map((entry) => (
                    <div key={entry.id} className="px-5 py-3.5 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">{formatAction(entry.action)}</p>
                          {entry.details && <p className="text-xs text-slate-400 mt-0.5">{entry.details}</p>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString('ru-RU')}</p>
                        {entry.userId && <p className="text-xs text-slate-300 mt-0.5">uid: {entry.userId}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <BarChart2 className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value?.toLocaleString()}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  )
}

function EmptyState({ icon, text }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">{icon}</div>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  )
}

function formatAction(action) {
  const map = {
    USER_REGISTERED: 'Регистрация пользователя',
    USER_LOGIN: 'Вход в систему',
    POST_CREATED: 'Создание поста',
    POST_APPROVED: 'Одобрение поста',
    POST_REJECTED: 'Отклонение поста',
    POST_DELETED: 'Удаление поста',
    DATA_EXPORTED: 'Экспорт данных',
    DELETION_REQUESTED: 'Заявка на удаление',
    USER_ANONYMIZED: 'Анонимизация пользователя',
    AI_REQUEST: 'Запрос к AI',
  }
  return map[action] ?? action
}
