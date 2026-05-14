export type AppPhase =
  | 'idle'
  | 'loading-patient'
  | 'speaking'
  | 'ready'
  | 'listening'
  | 'processing'

export interface PatientProfile {
  name: string
  age: number
  occupation: string
  mainCondition: string
  symptoms: string[]
  lifestyle: {
    diet: string
    sleep: string
    stress: string
    exercise: string
  }
  personalityTrait: string
  backstory: string
}

export interface GrammarFeedback {
  hasIssues: boolean
  feedback: string
  suggestions: string[]
  improvedVersion: string
}

export interface ConversationTurn {
  id: string
  doctorText: string | null
  patientResponse: string
  grammarFeedback: GrammarFeedback | null
  timestamp: Date
}

export interface APIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  patientResponse: string
  grammarFeedback: GrammarFeedback | null
  error?: string
}
