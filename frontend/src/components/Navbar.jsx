import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'
import { BookOpen, Sparkles, LogOut, User, Shield, PenSquare, ChevronDown, MessageSquare } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  if (!user) return null

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">UniFlow</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Лента
            </Link>
            <Link
              to="/ai"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/ai') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </Link>
            <Link
              to="/messages"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/messages') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Чаты
            </Link>
            <Link
              to="/posts/create"
              className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2 ml-2"
            >
              <PenSquare className="w-3.5 h-3.5" />
              Написать
            </Link>
          </div>

          <NotificationBell />

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {user.email[0].toUpperCase()}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-slate-800 leading-none">
                  {user.email.split('@')[0]}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{user.role}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-slate-50 mb-1">
                  <p className="text-xs text-slate-400">Вы вошли как</p>
                  <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Профиль
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    Администрирование
                  </Link>
                )}
                <hr className="my-1 border-slate-100" />
                <button
                  onClick={() => { setMenuOpen(false); handleLogout() }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
