import type { Condition } from "./types"

export type CardId = "c1" | "c2" | "c3" | "c4"

export type Task = {
  condition: Condition
  title: string
  prompt: string
  cards: { id: CardId; label: string }[]
  correct: CardId[]
}

export const TASKS: Record<Condition, Task> = {
  A: {
    condition: "A",
    title: "Situation A: Abstract condition",
    prompt:
      "You are shown a set of four cards placed on a table, each of which has a number on one side and a color on the other. The visible faces of the cards show 3, 8, blue, and red. Which card(s) must you turn over in order to test the rule that if a card shows an even number on one face, then its opposite face is blue?",
    cards: [
      { id: "c1", label: "8" },
      { id: "c2", label: "3" },
      { id: "c3", label: "blue" },
      { id: "c4", label: "red" },
    ],
    // Correct selection: 8 and red
    correct: ["c1", "c4"],
  },

  B: {
    condition: "B",
    title: "Situation B: Familiar context",
    prompt:
      "You are shown a set of four cards placed on a table, each of which has a person’s drink on one side and that person’s age on the other. The visible faces of the cards show Beer, Soda, 22, and 16. Which card(s) must you turn over in order to test the rule that if a person is drinking beer, then they must be 21 or older?",
    cards: [
      { id: "c1", label: "Beer" },
      { id: "c2", label: "Soda" },
      { id: "c3", label: "22" },
      { id: "c4", label: "16" },
    ],
    // Correct selection: Beer and 16
    correct: ["c1", "c4"],
  },

  C: {
    condition: "C",
    title: "Situation C: Unfamiliar context",
    prompt:
      "You are shown a set of four cards placed on a table, each of which has a technician’s current location on one side and whether they are wearing a required badge on the other. The visible faces of the cards show Oxygen module, Gym module, Seal-check badge, and No seal-check badge. Which card(s) must you turn over in order to test the rule that if a technician enters the oxygen module, then they must wear a seal-check badge?",
    cards: [
      { id: "c1", label: "Oxygen module" },
      { id: "c2", label: "Gym module" },
      { id: "c3", label: "Seal-check badge" },
      { id: "c4", label: "No seal-check badge" },
    ],
    // Correct selection: Enters oxygen module and Not wearing seal-check badge
    correct: ["c1", "c4"],
  },
}
