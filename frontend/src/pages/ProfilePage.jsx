import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import { User, Download, Trash2, EyeOff, ShieldCheck, AlertCircle, CheckCircle, Camera } from 'lucide-react'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef(null)
  const [deletionStatus, setDeletionStatus] = useState(null)
  const [loadingDeletion, setLoadingDeletion] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)
  const [loadingAnon, setLoadingAnon] = useState(false)
  const [message, setMessage] = useState(null)

  const flash = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleExport = async () => {
    setLoadingExport(true)
    try {
      const { data } = await client.get('/privacy/export')
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `uniflow-data-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      flash('Данные успешно экспортированы')
    } catch {
      flash('Ошибка при экспорте данных', 'error')
    } finally {
      setLoadingExport(false)
    }
  }

  const handleDeletionRequest = async () => {
    if (!confirm('Подать заявку на удаление аккаунта? Это действие необратимо.')) return
    setLoadingDeletion(true)
    try {
      const { data } = await client.post('/privacy/deletion-request')
      setDeletionStatus(data.status)
      flash('Заявка на удаление подана')
    } catch (err) {
      flash(err.response?.data?.message || 'Ошибка при подаче заявки', 'error')
    } finally {
      setLoadingDeletion(false)
    }
  }

  const handleCheckDeletion = async () => {
    setLoadingDeletion(true)
    try {
      const { data } = await client.get('/privacy/deletion-request')
      setDeletionStatus(data.status)
    } catch {
      flash('Заявки на удаление не найдено', 'error')
    } finally {
      setLoadingDeletion(false)
    }
  }

  const handleAnonymize = async () => {
    if (!confirm('Анонимизировать профиль? Ваши личные данные будут заменены.')) return
    setLoadingAnon(true)
    try {
      await client.post('/privacy/anonymize')
      flash('Профиль анонимизирован. Выполняется выход...')
      setTimeout(() => logout(), 2000)
    } catch (err) {
      flash(err.response?.data?.message || 'Ошибка при анонимизации', 'error')
    } finally {
      setLoadingAnon(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await client.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAvatarUrl(data.avatarUrl)
      flash('Аватар обновлён')
    } catch {
      flash('Ошибка при загрузке аватара', 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const roleLabel = { STUDENT: 'Студент', TEACHER: 'Преподаватель', ADMIN: 'Администратор' }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Профиль</h1>
        <p className="text-slate-400 text-sm mt-1">Управление аккаунтом и персональными данными</p>
      </div>

      {message && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
          message.type === 'error'
            ? 'bg-red-50 border-red-100 text-red-600'
            : 'bg-emerald-50 border-emerald-100 text-emerald-600'
        }`}>
          {message.type === 'error'
            ? <AlertCircle className="w-4 h-4 flex-shrink-0" />
            : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {message.text}
        </div>
      )}

      {/* User info */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-100">
                <User className="w-7 h-7 text-white" />
              </div>
            )}
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
              title="Сменить аватар"
            >
              <Camera className="w-3 h-3 text-slate-500" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-lg">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Роль" value={roleLabel[user?.role] ?? user?.role} />
          <InfoRow label="Email" value={user?.email} />
        </div>
      </div>

      {/* Privacy actions */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          Управление данными
        </h2>
        <div className="space-y-3">
          <ActionRow
            icon={<Download className="w-4 h-4" />}
            title="Экспорт данных"
            description="Скачать все ваши данные в формате JSON"
            action={handleExport}
            loading={loadingExport}
            btnLabel="Скачать"
            btnClass="btn-secondary"
          />

          <div className="border-t border-slate-100" />

          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Trash2 className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Удаление аккаунта</p>
                  <p className="text-xs text-slate-400 mt-0.5">Подать заявку на полное удаление ваших данных</p>
                  {deletionStatus && (
                    <span className={`inline-block text-xs font-medium mt-1.5 px-2.5 py-0.5 rounded-full border ${
                      deletionStatus === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : deletionStatus === 'PROCESSING'
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {deletionStatus === 'PENDING' ? 'Ожидает' : deletionStatus === 'PROCESSING' ? 'В обработке' : 'Выполнено'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {deletionStatus ? (
                  <button onClick={handleCheckDeletion} disabled={loadingDeletion} className="btn-secondary text-sm">
                    Обновить
                  </button>
                ) : (
                  <>
                    <button onClick={handleCheckDeletion} disabled={loadingDeletion} className="btn-secondary text-sm">
                      Статус
                    </button>
                    <button onClick={handleDeletionRequest} disabled={loadingDeletion} className="btn-danger text-sm">
                      Подать заявку
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          <ActionRow
            icon={<EyeOff className="w-4 h-4" />}
            title="Анонимизация профиля"
            description="Заменить личные данные на анонимные. Ваши посты сохранятся."
            action={handleAnonymize}
            loading={loadingAnon}
            btnLabel="Анонимизировать"
            btnClass="btn-danger"
            iconBg="bg-red-50"
            iconColor="text-red-500"
          />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl px-4 py-3">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  )
}

function ActionRow({ icon, title, description, action, loading, btnLabel, btnClass, iconBg = 'bg-blue-50', iconColor = 'text-blue-500' }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">{title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <button onClick={action} disabled={loading} className={`${btnClass} text-sm flex-shrink-0`}>
        {loading ? '...' : btnLabel}
      </button>
    </div>
  )
}
