import { useMemo, useState } from "react"
import type { SessionState } from "./types"
import { makeLocalUserId, shuffle } from "./random"

import { StartScreen } from "./screens/StartScreen"
import { TaskScreen } from "./screens/TaskScreen"
import { GradeScreen } from "./screens/GradeScreen"
import { DataScreen } from "./screens/DataScreen"
import { EndScreen } from "./screens/EndScreen"

import { TASKS, type CardId } from "./tasks"

import { DebugPanel } from "./components/DebugPanel"

import { ensureAnonAuth, writeSessionResult } from "./api"
import { hasCompleted, markCompleted } from "./completion"

import { fetchBalancedCondition } from "./assignCondition"

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
    // sessionId: makeSessionId(),
    condition: null,
    screen: "start",

    taskStartMs: null,
    taskSubmitMs: null,

    cardOrder: [],
    firstCardSelected: null,
    selectionChanges: 0,
    finalSelection: [],
    correct: null,

    confidence: null,

    // sex: null,
    age: null,
    degree: null,

    isSaving: false,
    saveError: null,
  }
}

export default function App() {
  const initial = useMemo(() => makeFreshSession(), [])
  const [session, setSession] = useState<SessionState>(initial)

  const [isStarting, setIsStarting] = useState(false)
  const task = session.condition ? TASKS[session.condition] : null

  async function start() {
    try {
      setIsStarting(true)
      await ensureAnonAuth()

      const condition = await fetchBalancedCondition()
      const ids = TASKS[condition].cards.map((c) => c.id)

      setSession((s) => ({
        ...s,
        condition,
        screen: "task",
        taskStartMs: performance.now(),
        cardOrder: shuffle(ids),
        firstCardSelected: null,
        selectionChanges: 0,
        finalSelection: [],
        correct: null,
        taskSubmitMs: null,
        confidence: null,
        isSaving: false,
        saveError: null,
      }))
    } catch (err: any) {
      setSession((s) => ({ ...s, saveError: err?.message ?? "Start failed." }))
    } finally {
      setIsStarting(false)
    }
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
      if (!s.condition) return s // or throw, but returning is safest

      const submitMs = performance.now()
      if (!s.condition) return s
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

  // async function submitData(data: { sex: string; age: number; degree: string }) {
  async function submitData(data: { age: number; degree: string }) {
    const snapshot = session

    setSession((s) => ({
      ...s,
      isSaving: true,
      saveError: null,
      // sex: data.sex,
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

      // const userId = await ensureAnonAuth()

      await ensureAnonAuth()

      if (
        snapshot.condition == null ||
        snapshot.taskStartMs == null ||
        snapshot.taskSubmitMs == null ||
        snapshot.correct == null ||
        snapshot.confidence == null
      ) {
        throw new Error("Missing task data; cannot save.")
      }

      await writeSessionResult({
        // session_id: snapshot.sessionId,
        // user_id: userId,
        experiment_id: "kogsys_wason_v1",
        condition: snapshot.condition,

        task_start_ms: snapshot.taskStartMs,
        task_submit_ms: snapshot.taskSubmitMs,
        selection_changes: snapshot.selectionChanges,
        first_card_selected: snapshot.firstCardSelected,
        final_selection: snapshot.finalSelection,
        correct: snapshot.correct,
        confidence: snapshot.confidence,

        // sex: data.sex,
        age: data.age,
        degree: data.degree,

        user_agent: navigator.userAgent,
        screen_w: window.innerWidth,
        screen_h: window.innerHeight,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })

      markCompleted()

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

  if (session.screen === "start")
    return (
      <StartScreen
        onStart={start}
        alreadyCompleted={hasCompleted()}
        isStarting={isStarting}
        error={session.saveError}
      />
    )

  if (session.screen === "task") {
    if (!task) return null
    return (
      <TaskScreen
        task={task}
        order={session.cardOrder.length ? session.cardOrder : task.cards.map((c) => c.id)}
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
