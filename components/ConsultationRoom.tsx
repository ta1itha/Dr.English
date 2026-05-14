'use client'

import { useState, useCallback, useRef } from 'react'
import { AppPhase, PatientProfile, ConversationTurn, APIMessage, ChatResponse } from '@/lib/types'
import { PatientCard } from './PatientCard'
import { MicButton } from './MicButton'
import { ConversationHistory } from './ConversationHistory'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'

const INITIAL_GREETING = 'Hello doctor, how are you today?'

export function ConsultationRoom() {
  const [phase, setPhase] = useState<AppPhase>('idle')
  const [patient, setPatient] = useState<PatientProfile | null>(null)
  const [turns, setTurns] = useState<ConversationTurn[]>([])
  const [apiMessages, setApiMessages] = useState<APIMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  const { transcript, isListening, isSupported, startListening, stopListening } =
    useSpeechRecognition()
  const { isSpeaking, speak } = useSpeechSynthesis()

  // Ref so the mic callback always has the latest sendMessage
  const sendMessageRef = useRef<(text: string) => void>(() => {})

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!patient) return
      setPhase('processing')
      setError(null)

      const currentMessages = apiMessages

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: currentMessages,
            userMessage: userText,
            patient,
          }),
        })

        if (!res.ok) throw new Error('API error')
        const data: ChatResponse = await res.json()

        const newTurn: ConversationTurn = {
          id: Date.now().toString(),
          doctorText: userText,
          patientResponse: data.patientResponse,
          grammarFeedback: data.grammarFeedback,
          timestamp: new Date(),
        }

        setTurns((prev) => [...prev, newTurn])
        setApiMessages([
          ...currentMessages,
          { role: 'user', content: userText },
          { role: 'assistant', content: data.patientResponse },
        ])

        setPhase('speaking')
        speak(data.patientResponse, () => setPhase('ready'))
      } catch {
        setError('Something went wrong. Please try again.')
        setPhase('ready')
      }
    },
    [patient, apiMessages, speak],
  )

  // Keep ref current
  sendMessageRef.current = sendMessage

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening()
      return
    }
    if (phase !== 'ready') return

    setPhase('listening')
    startListening((finalTranscript) => {
      if (finalTranscript) {
        sendMessageRef.current(finalTranscript)
      } else {
        setPhase('ready')
      }
    })
  }, [isListening, phase, startListening, stopListening])

  const handleStartNewPatient = useCallback(async () => {
    setPhase('loading-patient')
    setError(null)
    setTurns([])

    try {
      const res = await fetch('/api/new-patient', { method: 'POST' })
      const data = await res.json()
      const newPatient: PatientProfile = data.patient
      setPatient(newPatient)

      // Seed conversation history with the greeting
      const greetingMessages: APIMessage[] = [
        { role: 'user', content: '[Session begins]' },
        { role: 'assistant', content: INITIAL_GREETING },
      ]
      setApiMessages(greetingMessages)

      // Show greeting as first turn (no doctor text)
      setTurns([
        {
          id: 'greeting',
          doctorText: null,
          patientResponse: INITIAL_GREETING,
          grammarFeedback: null,
          timestamp: new Date(),
        },
      ])

      setPhase('speaking')
      speak(INITIAL_GREETING, () => setPhase('ready'))
    } catch {
      setError('Could not load patient. Please try again.')
      setPhase('idle')
    }
  }, [speak])

  // --- Unsupported browser ---
  if (!isSupported) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-sm text-center">
          <p className="text-red-700 font-semibold">Speech recognition not supported</p>
          <p className="text-red-600 text-sm mt-2">
            Please open this app in Google Chrome or Microsoft Edge on a desktop device.
          </p>
        </div>
      </div>
    )
  }

  const isActive = phase !== 'idle' && phase !== 'loading-patient'
  const micDisabled = phase === 'speaking' || phase === 'processing' || phase === 'loading-patient'

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Dr. English</h1>
            <p className="text-xs text-gray-400">Medical consultation practice</p>
          </div>
          {phase === 'listening' && (
            <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
              Recording
            </span>
          )}
          {phase === 'speaking' && (
            <span className="flex items-center gap-1.5 text-xs text-teal-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse inline-block" />
              Patient speaking
            </span>
          )}
          {phase === 'processing' && (
            <span className="text-xs text-gray-400 font-medium">Analyzing...</span>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 overflow-hidden">
        {/* Patient card */}
        {patient && (
          <div className="pt-4 flex-shrink-0">
            <PatientCard
              patient={patient}
              onNewPatient={handleStartNewPatient}
              disabled={phase !== 'ready' && phase !== 'listening'}
            />
          </div>
        )}

        {/* Idle splash */}
        {phase === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-16">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-4xl">
                🩺
              </div>
              <h2 className="text-2xl font-semibold text-gray-700">Welcome, Doctor</h2>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Practice your medical English through realistic patient consultations with gentle
                grammar coaching.
              </p>
            </div>
            <button
              onClick={handleStartNewPatient}
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm"
            >
              Start New Patient
            </button>
          </div>
        )}

        {/* Loading spinner */}
        {phase === 'loading-patient' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-10 h-10 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 text-sm">Finding your next patient...</p>
            </div>
          </div>
        )}

        {/* Active consultation */}
        {isActive && (
          <>
            <ConversationHistory
              turns={turns}
              liveTranscript={isListening ? transcript : ''}
            />

            {/* Error banner */}
            {error && (
              <div className="flex-shrink-0 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600 mb-2">
                {error}
              </div>
            )}

            {/* Mic control */}
            <div className="flex-shrink-0 py-6 flex justify-center">
              <MicButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                isProcessing={phase === 'processing'}
                isDisabled={micDisabled}
                onClick={handleMicClick}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
