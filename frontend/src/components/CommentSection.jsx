import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import { MessageCircle, Send, Trash2, User } from 'lucide-react'

export default function CommentSection({ postId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    client.get(`/posts/${postId}/comments`)
      .then((r) => setComments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const { data } = await client.post(`/posts/${postId}/comments`, { content: text.trim() })
      setComments((prev) => [...prev, data])
      setText('')
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await client.delete(`/comments/${id}`)
      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-blue-500" />
        Комментарии {comments.length > 0 && `(${comments.length})`}
      </h3>

      {loading ? (
        <p className="text-xs text-slate-400">Загрузка...</p>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.length === 0 && (
            <p className="text-sm text-slate-400">Комментариев пока нет. Будьте первым!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex-shrink-0">
                {c.authorAvatarUrl ? (
                  <img src={c.authorAvatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-xs font-semibold">
                    {c.authorName?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-slate-50 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-700">{c.authorName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {(user?.id === c.authorId) && (
                        <button onClick={() => handleDelete(c.id)} className="text-slate-300 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-shrink-0">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-semibold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Написать комментарий..."
            className="input flex-1 py-2 text-sm"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="btn-primary px-3 py-2 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
