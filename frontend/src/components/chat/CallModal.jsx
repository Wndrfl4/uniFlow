import { useEffect, useRef } from 'react'
import { Phone, PhoneOff, PhoneMissed, Video, VideoOff, Mic, MicOff } from 'lucide-react'
import { useState } from 'react'

export default function CallModal({
  callState,       // calling | ringing | in_call
  incomingSignal,
  localStream,
  remoteStream,
  otherUserName,
  onAccept,
  onReject,
  onEnd,
}) {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => { t.enabled = muted; })
      setMuted(!muted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => { t.enabled = videoOff; })
      setVideoOff(!videoOff)
    }
  }

  const isAudioOnly = incomingSignal?.audioOnly ?? (localStream && localStream.getVideoTracks().length === 0)

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl mx-4">

        {/* Remote video (main) */}
        {callState === 'in_call' && !isAudioOnly ? (
          <div className="relative bg-slate-800 rounded-2xl overflow-hidden aspect-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Local video (pip) */}
            <div className="absolute bottom-4 right-4 w-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              {otherUserName?.[0]?.toUpperCase() ?? '?'}
            </div>
            <p className="text-white text-xl font-semibold">{otherUserName}</p>
            <p className="text-slate-400 text-sm mt-2">
              {callState === 'calling' && 'Вызов...'}
              {callState === 'ringing' && 'Входящий звонок'}
              {callState === 'in_call' && '🎤 Голосовой звонок'}
            </p>
            {callState === 'in_call' && (
              <audio ref={remoteVideoRef} autoPlay />
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {callState === 'ringing' ? (
            <>
              <button
                onClick={onReject}
                className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                title="Отклонить"
              >
                <PhoneMissed className="w-6 h-6" />
              </button>
              <button
                onClick={onAccept}
                className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors shadow-lg"
                title="Принять"
              >
                <Phone className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              {callState === 'in_call' && (
                <>
                  <button
                    onClick={toggleMute}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${muted ? 'bg-red-500' : 'bg-slate-600 hover:bg-slate-500'}`}
                    title={muted ? 'Включить микрофон' : 'Выключить микрофон'}
                  >
                    {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  {!isAudioOnly && (
                    <button
                      onClick={toggleVideo}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${videoOff ? 'bg-red-500' : 'bg-slate-600 hover:bg-slate-500'}`}
                      title={videoOff ? 'Включить камеру' : 'Выключить камеру'}
                    >
                      {videoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>
                  )}
                </>
              )}
              <button
                onClick={onEnd}
                className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                title="Завершить"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
