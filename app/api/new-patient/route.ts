import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PATIENT_GENERATION_PROMPT } from '@/lib/prompts'
import { FALLBACK_PATIENT } from '@/lib/patientData'

const client = new Anthropic()

export async function POST() {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: PATIENT_GENERATION_PROMPT }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return NextResponse.json({ patient: FALLBACK_PATIENT })
    }

    const patient = JSON.parse(jsonMatch[0])
    return NextResponse.json({ patient })
  } catch (error) {
    console.error('Error generating patient:', error)
    return NextResponse.json({ patient: FALLBACK_PATIENT })
  }
}
