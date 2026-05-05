import { Link } from 'react-router-dom'
import { Clock, User, Heart, MessageCircle } from 'lucide-react'

const statusConfig = {
  PUBLISHED:      { label: 'Опубликован', cls: 'bg-emerald-50 text-emerald-600' },
  PENDING_REVIEW: { label: 'На проверке', cls: 'bg-amber-50 text-amber-600' },
  REJECTED:       { label: 'Отклонён',    cls: 'bg-red-50 text-red-500' },
}

const TAG_THEME_MAP = {
  // IT
  python: 'blue', git: 'blue', github: 'blue', it: 'blue',
  'программалау': 'blue', 'веб': 'blue', react: 'blue', java: 'blue',
  // Medicine
  'медицина': 'rose', 'анатомия': 'rose', 'клиника': 'rose',
  'практика': 'rose', 'дәрігер': 'rose',
  // Law
  'заңтану': 'amber', 'сот': 'amber', 'конституция': 'amber',
  'азаматтық': 'amber', 'ҚР': 'amber',
  // Economics
  'экономика': 'emerald', 'инфляция': 'emerald', 'стартап': 'emerald',
  'бизнес': 'emerald', 'финанс': 'emerald', 'кәсіпкер': 'emerald',
  // Engineering
  'инженерия': 'orange', autocad: 'orange', 'сызба': 'orange', bim: 'orange',
  // Pedagogy
  'педагогика': 'purple', 'оқыту': 'purple', 'технология': 'purple', 'мұғалім': 'purple',
  // Architecture
  'сәулет': 'teal', revit: 'teal',
}

const THEMES = {
  blue:    { bar: 'bg-blue-500',    tag: 'bg-blue-50 text-blue-600',    glow: 'hover:shadow-blue-100/60' },
  rose:    { bar: 'bg-rose-500',    tag: 'bg-rose-50 text-rose-600',    glow: 'hover:shadow-rose-100/60' },
  amber:   { bar: 'bg-amber-500',   tag: 'bg-amber-50 text-amber-600',  glow: 'hover:shadow-amber-100/60' },
  emerald: { bar: 'bg-emerald-500', tag: 'bg-emerald-50 text-emerald-600', glow: 'hover:shadow-emerald-100/60' },
  orange:  { bar: 'bg-orange-500',  tag: 'bg-orange-50 text-orange-600', glow: 'hover:shadow-orange-100/60' },
  purple:  { bar: 'bg-purple-500',  tag: 'bg-purple-50 text-purple-600', glow: 'hover:shadow-purple-100/60' },
  teal:    { bar: 'bg-teal-500',    tag: 'bg-teal-50 text-teal-600',    glow: 'hover:shadow-teal-100/60' },
  default: { bar: 'bg-slate-200',   tag: 'bg-slate-50 text-slate-500',  glow: 'hover:shadow-slate-100/60' },
}

function getTheme(tags) {
  if (!tags?.length) return THEMES.default
  for (const tag of tags) {
    const key = TAG_THEME_MAP[tag.toLowerCase()] || TAG_THEME_MAP[tag]
    if (key) return THEMES[key]
  }
  return THEMES.default
}

export default function PostCard({ post, showStatus = false }) {
  const status = statusConfig[post.status]
  const theme = getTheme(post.tags)
  const date = new Date(post.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })

  return (
    <Link to={`/posts/${post.id}`} className="block h-full group">
      <div className={`card h-full flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${theme.glow} relative`}>

        {/* Цветная полоска сверху */}
        <div className={`h-1 w-full ${theme.bar} flex-shrink-0`} />

        <div className="p-6 flex flex-col flex-1">
          {showStatus && status && (
            <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${status.cls}`}>
              {status.label}
            </span>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${theme.tag}`}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-semibold text-slate-900 text-base mb-2 leading-snug line-clamp-2 group-hover:text-slate-700 transition-colors">
            {post.title}
          </h3>

          <p className="text-slate-500 text-sm flex-1 leading-relaxed line-clamp-3">
            {post.content}
          </p>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              {post.authorAvatarUrl ? (
                <img src={post.authorAvatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${theme.bar}`}>
                  {post.authorName?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="truncate max-w-[90px]">{post.authorName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className={`w-3.5 h-3.5 ${post.likedByCurrentUser ? 'fill-red-400 text-red-400' : ''}`} />
                {post.likeCount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {post.commentCount ?? 0}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
