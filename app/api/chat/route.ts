import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildPatientSystemPrompt } from '@/lib/prompts'
import { PatientProfile, APIMessage, ChatResponse } from '@/lib/types'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      messages,
      userMessage,
      patient,
    }: { messages: APIMessage[]; userMessage: string; patient: PatientProfile } = body

    const system = buildPatientSystemPrompt(patient)

    const allMessages: Anthropic.Messages.MessageParam[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system,
      messages: allMessages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      const result: ChatResponse = { patientResponse: text, grammarFeedback: null }
      return NextResponse.json(result)
    }

    const parsed = JSON.parse(jsonMatch[0])
    const result: ChatResponse = {
      patientResponse: parsed.patientResponse ?? text,
      grammarFeedback: parsed.grammarFeedback ?? null,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
