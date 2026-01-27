import { supabase } from "./supabase"
import type { Condition } from "./tasks"

export async function fetchBalancedCondition(): Promise<Condition> {
  // Ensure auth exists (anonymous is fine)
  const { data: sess } = await supabase.auth.getSession()
  if (!sess.session) throw new Error("Missing auth session")

  const { data, error } = await supabase.functions.invoke("assign-condition", {
    body: {},
  })

  if (error) {
    console.error("Edge function error:", error)
    throw new Error("Failed to assign condition")
  }

  return data.condition as Condition
}
