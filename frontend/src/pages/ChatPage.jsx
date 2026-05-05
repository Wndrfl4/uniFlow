import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import Spinner from '../components/Spinner'
import VoiceRecorder from '../components/chat/VoiceRecorder'
import GifPicker from '../components/chat/GifPicker'
import StickerPicker from '../components/chat/StickerPicker'
import CallModal from '../components/chat/CallModal'
import { useChat } from '../hooks/useChat'
import { useWebRTC } from '../hooks/useWebRTC'
import {
  ArrowLeft, Send, Image, Smile,
  Phone, Video as VideoIcon,
} from 'lucide-react'

export default function ChatPage() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [otherUser, setOtherUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [showGif, setShowGif] = useState(false)
  const [showSticker, setShowSticker] = useState(false)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)

  const { connected, sendMessage, sendCallSignal, onMessage, onCallSignal } = useChat()
  const webrtc = useWebRTC({ sendCallSignal })

  // Route incoming messages to state
  useEffect(() => {
    onMessage((msg) => {
      const isRelevant = (
        (msg.senderId === parseInt(userId) && msg.receiverId === user.id) ||
        (msg.senderId === user.id && msg.receiverId === parseInt(userId))
      )
      if (isRelevant) {
        setMessages((prev) => [...prev, msg])
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }, [userId, user.id, onMessage])

  // Route incoming call signals
  useEffect(() => {
    onCallSignal(webrtc.handleSignal)
  }, [onCallSignal, webrtc.handleSignal])

  // Load history and other user info
  useEffect(() => {
    setLoading(true)
    Promise.all([
      client.get(`/messages/${userId}`),
      client.get(`/messages/users/search?q=`),
    ]).then(([msgRes, usersRes]) => {
      setMessages(msgRes.data)
      const found = usersRes.data.find((u) => u.id === parseInt(userId))
      setOtherUser(found ?? null)
      client.put(`/messages/${userId}/read`).catch(() => {})
    }).catch(() => {}).finally(() => {
      setLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView(), 50)
    })
  }, [userId])

  const send = useCallback((request) => {
    sendMessage({ receiverId: parseInt(userId), ...request })
  }, [sendMessage, userId])

  const handleText = () => {
    if (!text.trim()) return
    send({ content: text, type: 'TEXT' })
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleText() }
  }

  const handleFileUpload = async (file, type) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await client.post('/messages/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      send({ content: file.name, type, fileUrl: data.url })
    } catch {
      alert('Ошибка загрузки файла')
    } finally {
      setUploading(false)
    }
  }

  const handleVoiceSend = (blob) => {
    handleFileUpload(new File([blob], 'voice.webm', { type: 'audio/webm' }), 'VOICE')
  }

  const handleFilePick = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const type = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE'
    handleFileUpload(file, type)
    e.target.value = ''
  }

  const handleGif = (url) => send({ content: null, type: 'GIF', fileUrl: url })
  const handleSticker = (emoji) => send({ content: emoji, type: 'STICKER' })

  const otherName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : `Пользователь #${userId}`

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-5rem)]">

      {/* Call modal */}
      {webrtc.callState !== 'idle' && (
        <CallModal
          callState={webrtc.callState}
          incomingSignal={webrtc.incomingSignal}
          localStream={webrtc.localStream}
          remoteStream={webrtc.remoteStream}
          otherUserName={webrtc.incomingSignal?.fromUserName ?? otherName}
          onAccept={webrtc.acceptCall}
          onReject={webrtc.rejectCall}
          onEnd={() => webrtc.endCall(parseInt(userId))}
        />
      )}

      {/* Header */}
      <div className="card px-4 py-3 flex items-center gap-3 flex-shrink-0 mb-3">
        <Link to="/messages" className="text-slate-400 hover:text-slate-600 transition-colors mr-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {otherName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm">{otherName}</p>
          <p className="text-xs text-slate-400">{connected ? 'В сети' : 'Не в сети'}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => webrtc.startCall(parseInt(userId), true)}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            title="Голосовой звонок"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => webrtc.startCall(parseInt(userId), false)}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            title="Видеозвонок"
          >
            <VideoIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="card flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-slate-400 text-sm">Начните переписку с {otherName}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id ?? i} msg={msg} isOwn={msg.senderId === user.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="card mt-3 p-3 flex-shrink-0">
        <div className="relative flex items-end gap-2">
          {/* Media pickers */}
          <div className="relative flex-shrink-0">
            {showSticker && (
              <StickerPicker onSelect={handleSticker} onClose={() => setShowSticker(false)} />
            )}
            {showGif && (
              <GifPicker onSelect={handleGif} onClose={() => setShowGif(false)} />
            )}
          </div>

          {/* Left toolbar */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => { setShowSticker(!showSticker); setShowGif(false) }}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              title="Стикеры"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => { setShowGif(!showGif); setShowSticker(false) }}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              title="GIF"
            >
              <span className="text-xs font-bold">GIF</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              title="Фото / Видео"
              disabled={uploading}
            >
              <Image className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFilePick}
            />
            <VoiceRecorder onSend={handleVoiceSend} />
          </div>

          {/* Text input */}
          <textarea
            className="flex-1 resize-none input py-2.5 min-h-[44px] max-h-32"
            rows={1}
            placeholder="Сообщение..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Send */}
          <button
            type="button"
            onClick={handleText}
            disabled={!text.trim() || !connected}
            className="btn-primary p-2.5 flex-shrink-0 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {uploading && (
          <p className="text-xs text-slate-400 mt-2 text-center">Загрузка файла...</p>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ msg, isOwn }) {
  const time = new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  const renderContent = () => {
    switch (msg.type) {
      case 'IMAGE':
        return (
          <a href={msg.fileUrl} target="_blank" rel="noreferrer">
            <img src={msg.fileUrl} alt="img" className="max-w-[240px] rounded-xl cursor-pointer hover:opacity-90" />
          </a>
        )
      case 'VIDEO':
        return (
          <video src={msg.fileUrl} controls className="max-w-[240px] rounded-xl" />
        )
      case 'VOICE':
        return <audio src={msg.fileUrl} controls className="max-w-[220px]" />
      case 'GIF':
        return <img src={msg.fileUrl} alt="gif" className="max-w-[200px] rounded-xl" />
      case 'STICKER':
        return <span className="text-5xl leading-none">{msg.content}</span>
      default:
        return (
          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
        )
    }
  }

  const isMedia = ['IMAGE', 'VIDEO', 'GIF', 'STICKER'].includes(msg.type)

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`
          max-w-[70%] rounded-2xl px-3 py-2
          ${isMedia ? 'bg-transparent p-0' : isOwn
            ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-br-sm'
            : 'bg-white border border-slate-100 text-slate-900 rounded-bl-sm shadow-sm'}
        `}
      >
        {renderContent()}
        <p className={`text-[10px] mt-1 text-right ${isOwn && !isMedia ? 'text-white/60' : 'text-slate-400'}`}>
          {time}
        </p>
      </div>
    </div>
  )
}
