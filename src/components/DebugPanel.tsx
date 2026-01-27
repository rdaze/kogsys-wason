import type { CardId } from "../tasks"
import type { Condition } from "../types"

type Props = {
  condition: Condition | null
  firstCardSelected: CardId | null
  selectionChanges: number
  finalSelection: CardId[]
  taskStartMs: number | null
  taskSubmitMs: number | null
  correct: boolean | null
  confidence: number | null
}

function msToSeconds(ms: number | null) {
  if (ms == null) return null
  return Math.round((ms / 1000) * 100) / 100
}

export function DebugPanel(props: Props) {
  const elapsedMs =
    props.taskStartMs != null
      ? (props.taskSubmitMs ?? performance.now()) - props.taskStartMs
      : null

  const elapsedSec = msToSeconds(elapsedMs)

  return (
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-800">
      <div className="font-semibold text-slate-900">Debug</div>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <span className="text-slate-600">Condition:</span>{" "}
          <span className="font-medium">{props.condition}</span>
        </div>
        <div>
          <span className="text-slate-600">Elapsed (s):</span>{" "}
          <span className="font-medium">{elapsedSec ?? "—"}</span>
        </div>
        <div>
          <span className="text-slate-600">First selected:</span>{" "}
          <span className="font-medium">{props.firstCardSelected ?? "—"}</span>
        </div>
        <div>
          <span className="text-slate-600">Selection changes:</span>{" "}
          <span className="font-medium">{props.selectionChanges}</span>
        </div>
        <div className="sm:col-span-2">
          <span className="text-slate-600">Final selection:</span>{" "}
          <span className="font-medium">
            {props.finalSelection.length ? props.finalSelection.join(", ") : "—"}
          </span>
        </div>
        <div>
          <span className="text-slate-600">Correct:</span>{" "}
          <span className="font-medium">
            {props.correct == null ? "—" : props.correct ? "true" : "false"}
          </span>
        </div>
        <div>
          <span className="text-slate-600">Confidence:</span>{" "}
          <span className="font-medium">{props.confidence ?? "—"}</span>
        </div>
      </div>
    </div>
  )
}
