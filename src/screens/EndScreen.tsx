type Props = {
  onRestart: () => void
  debug?: React.ReactNode
}

export function EndScreen({ debug }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold text-slate-900">
          Debriefing
        </h2>

        <div className="mt-4 space-y-3 text-slate-600 leading-relaxed">
          <p className="text-slate-700">
            Thank you for participating.
          </p>

          <p>
            This task is a version of the <a
              href="https://en.wikipedia.org/wiki/Wason_selection_task"
              target="_blank"
              rel="noopener noreferrer"
              className="italic text-blue-600 hover:underline"
            >
              Wason Selection Task
            </a>
            , a classic experiment used to study how
            people reason about conditional rules (“if–then” statements).
          </p>

          <p>
            Previous research has shown that performance on this task can vary
            depending on whether the rule is presented in an abstract form (colors and numbers), a
            familiar real-world context (age and beer), or an unfamiliar but structured scenario (space-module and badge).
            All versions share the same underlying logical structure.
          </p>

          <p>
            The aim of this study is to better understand how contextual information
            influences reasoning strategies, independently of logical difficulty.
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center">
          <p className="text-slate-700 font-medium">
            You may now close this tab.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            If you have questions about this study, please contact
            <br />
            <span className="font-medium text-slate-700">
              [m_keller@stud.uni-bamberg.de]
            </span>
          </p>
        </div>

        {debug}
      </div>
    </div>
  )
}
