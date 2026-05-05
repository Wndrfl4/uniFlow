import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import Spinner from '../components/Spinner'
import { Bot, Send, Zap, Clock, Sparkles, Cpu } from 'lucide-react'

const PROVIDER_COLORS = {
  gemini: 'text-blue-600 bg-blue-50 border-blue-200',
  groq: 'text-orange-600 bg-orange-50 border-orange-200',
  openrouter: 'text-purple-600 bg-purple-50 border-purple-200',
  mock: 'text-slate-500 bg-slate-50 border-slate-200',
}

export default function AiPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [remaining, setRemaining] = useState(null)
  const [providerInfo, setProviderInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [histRes, remRes, provRes] = await Promise.all([
          client.get('/ai/history?size=20&sort=createdAt,desc'),
          client.get('/ai/remaining'),
          client.get('/ai/providers'),
        ])
        setHistory(histRes.data.content ?? [])
        setRemaining(remRes.data.remaining)
        setProviderInfo(provRes.data)
      } catch {
        /* ignore */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || sending) return
    const text = prompt.trim()
    setPrompt('')
    setSending(true)
    setMessages((prev) => [...prev, { role: 'user', text }])
    try {
      const { data } = await client.post('/ai/ask', { prompt: text })
      setMessages((prev) => [...prev, {
        role: 'ai',
        text: data.response,
        cached: data.cached,
        provider: data.provider,
      }])
      if (remaining !== null) setRemaining((r) => Math.max(0, r - 1))
    } catch (err) {
      const msg = err.response?.data?.message || 'Произошла ошибка'
      setMessages((prev) => [...prev, { role: 'error', text: msg }])
    } finally {
      setSending(false)
    }
  }

  const limitLabel = () => {
    if (user?.role === 'ADMIN') return '∞'
    return remaining ?? '...'
  }

  if (loading) return <Spinner />

  const providerColor = PROVIDER_COLORS[providerInfo?.current] ?? PROVIDER_COLORS.mock

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            AI-ассистент
          </h1>
          <p className="text-slate-400 text-sm mt-1">Задайте вопрос и получите мгновенный ответ</p>
        </div>
        <div className="flex items-center gap-2">
          {providerInfo && (
            <div className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-medium ${providerColor}`}>
              <Cpu className="w-3.5 h-3.5" />
              {providerInfo.currentLabel}
            </div>
          )}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">
              {limitLabel()}
              {user?.role !== 'ADMIN' && <span className="text-slate-400 font-normal"> запр. осталось</span>}
              {user?.role === 'ADMIN' && <span className="text-slate-400 font-normal"> безлимитно</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="card mb-4 overflow-hidden flex flex-col" style={{ minHeight: '420px' }}>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-100">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <p className="text-slate-500 font-medium">Чем могу помочь?</p>
              <p className="text-slate-400 text-sm mt-1">Задайте любой вопрос по учёбе</p>
              {providerInfo?.current === 'mock' && (
                <p className="text-amber-600 text-xs mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-xs">
                  Работает в тестовом режиме. Настройте AI_PROVIDER в .env для реальных ответов.
                </p>
              )}
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatBubble key={i} msg={msg} />
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-100 p-4">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              className="input flex-1"
              placeholder="Введите вопрос..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !prompt.trim()}
              className="btn-primary px-4 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            История запросов
          </h2>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-1">{item.prompt}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{item.response}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString('ru-RU')}
                  </span>
                  {item.cached && (
                    <span className="text-xs text-violet-500 font-medium">из кэша</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ChatBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm leading-relaxed">{msg.text}</p>
        </div>
      </div>
    )
  }
  if (msg.role === 'error') {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-red-500" />
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm text-red-600 leading-relaxed">{msg.text}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
        <div className="flex items-center gap-2 mt-1">
          {msg.cached && (
            <span className="text-xs text-violet-500 font-medium">из кэша</span>
          )}
          {msg.provider && (
            <span className="text-xs text-slate-400">{msg.provider}</span>
          )}
        </div>
      </div>
    </div>
  )
}
