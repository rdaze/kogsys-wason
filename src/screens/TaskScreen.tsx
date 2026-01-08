import type { Task, CardId } from "../tasks"

type Props = {
  task: Task
  selected: CardId[]
  onToggle: (cardId: CardId) => void
  onSubmit: () => void
  debug?: React.ReactNode
}

function CardButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-6 text-left shadow-sm transition",
        "active:scale-[0.99]",
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
      aria-pressed={selected}
    >
      <div className="text-sm text-slate-500">Card</div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{label}</div>
      <div className="mt-3 text-sm text-slate-600">
        {selected ? "Selected" : "Click to select"}
      </div>
    </button>
  )
}

export function TaskScreen({ task, selected, onToggle, onSubmit, debug }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Task</h2>
              <p className="mt-1 text-slate-600">{task.title}</p>
            </div>

            <button
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 active:bg-blue-800 transition"
              type="button"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800">
            <p className="leading-relaxed">{task.prompt}</p>
            <p className="mt-3 text-sm text-slate-600">
              Select the card(s) you would turn over to test the rule.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {task.cards.map((c) => (
              <CardButton
                key={c.id}
                label={c.label}
                selected={selected.includes(c.id)}
                onClick={() => onToggle(c.id)}
              />
            ))}
          </div>

          <div className="mt-6 text-sm text-slate-600">
            Selected:{" "}
            <span className="font-medium text-slate-900">
              {selected.length ? selected.join(", ") : "none"}
            </span>
          </div>

          {debug}
        </div>
      </div>
    </div>
  )
}
