import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import Spinner from '../components/Spinner'
import { ArrowLeft, Info } from 'lucide-react'

export default function CreatePostPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    client.get(`/posts/${id}`)
      .then((r) => setForm({ title: r.data.title, content: r.data.content }))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, isEdit, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await client.put(`/posts/${id}`, form)
      } else {
        const { data } = await client.post('/posts', form)
        navigate(`/posts/${data.id}`)
        return
      }
      navigate(`/posts/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? 'Редактировать пост' : 'Новый пост'}
        </h1>
      </div>

      {user?.role === 'STUDENT' && !isEdit && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-600">
            Ваш пост будет отправлен на проверку модератору и опубликован после одобрения.
          </p>
        </div>
      )}

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Заголовок</label>
            <input
              type="text"
              className="input text-base font-medium"
              placeholder="Введите заголовок поста..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              minLength={3}
              maxLength={255}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Содержание</label>
            <textarea
              className="input resize-none leading-relaxed"
              rows={14}
              placeholder="Напишите содержание поста..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              minLength={10}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </>
              ) : isEdit ? 'Сохранить изменения' : 'Опубликовать'}
            </button>
            <Link to={isEdit ? `/posts/${id}` : '/'} className="btn-secondary">
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
