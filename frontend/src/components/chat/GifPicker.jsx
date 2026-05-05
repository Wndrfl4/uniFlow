import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

const GIPHY_KEY = 'dc6zaTOxFJmzC'

export default function GifPicker({ onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const [gifs, setGifs] = useState([])
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef(null)

  const search = async (q) => {
    setLoading(true)
    try {
      const endpoint = q.trim()
        ? `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(q)}&limit=24&rating=g&api_key=${GIPHY_KEY}`
        : `https://api.giphy.com/v1/gifs/trending?limit=24&rating=g&api_key=${GIPHY_KEY}`
      const res = await fetch(endpoint)
      const data = await res.json()
      setGifs(data.data ?? [])
    } catch {
      setGifs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { search('') }, [])

  const handleInput = (val) => {
    setQuery(val)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => search(val), 400)
  }

  return (
    <div className="absolute bottom-full mb-2 left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-slate-100">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          autoFocus
          className="flex-1 text-sm outline-none placeholder-slate-400"
          placeholder="Поиск GIF..."
          value={query}
          onChange={(e) => handleInput(e.target.value)}
        />
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-64 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                onClick={() => { onSelect(gif.images.fixed_height_small.url); onClose() }}
                className="rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
              >
                <img
                  src={gif.images.fixed_height_small.url}
                  alt={gif.title}
                  className="w-full h-20 object-cover"
                  loading="lazy"
                />
              </button>
            ))}
            {!loading && gifs.length === 0 && (
              <p className="col-span-3 text-center text-sm text-slate-400 py-8">Ничего не найдено</p>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-xs text-slate-300 py-1.5">Powered by GIPHY</p>
    </div>
  )
}
