import { useState, useRef } from 'react'
import { Mic, Square, Send, X } from 'lucide-react'

export default function VoiceRecorder({ onSend, onCancel }) {
  const [state, setState] = useState('idle') // idle | recording | preview
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const mediaRef = useRef(null)
  const timerRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        setState('preview')
        stream.getTracks().forEach((t) => t.stop())
      }
      recorder.start()
      mediaRef.current = recorder
      setState('recording')
      setDuration(0)
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch {
      alert('Нет доступа к микрофону')
    }
  }

  const stopRecording = () => {
    clearInterval(timerRef.current)
    mediaRef.current?.stop()
  }

  const cancel = () => {
    clearInterval(timerRef.current)
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.stream?.getTracks().forEach((t) => t.stop())
      mediaRef.current.stop()
    }
    setAudioUrl(null)
    setAudioBlob(null)
    setState('idle')
    onCancel?.()
  }

  const send = () => {
    if (audioBlob) onSend(audioBlob)
    cancel()
  }

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={startRecording}
        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
        title="Голосовое сообщение"
      >
        <Mic className="w-5 h-5" />
      </button>
    )
  }

  if (state === 'recording') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-medium text-red-600">{fmt(duration)}</span>
        <button type="button" onClick={stopRecording} className="ml-auto text-red-600 hover:text-red-700">
          <Square className="w-4 h-4 fill-current" />
        </button>
        <button type="button" onClick={cancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
      <audio src={audioUrl} controls className="h-8 max-w-[160px]" />
      <button type="button" onClick={send} className="text-blue-600 hover:text-blue-700">
        <Send className="w-4 h-4" />
      </button>
      <button type="button" onClick={cancel} className="text-slate-400 hover:text-slate-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
