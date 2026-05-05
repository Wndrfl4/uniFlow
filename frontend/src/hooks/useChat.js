import { useState, useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function useChat() {
  const [connected, setConnected] = useState(false)
  const stompRef = useRef(null)
  const callHandlerRef = useRef(null)
  const messageHandlerRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const stomp = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true)
        stomp.subscribe('/user/queue/messages', (frame) => {
          const msg = JSON.parse(frame.body)
          if (messageHandlerRef.current) messageHandlerRef.current(msg)
        })
        stomp.subscribe('/user/queue/call', (frame) => {
          const signal = JSON.parse(frame.body)
          if (callHandlerRef.current) callHandlerRef.current(signal)
        })
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error('STOMP error', frame),
    })
    stomp.activate()
    stompRef.current = stomp
    return () => stomp.deactivate()
  }, [])

  const sendMessage = useCallback((request) => {
    stompRef.current?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(request),
    })
  }, [])

  const sendCallSignal = useCallback((signal) => {
    stompRef.current?.publish({
      destination: '/app/call.signal',
      body: JSON.stringify(signal),
    })
  }, [])

  const onMessage = useCallback((handler) => {
    messageHandlerRef.current = handler
  }, [])

  const onCallSignal = useCallback((handler) => {
    callHandlerRef.current = handler
  }, [])

  return { connected, sendMessage, sendCallSignal, onMessage, onCallSignal }
}
