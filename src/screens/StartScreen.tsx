type Props = {
  onStart: () => void
}

export function StartScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">
          Cognitive Systems Experiment
        </h1>

        <div className="mt-4 space-y-3 text-slate-600 leading-relaxed">
          <p>
            In this study, you will complete a short reasoning task involving a small
            set of cards and a rule that needs to be tested.
          </p>

          <p>
            Your task is to decide <span className="font-medium text-slate-800">
            which card or cards you would turn over</span> to check whether the rule
            is being followed. There are no trick questions, and no special background
            knowledge is required.
          </p>

          <p>
            Please work carefully but intuitively, and respond as you think is best.
            The task usually takes only a few minutes.
          </p>
        </div>

        <button
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-white text-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition"
          type="button"
          onClick={onStart}
        >
          Start
        </button>
      </div>
    </div>
  )
}
