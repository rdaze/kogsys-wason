const KEY = "kogsys_completed_v1"

export function hasCompleted(): boolean {
  return localStorage.getItem(KEY) === "true"
}

export function markCompleted(): void {
  localStorage.setItem(KEY, "true")
}

export function clearCompleted(): void {
  localStorage.removeItem(KEY)
}
