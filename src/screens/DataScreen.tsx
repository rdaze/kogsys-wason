import { useState } from "react"

type Props = {
  onSubmit: (data: { sex: string; age: number; degree: string }) => void | Promise<void>
  disabled?: boolean
  error?: string | null
}

const DEGREE_OPTIONS = [
  "Kein Abschluss",
  "Hauptschulabschluss",
  "Realschulabschluss / Mittlere Reife",
  "Fachhochschulreife",
  "Abitur / Allgemeine Hochschulreife",
  "Berufsausbildung (IHK/HWK)",
  "Bachelor",
  "Master",
  "Staatsexamen",
  "Promotion",
  "Habilitation",
  "Sonstiges",
] as const

export function DataScreen({ onSubmit, disabled, error }: Props) {
  const [sex, setSex] = useState<string>("Keine Angabe")
  const [age, setAge] = useState<string>("")
  const [degree, setDegree] = useState<string>(DEGREE_OPTIONS[0])

  const ageNum = Number(age)
  const ageValid = Number.isFinite(ageNum) && ageNum >= 13 && ageNum <= 120

  const canSubmit = !disabled && sex.trim().length > 0 && degree.trim().length > 0 && ageValid

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold text-slate-900">Demographics</h2>
        <p className="mt-2 text-slate-600">
          Please answer these background questions.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Sex</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              disabled={disabled}
            >
              <option>Weiblich</option>
              <option>Männlich</option>
              <option>Divers</option>
              <option>Keine Angabe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Age</label>
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
            {!ageValid && age.length > 0 ? (
              <div className="mt-1 text-xs text-red-600">Please enter an age between 13 and 120.</div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Highest degree</label>
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
            canSubmit ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800" : "bg-slate-400 cursor-not-allowed",
          ].join(" ")}
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit({ sex, age: ageNum, degree })}
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
