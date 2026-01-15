import type { CardId } from "./tasks"

export type Condition = "A" | "B" | "C"
export type Screen = "start" | "task" | "grade" | "data" | "end"

export interface SessionState {
  userId: string
  sessionId: string
  condition: Condition
  screen: Screen

  taskStartMs: number | null
  taskSubmitMs: number | null

  cardOrder: CardId[] // visual order for rendering
  firstCardSelected: CardId | null
  selectionChanges: number
  finalSelection: CardId[]
  correct: boolean | null

  confidence: number | null // 0–100

  isSaving: boolean
  saveError: string | null

  sex: string | null
  age: number | null
  degree: string | null
}
