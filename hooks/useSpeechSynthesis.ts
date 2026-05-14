'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean
  speak: (text: string, onEnd?: () => void) => void
  stop: () => void
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices())
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const voicesRef = useRef(voices)
  voicesRef.current = voices

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.()
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.92
    utterance.pitch = 1.05
    utterance.volume = 1.0

    // Prefer a natural-sounding English voice
    const available = voicesRef.current
    const preferred =
      available.find((v) => v.name === 'Samantha') ||
      available.find((v) => v.name.includes('Karen') || v.name.includes('Tessa')) ||
      available.find((v) => v.lang.startsWith('en') && v.localService) ||
      available.find((v) => v.lang.startsWith('en'))

    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      onEnd?.()
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      onEnd?.()
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  return { isSpeaking, speak, stop }
}
