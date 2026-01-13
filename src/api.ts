import { supabase } from "./supabase"
import type { CardId } from "./tasks"
import type { Condition } from "./types"

export async function ensureAnonAuth(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.user?.id) return sessionData.session.user.id

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  if (!data.user?.id) throw new Error("Anonymous sign-in succeeded but no user id returned.")
  return data.user.id
} // signInAnonymously is the official JS method :contentReference[oaicite:5]{index=5}

export async function writeSessionResult(input: {
  session_id: string
  experiment_id: string
  user_id: string
  condition: Condition

  task_start_ms: number
  task_submit_ms: number
  selection_changes: number
  first_card_selected: CardId | null
  final_selection: CardId[]
  correct: boolean
  confidence: number

  sex: string
  age: number
  degree: string

  user_agent: string
  screen_w: number
  screen_h: number
  tz: string
}) {
  const { error } = await supabase.from("sessions").insert({
    ...input,
    // store as text[] in postgres
    final_selection: input.final_selection,
  })

  if (error) throw error
}