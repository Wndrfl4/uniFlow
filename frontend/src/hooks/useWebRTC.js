import { useState, useRef, useCallback } from 'react'

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

export function useWebRTC({ sendCallSignal }) {
  const [callState, setCallState] = useState('idle') // idle | calling | ringing | in_call
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [incomingSignal, setIncomingSignal] = useState(null)
  const pcRef = useRef(null)
  const localStreamRef = useRef(null)

  const cleanup = useCallback(() => {
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null
    }
    setLocalStream(null)
    setRemoteStream(null)
  }, [])

  const createPC = useCallback((targetUserId) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        sendCallSignal({ targetUserId, type: 'ICE_CANDIDATE', payload: JSON.stringify(e.candidate) })
      }
    }
    pc.ontrack = (e) => setRemoteStream(e.streams[0])
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        cleanup()
        setCallState('idle')
      }
    }
    return pc
  }, [sendCallSignal, cleanup])

  const startCall = useCallback(async (targetUserId, audioOnly = false) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: !audioOnly })
      setLocalStream(stream)
      localStreamRef.current = stream

      const pc = createPC(targetUserId)
      pcRef.current = pc
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      sendCallSignal({ targetUserId, type: 'OFFER', payload: JSON.stringify(offer), audioOnly })
      setCallState('calling')
    } catch (err) {
      console.error('Failed to start call:', err)
      cleanup()
    }
  }, [createPC, sendCallSignal, cleanup])

  const acceptCall = useCallback(async () => {
    if (!incomingSignal) return
    try {
      const audioOnly = incomingSignal.audioOnly ?? false
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: !audioOnly })
      setLocalStream(stream)
      localStreamRef.current = stream

      const pc = createPC(incomingSignal.fromUserId)
      pcRef.current = pc
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))

      await pc.setRemoteDescription(JSON.parse(incomingSignal.payload))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      sendCallSignal({ targetUserId: incomingSignal.fromUserId, type: 'ANSWER', payload: JSON.stringify(answer) })
      setIncomingSignal(null)
      setCallState('in_call')
    } catch (err) {
      console.error('Failed to accept call:', err)
      cleanup()
    }
  }, [incomingSignal, createPC, sendCallSignal, cleanup])

  const rejectCall = useCallback(() => {
    if (incomingSignal) {
      sendCallSignal({ targetUserId: incomingSignal.fromUserId, type: 'CALL_END', payload: null })
    }
    setIncomingSignal(null)
    setCallState('idle')
  }, [incomingSignal, sendCallSignal])

  const endCall = useCallback((targetUserId) => {
    sendCallSignal({ targetUserId, type: 'CALL_END', payload: null })
    cleanup()
    setCallState('idle')
  }, [sendCallSignal, cleanup])

  const handleSignal = useCallback(async (signal) => {
    switch (signal.type) {
      case 'OFFER':
        setIncomingSignal(signal)
        setCallState('ringing')
        break
      case 'ANSWER':
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(JSON.parse(signal.payload))
          setCallState('in_call')
        }
        break
      case 'ICE_CANDIDATE':
        if (pcRef.current && signal.payload) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(JSON.parse(signal.payload)))
          } catch (e) {}
        }
        break
      case 'CALL_END':
        cleanup()
        setCallState('idle')
        setIncomingSignal(null)
        break
    }
  }, [cleanup])

  return {
    callState, localStream, remoteStream, incomingSignal,
    startCall, acceptCall, rejectCall, endCall, handleSignal,
  }
}
