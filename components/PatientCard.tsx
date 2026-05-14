import { PatientProfile } from '@/lib/types'

interface PatientCardProps {
  patient: PatientProfile
  onNewPatient: () => void
  disabled?: boolean
}

export function PatientCard({ patient, onNewPatient, disabled }: PatientCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{patient.name}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {patient.age} years old &middot; {patient.occupation}
          </p>
        </div>
        <button
          onClick={onNewPatient}
          disabled={disabled}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          New Patient
        </button>
      </div>

      <div className="space-y-2.5">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Chief Complaint
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{patient.mainCondition}</p>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Symptoms
          </p>
          <div className="flex flex-wrap gap-1.5">
            {patient.symptoms.map((symptom, i) => (
              <span
                key={i}
                className="text-xs bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-100"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
