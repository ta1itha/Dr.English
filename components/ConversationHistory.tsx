'use client'

import { useEffect, useRef } from 'react'
import { ConversationTurn } from '@/lib/types'
import { GrammarPanel } from './GrammarPanel'

interface ConversationHistoryProps {
  turns: ConversationTurn[]
  liveTranscript: string
}

export function ConversationHistory({ turns, liveTranscript }: ConversationHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns, liveTranscript])

  if (turns.length === 0 && !liveTranscript) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-300 text-sm select-none">
        Your conversation will appear here
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
      {turns.map((turn) => (
        <div key={turn.id} className="space-y-2">
          {/* Doctor bubble (only when there's actual speech) */}
          {turn.doctorText && (
            <div className="flex justify-end">
              <div className="max-w-[82%]">
                <div className="bg-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wide">
                    You (Doctor)
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">{turn.doctorText}</p>
                </div>
                <GrammarPanel feedback={turn.grammarFeedback} />
              </div>
            </div>
          )}

          {/* Patient bubble */}
          <div className="flex justify-start">
            <div className="max-w-[82%] bg-teal-50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-teal-100">
              <p className="text-[10px] text-teal-500 font-semibold mb-1 uppercase tracking-wide">
                Patient
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">{turn.patientResponse}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Live interim transcript while recording */}
      {liveTranscript && (
        <div className="flex justify-end">
          <div className="max-w-[82%] bg-green-50 rounded-2xl rounded-tr-sm px-4 py-3 border border-green-200 border-dashed">
            <p className="text-[10px] text-green-500 font-semibold mb-1 uppercase tracking-wide">
              You (speaking...)
            </p>
            <p className="text-sm text-gray-500 italic">{liveTranscript}</p>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
