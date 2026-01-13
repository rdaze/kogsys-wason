import { useMemo, useState } from "react"
import type { SessionState } from "./types"
import { makeLocalUserId, pickRandomCondition } from "./random"

import { StartScreen } from "./screens/StartScreen"
import { TaskScreen } from "./screens/TaskScreen"
import { GradeScreen } from "./screens/GradeScreen"
import { DataScreen } from "./screens/DataScreen"
import { EndScreen } from "./screens/EndScreen"

import { TASKS, type CardId } from "./tasks"

import { DebugPanel } from "./components/DebugPanel"

import { ensureAnonAuth, writeSessionResult } from "./api"
import { makeSessionId } from "./random"

const SHOW_DEBUG = false

function sameSet(a: CardId[], b: CardId[]) {
  if (a.length !== b.length) return false
  const A = new Set(a)
  for (const x of b) if (!A.has(x)) return false
  return true
}

function makeFreshSession(): SessionState {
  return {
    userId: makeLocalUserId(),
    sessionId: makeSessionId(),
    condition: pickRandomCondition(),
    screen: "start",

    taskStartMs: null,
    taskSubmitMs: null,

    firstCardSelected: null,
    selectionChanges: 0,
    finalSelection: [],
    correct: null,

    confidence: null,

    sex: null,
    age: null,
    degree: null,

    isSaving: false,
    saveError: null,
  }
}

export default function App() {
  const initial = useMemo(() => makeFreshSession(), [])
  const [session, setSession] = useState<SessionState>(initial)

  const task = TASKS[session.condition]

  async function start() {
    await ensureAnonAuth()

    setSession((s) => ({
      ...s,
      screen: "task",
      taskStartMs: performance.now(),

      firstCardSelected: null,
      selectionChanges: 0,
      finalSelection: [],
      correct: null,
      taskSubmitMs: null,
      confidence: null,
      isSaving: false,
      saveError: null,
    }))
  }

  function toggleCard(cardId: CardId) {
    setSession((s) => {
      const isSelected = s.finalSelection.includes(cardId)
      const nextSelection = isSelected
        ? s.finalSelection.filter((x) => x !== cardId)
        : [...s.finalSelection, cardId]

      return {
        ...s,
        firstCardSelected: s.firstCardSelected ?? cardId,
        selectionChanges: s.selectionChanges + 1,
        finalSelection: nextSelection,
      }
    })
  }

  function submitTask() {
    setSession((s) => {
      const submitMs = performance.now()
      const correct = sameSet(s.finalSelection, TASKS[s.condition].correct)

      return {
        ...s,
        screen: "grade",
        taskSubmitMs: submitMs,
        correct,
      }
    })
  }

  async function submitGrade(confidence: number) {
    setSession((s) => ({
      ...s,
      confidence,
      screen: "data",
      saveError: null,
    }))
  }

  async function submitData(data: { sex: string; age: number; degree: string }) {
    const snapshot = session

    setSession((s) => ({
      ...s,
      isSaving: true,
      saveError: null,
      sex: data.sex,
      age: data.age,
      degree: data.degree,
    }))

    try {
      if (
        snapshot.taskStartMs == null ||
        snapshot.taskSubmitMs == null ||
        snapshot.correct == null ||
        snapshot.confidence == null
      ) {
        throw new Error("Missing task data; cannot save.")
      }

      const userId = await ensureAnonAuth()

      await writeSessionResult({
        session_id: snapshot.sessionId,
        experiment_id: "kogsys_wason_v1",
        user_id: userId,
        condition: snapshot.condition,

        task_start_ms: snapshot.taskStartMs,
        task_submit_ms: snapshot.taskSubmitMs,
        selection_changes: snapshot.selectionChanges,
        first_card_selected: snapshot.firstCardSelected,
        final_selection: snapshot.finalSelection,
        correct: snapshot.correct,
        confidence: snapshot.confidence,

        sex: data.sex,
        age: data.age,
        degree: data.degree,

        user_agent: navigator.userAgent,
        screen_w: window.innerWidth,
        screen_h: window.innerHeight,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })

      setSession((s) => ({ ...s, isSaving: false, screen: "end" }))
    } catch (err: any) {
      setSession((s) => ({
        ...s,
        isSaving: false,
        saveError: err?.message ?? "Save failed. Please try again.",
      }))
    }
  }


  function restart() {
    // new condition each run, but keep local userId stable
    const userId = session.userId
    const fresh = makeFreshSession()
    setSession({ ...fresh, userId })
  }

  if (session.screen === "start") return <StartScreen onStart={start} />

  if (session.screen === "task") {
    return (
      <TaskScreen
        task={task}
        selected={session.finalSelection}
        onToggle={toggleCard}
        onSubmit={submitTask}
        debug={
          SHOW_DEBUG ? (
            <DebugPanel
              condition={session.condition}
              firstCardSelected={session.firstCardSelected}
              selectionChanges={session.selectionChanges}
              finalSelection={session.finalSelection}
              taskStartMs={session.taskStartMs}
              taskSubmitMs={session.taskSubmitMs}
              correct={session.correct}
              confidence={session.confidence}
            />
          ) : null
        }
      />
    )
  }

  if (session.screen === "grade") {
    return (
      <GradeScreen
        onSubmit={submitGrade}
        disabled={session.isSaving}
        error={session.saveError}
      />
    )
  }

  if (session.screen === "data") {
  return (
    <DataScreen
      onSubmit={submitData}
      disabled={session.isSaving}
      error={session.saveError}
    />
  )
}

  return (
    <EndScreen
      onRestart={restart}
      debug={
        SHOW_DEBUG ? (
          <DebugPanel
            condition={session.condition}
            firstCardSelected={session.firstCardSelected}
            selectionChanges={session.selectionChanges}
            finalSelection={session.finalSelection}
            taskStartMs={session.taskStartMs}
            taskSubmitMs={session.taskSubmitMs}
            correct={session.correct}
            confidence={session.confidence}
          />
        ) : null
      }
    />
  )

}
