'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseSpeechRecognitionReturn {
  transcript: string
  isListening: boolean
  isSupported: boolean
  startListening: (onEnd: (finalTranscript: string) => void) => void
  stopListening: () => void
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const supported = !!(window.SpeechRecognition ?? window.webkitSpeechRecognition)
    setIsSupported(supported)
  }, [])

  const startListening = useCallback((onEnd: (finalTranscript: string) => void) => {
    if (typeof window === 'undefined') return
    const SpeechRecognitionAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    let finalText = ''

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      setTranscript(finalText + interim)
    }

    recognition.onend = () => {
      setIsListening(false)
      setTranscript('')
      onEnd(finalText.trim())
    }

    recognition.onerror = () => {
      setIsListening(false)
      setTranscript('')
      onEnd(finalText.trim())
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    setTranscript('')
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  return { transcript, isListening, isSupported, startListening, stopListening }
}
