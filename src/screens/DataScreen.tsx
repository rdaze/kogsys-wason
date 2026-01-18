import { useState } from "react"

type Props = {
  onSubmit: (data: { sex: string; age: number; degree: string }) => void | Promise<void>
  disabled?: boolean
  error?: string | null
}

const DEGREE_OPTIONS = [
  "No formal qualification",
  "Lower secondary school certificate",
  "Intermediate secondary school certificate",
  "University entrance qualification (applied sciences)",
  "University entrance qualification (general)",
  "Completed vocational training",
  "Bachelor’s degree",
  "Master’s degree",
  "State examination",
  "Doctorate (PhD)",
  "Postdoctoral qualification",
  "Other",
] as const

export function DataScreen({ onSubmit, disabled, error }: Props) {
  const [sex, setSex] = useState<string>("Prefer not to say")
  const [age, setAge] = useState<string>("")
  const [degree, setDegree] = useState<string>(DEGREE_OPTIONS[0])

  const ageNum = Number(age)
  const ageValid = Number.isFinite(ageNum) && ageNum >= 13 && ageNum <= 120

  const canSubmit =
    !disabled &&
    ageValid &&
    degree.trim().length > 0 &&
    sex.trim().length > 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold text-slate-900">
          Background Information
        </h2>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          The following questions are used for research purposes only.
          Your responses are stored anonymously and cannot be used to
          identify you personally.
        </p>

      
        <div className="mt-6 space-y-4">

        {/* Biological sex
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Biological sex
            </label>
            <p className="mt-1 text-xs text-slate-500">
              This question refers to biological sex, not gender identity.
            </p>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2.5"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              disabled={disabled}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Intersex</option>
              <option>Prefer not to say</option>
            </select>
          </div> 
        */}

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Age
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5"
              type="number"
              inputMode="numeric"
              min={13}
              max={120}
              placeholder="e.g., 24"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={disabled}
            />
            {!ageValid && age.length > 0 && (
              <div className="mt-1 text-xs text-red-600">
                Please enter a valid age between 13 and 120.
              </div>
            )}
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Highest completed level of education
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              disabled={disabled}
            >
              {DEGREE_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className={[
            "mt-6 w-full rounded-xl py-3 text-white text-lg font-medium transition",
            canSubmit
              ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              : "bg-slate-400 cursor-not-allowed",
          ].join(" ")}
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit({ sex, age: ageNum, degree })}
        >
          {disabled ? "Saving…" : "Submit"}
        </button>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}