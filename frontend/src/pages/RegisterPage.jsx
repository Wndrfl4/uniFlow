import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Eye, EyeOff, Check, X } from 'lucide-react'

const roles = [
  { value: 'STUDENT', label: 'Студент' },
  { value: 'TEACHER', label: 'Преподаватель' },
]

function usePasswordStrength(password) {
  const checks = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit:     /\d/.test(password),
    special:   /[@$!%*?&_#^]/.test(password),
  }
  const passed = Object.values(checks).filter(Boolean).length
  const strength = passed <= 2 ? 'weak' : passed <= 4 ? 'medium' : 'strong'
  return { checks, strength, valid: passed === 5 }
}

const checkLabels = {
  length:    'Минимум 8 символов',
  uppercase: 'Заглавная буква (A-Z)',
  lowercase: 'Строчная буква (a-z)',
  digit:     'Цифра (0-9)',
  special:   'Спецсимвол (@$!%*?&_#^)',
}

const strengthConfig = {
  weak:   { label: 'Слабый', cls: 'bg-red-400', w: 'w-1/3' },
  medium: { label: 'Средний', cls: 'bg-amber-400', w: 'w-2/3' },
  strong: { label: 'Надёжный', cls: 'bg-emerald-500', w: 'w-full' },
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', role: 'STUDENT',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showChecks, setShowChecks] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const { checks, strength, valid } = usePasswordStrength(form.password)
  const sc = strengthConfig[strength]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setFieldErrors(data.errors)
      } else {
        setError(data?.message || 'Ошибка при регистрации')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 mb-5 shadow-lg shadow-blue-100">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Создать аккаунт</h1>
          <p className="text-slate-400 text-sm mt-1.5">Присоединяйтесь к UniFlow Blog</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Имя</label>
                <input type="text" className={`input ${fieldErrors.firstName ? 'border-red-300' : ''}`}
                  placeholder="Иван" value={form.firstName} onChange={set('firstName')} required />
                {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Фамилия</label>
                <input type="text" className={`input ${fieldErrors.lastName ? 'border-red-300' : ''}`}
                  placeholder="Петров" value={form.lastName} onChange={set('lastName')} required />
                {fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" className={`input ${fieldErrors.email ? 'border-red-300' : ''}`}
                placeholder="your@university.edu" value={form.email} onChange={set('email')} required />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input pr-10 ${fieldErrors.password ? 'border-red-300' : ''}`}
                  placeholder="Минимум 8 символов"
                  value={form.password}
                  onChange={set('password')}
                  onFocus={() => setShowChecks(true)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 mr-2">
                      <div className={`h-full rounded-full transition-all ${sc.cls} ${sc.w}`} />
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">{sc.label}</span>
                  </div>
                </div>
              )}

              {/* Password requirements */}
              {showChecks && form.password && (
                <div className="mt-2 space-y-1 p-3 bg-slate-50 rounded-xl">
                  {Object.entries(checks).map(([key, ok]) => (
                    <div key={key} className={`flex items-center gap-2 text-xs ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {ok ? <Check className="w-3 h-3 flex-shrink-0" /> : <X className="w-3 h-3 flex-shrink-0" />}
                      {checkLabels[key]}
                    </div>
                  ))}
                </div>
              )}
              {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Роль</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                      form.role === r.value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading || !valid} className="btn-primary w-full flex justify-center mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Регистрация...
                </span>
              ) : 'Создать аккаунт'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
