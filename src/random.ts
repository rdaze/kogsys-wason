import type { Condition } from "./types"

export function pickRandomCondition(): Condition {
  const r = Math.random()
  if (r < 1 / 3) return "A"
  if (r < 2 / 3) return "B"
  return "C"
}

// Simple stable-ish id for now (we’ll replace with Firebase anonymous auth later)
export function makeLocalUserId(): string {
  const key = "kogsys_user_id"
  const existing = localStorage.getItem(key)
  if (existing) return existing

  const newId =
    "u_" +
    crypto.getRandomValues(new Uint32Array(4)).join("_") +
    "_" +
    Date.now().toString(36)

  localStorage.setItem(key, newId)
  return newId
}

export function makeSessionId(): string {
  return "s_" + crypto.getRandomValues(new Uint32Array(4)).join("_") + "_" + Date.now().toString(36)
}

// Fisher-Yates shuffle
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
