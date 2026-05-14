interface MicButtonProps {
  isListening: boolean
  isSpeaking: boolean
  isProcessing: boolean
  isDisabled: boolean
  onClick: () => void
}

export function MicButton({
  isListening,
  isSpeaking,
  isProcessing,
  isDisabled,
  onClick,
}: MicButtonProps) {
  const getState = () => {
    if (isListening)
      return { label: 'Tap to stop', bg: 'bg-red-500 hover:bg-red-600', pulse: true }
    if (isSpeaking)
      return { label: 'Patient speaking...', bg: 'bg-blue-300 cursor-not-allowed', pulse: false }
    if (isProcessing)
      return { label: 'Analyzing...', bg: 'bg-gray-300 cursor-not-allowed', pulse: false }
    return { label: 'Tap to speak', bg: 'bg-teal-500 hover:bg-teal-600', pulse: false }
  }

  const state = getState()

  return (
    <div className="flex flex-col items-center gap-2.5">
      <button
        onClick={onClick}
        disabled={isDisabled}
        aria-label={state.label}
        className={[
          'w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-200',
          state.bg,
          isDisabled ? 'opacity-50 cursor-not-allowed' : '',
          state.pulse ? 'animate-pulse' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isListening ? (
          // Stop square
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          // Microphone
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm-1 21v-3.07A7 7 0 0 1 5 12H7a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.93V22h-2z" />
          </svg>
        )}
      </button>
      <p className="text-sm text-gray-500 font-medium select-none">{state.label}</p>
    </div>
  )
}
