import { useState } from "react"

type Props = {
  onSubmit: (confidence: number) => void | Promise<void>
  disabled?: boolean
  error?: string | null
}

export function GradeScreen({ onSubmit, disabled, error }: Props) {
  const [confidence, setConfidence] = useState(50)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold text-slate-900">
          Confidence
        </h2>
        <p className="mt-2 text-slate-600">
          How confident are you in your answer?
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">0</span>
            <span className="text-sm font-medium text-slate-900">{confidence}</span>
            <span className="text-sm text-slate-600">100</span>
          </div>

          <input
            className="mt-2 w-full"
            type="range"
            min={0}
            max={100}
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
          />
        </div>

        <button
          className={[
            "mt-6 w-full rounded-xl py-3 text-white text-lg font-medium transition",
            disabled
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
          ].join(" ")}
          type="button"
          disabled={disabled}
          onClick={() => onSubmit(confidence)}
        >
          {disabled ? "Saving…" : "Submit"}
        </button>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

      </div>
    </div>
  )
}
