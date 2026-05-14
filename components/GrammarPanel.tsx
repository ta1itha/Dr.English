import { GrammarFeedback } from '@/lib/types'

interface GrammarPanelProps {
  feedback: GrammarFeedback | null
}

export function GrammarPanel({ feedback }: GrammarPanelProps) {
  if (!feedback?.hasIssues) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-amber-500 text-sm">✏</span>
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
          Language Tip
        </p>
      </div>

      {feedback.feedback && (
        <p className="text-sm text-amber-900 leading-relaxed">{feedback.feedback}</p>
      )}

      {feedback.improvedVersion && (
        <div className="bg-white rounded-lg px-3 py-2 mt-2 border border-amber-100">
          <p className="text-[10px] text-gray-400 mb-0.5">More natural:</p>
          <p className="text-sm text-gray-700 italic">&ldquo;{feedback.improvedVersion}&rdquo;</p>
        </div>
      )}

      {feedback.suggestions.filter(Boolean).length > 0 && (
        <ul className="mt-2 space-y-1">
          {feedback.suggestions.filter(Boolean).map((s, i) => (
            <li key={i} className="text-xs text-amber-700">
              &bull; {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
