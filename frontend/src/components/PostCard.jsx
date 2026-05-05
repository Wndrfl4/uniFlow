import { Link } from 'react-router-dom'
import { Clock, User, Heart, MessageCircle } from 'lucide-react'

const statusConfig = {
  PUBLISHED:      { label: 'Опубликован', cls: 'bg-emerald-50 text-emerald-600' },
  PENDING_REVIEW: { label: 'На проверке', cls: 'bg-amber-50 text-amber-600' },
  REJECTED:       { label: 'Отклонён',    cls: 'bg-red-50 text-red-500' },
}

export default function PostCard({ post, showStatus = false }) {
  const status = statusConfig[post.status]
  const date = new Date(post.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })

  return (
    <Link to={`/posts/${post.id}`} className="block h-full">
      <div className="card p-6 h-full flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
        {showStatus && status && (
          <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${status.cls}`}>
            {status.label}
          </span>
        )}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-semibold text-slate-900 text-base mb-2 leading-snug" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm flex-1 leading-relaxed" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.content}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{post.authorName}</span>
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
    </Link>
  )
}
