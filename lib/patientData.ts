import { PatientProfile } from './types'

// Used as fallback if the API call to generate a patient fails
export const FALLBACK_PATIENT: PatientProfile = {
  name: 'Sarah Mitchell',
  age: 38,
  occupation: 'Marketing Manager',
  mainCondition:
    "I've been feeling exhausted all the time and have terrible bloating after meals, especially in the afternoon.",
  symptoms: ['afternoon fatigue', 'bloating after meals', 'brain fog', 'sugar cravings'],
  lifestyle: {
    diet: 'I eat a lot of convenience foods. Coffee and a pastry for breakfast, usually a sandwich for lunch.',
    sleep:
      'About 6–7 hours but I wake up feeling tired. Sometimes I lie awake with racing thoughts.',
    stress: 'Quite high — tight deadlines at work and two young children at home.',
    exercise: 'I try to walk sometimes but I have no regular exercise routine.',
  },
  personalityTrait: 'I reach for sugary snacks when stressed and often skip meals when busy.',
  backstory:
    "I've always been healthy but started feeling this way about two years ago after a very stressful period at work. My regular doctor said all my tests are normal, but I still don't feel like myself. A friend recommended I try a holistic approach.",
}
