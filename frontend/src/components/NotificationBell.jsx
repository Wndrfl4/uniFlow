import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import client from '../api/client'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCount = () => {
      client.get('/notifications/unread-count')
        .then((r) => setUnread(r.data.count ?? 0))
        .catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = async () => {
    setOpen(!open)
    if (!open) {
      try {
        const { data } = await client.get('/notifications')
        setNotifications(data)
        if (unread > 0) {
          await client.post('/notifications/read-all')
          setUnread(0)
        }
      } catch {
        /* ignore */
      }
    }
  }

  const handleClick = (link) => {
    setOpen(false)
    if (link) navigate(link)
  }

  const typeIcon = { COMMENT: '💬', LIKE: '❤️', POST_APPROVED: '✅', POST_REJECTED: '❌' }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">Уведомления</p>
          </div>
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">Уведомлений нет</div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n.link)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!n.read ? 'bg-blue-50/40' : ''}`}
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{typeIcon[n.type] ?? '🔔'}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700 leading-snug">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
