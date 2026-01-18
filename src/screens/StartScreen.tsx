import { useState } from "react"
import { Modal } from "../components/Modal"

type Props = {
  onStart: () => void
  alreadyCompleted: boolean
}

export function StartScreen({ onStart, alreadyCompleted }: Props) {
  const [consent, setConsent] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)

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
            Your task is to decide{" "}
            <span className="font-medium text-slate-800">
              which card or cards you would turn over
            </span>{" "}
            to check whether the rule is being followed. There are no trick questions,
            and no special background knowledge is required.
          </p>

          <p>
            Please work carefully but intuitively, and respond as you think is best.
            The task usually takes only a few minutes.
          </p>
        </div>

        {/* Consent block */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">Data use & consent</h2>

            <button
              type="button"
              onClick={() => setShowDataModal(true)}
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              What is stored?
            </button>
          </div>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            By participating, you consent to the collection and use of your responses
            for research purposes within this study. No directly identifying information
            (such as name or email) is collected. All data will be permanently deleted
            at the end of the study. You may stop at any time by closing the tab.
          </p>

          <label className="mt-3 flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={alreadyCompleted}
            />
            <span className="text-sm text-slate-700">
              I have read the information above and I consent to participate.
            </span>
          </label>
        </div>

        <Modal
          open={showDataModal}
          title="What data is stored?"
          onClose={() => setShowDataModal(false)}
        >
          <div className="space-y-3">
            <p className="text-slate-700">
              This study stores only the information needed to analyze performance on the task.
              The dataset does not contain your name, email, or other direct identifiers.
            </p>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stored variables
              </div>
              <ul className="mt-2 list-disc pl-5 text-slate-700">
                <li>Card selections (final selection and selection changes)</li>
                <li>Time to submit your answer</li>
                <li>Your confidence rating (0–100)</li>
                <li>Background information (age and education)</li>
                <li>Basic device metadata (browser user-agent, screen size, time zone) for quality control</li>
              </ul>
            </div>

            <p className="text-slate-600">
              You can stop at any time by closing the tab.
            </p>
          </div>
        </Modal>

        {alreadyCompleted ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            You have already completed this study on this device/browser. Thank you!
          </div>
        ) : null}

        <button
          className={[
            "mt-6 w-full rounded-xl py-3 text-white text-lg font-medium transition",
            consent && !alreadyCompleted
              ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              : "bg-slate-400 cursor-not-allowed",
          ].join(" ")}
          type="button"
          onClick={onStart}
          disabled={!consent || alreadyCompleted}
        >
          Start
        </button>
      </div>
    </div>
  )
}
