import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import Spinner from '../components/Spinner'
import CommentSection from '../components/CommentSection'
import { ArrowLeft, Clock, User, Pencil, Trash2, CheckCircle, XCircle, Heart } from 'lucide-react'

const statusConfig = {
  PUBLISHED:      { label: 'Опубликован', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  PENDING_REVIEW: { label: 'На проверке', cls: 'bg-amber-50 text-amber-600 border-amber-100' },
  REJECTED:       { label: 'Отклонён',    cls: 'bg-red-50 text-red-500 border-red-100' },
}

export default function PostDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    client.get(`/posts/${id}`)
      .then((r) => setPost(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    if (!confirm('Удалить пост?')) return
    await client.delete(`/posts/${id}`)
    navigate('/')
  }

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      const { data } = await client.put(`/posts/${id}/approve`)
      setPost(data)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const { data } = await client.put(`/posts/${id}/reject`, { reason: rejectReason })
      setPost(data)
      setShowRejectForm(false)
    } finally {
      setActionLoading(false)
    }
  }

  const handleLike = async () => {
    setLikeLoading(true)
    try {
      const { data } = await client.post(`/posts/${id}/like`)
      setPost(data)
    } finally {
      setLikeLoading(false)
    }
  }

  if (loading) return <Spinner />
  if (!post) return null

  const isAuthor = user?.id === post.authorId
  const isAdmin = user?.role === 'ADMIN'
  const canEdit = isAuthor && post.status !== 'PUBLISHED'
  const status = statusConfig[post.status]
  const date = new Date(post.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Назад к ленте
      </Link>

      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${status.cls}`}>
            {status.label}
          </span>
          <div className="flex items-center gap-2">
            {canEdit && (
              <Link to={`/posts/${id}/edit`} className="btn-secondary text-sm flex items-center gap-1.5 px-4 py-2">
                <Pencil className="w-3.5 h-3.5" />
                Редактировать
              </Link>
            )}
            {(isAuthor || isAdmin) && (
              <button onClick={handleDelete} className="btn-danger text-sm flex items-center gap-1.5 px-4 py-2">
                <Trash2 className="w-3.5 h-3.5" />
                Удалить
              </button>
            )}
          </div>
        </div>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-500 px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-2xl font-bold text-slate-900 mb-4 leading-snug">{post.title}</h1>

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              {post.authorAvatarUrl ? (
                <img src={post.authorAvatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>
          {post.status === 'PUBLISHED' && (
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-all ${
                post.likedByCurrentUser
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-current' : ''}`} />
              {post.likeCount ?? 0}
            </button>
          )}
        </div>

        {post.status === 'REJECTED' && post.rejectionReason && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-red-600 mb-1">Причина отклонения</p>
            <p className="text-sm text-red-500">{post.rejectionReason}</p>
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Admin moderation */}
        {isAdmin && post.status === 'PENDING_REVIEW' && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700 mb-3">Модерация</p>
            {!showRejectForm ? (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Одобрить
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="btn-danger flex items-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Отклонить
                </button>
              </div>
            ) : (
              <form onSubmit={handleReject} className="space-y-3">
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Укажите причину отклонения..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={actionLoading} className="btn-danger text-sm">
                    Отклонить
                  </button>
                  <button type="button" onClick={() => setShowRejectForm(false)} className="btn-secondary text-sm">
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {post.status === 'PUBLISHED' && <CommentSection postId={post.id} />}
      </div>
    </div>
  )
}
