import type { TrackableItem } from '../types'

export const SUIT_CATEGORIES = ['Base Game', 'New Game+']

export const suits: TrackableItem[] = [
  // Base Game - Story unlocks
  { id: 'sportswear', name: 'Sportswear Suit', category: 'Base Game', description: 'Complete Parting Gift mission' },
  { id: 'great_responsibility', name: 'Great Responsibility Suit', category: 'Base Game', description: 'Complete Parting Gift mission' },
  { id: 'classic', name: 'Classic Suit', category: 'Base Game', description: 'Complete Time to Rally mission', details: { unlock: 'Complete Time to Rally mission', mod: 'Zap Slap' } },

  // Base Game - Level unlocks
  { id: 'homemade', name: 'Homemade Suit', category: 'Base Game', description: 'Level 5 — 8 Activity Tokens, 1 Tech Part', details: { unlock: 'Level 5 — 8 Activity Tokens, 1 Tech Part', mod: 'Power Pitcher' } },
  { id: 'track', name: 'T.R.A.C.K. Suit', category: 'Base Game', description: 'Level 6 — 10 Activity Tokens, 1 Tech Part', details: { unlock: 'Level 6 — 10 Activity Tokens, 1 Tech Part', mod: 'Untrackable' } },
  { id: 'animated', name: 'Animated Suit', category: 'Base Game', description: 'Level 7 — 14 Activity Tokens, 2 Tech Parts', details: { unlock: 'Level 7 — 14 Activity Tokens, 2 Tech Parts', mod: 'Stronger Webs' } },
  { id: 'brooklyn_visions', name: 'Brooklyn Visions Academy Suit', category: 'Base Game', description: 'Level 8 — 6 Activity Tokens, 1 Tech Part', details: { unlock: 'Level 8 — 6 Activity Tokens, 1 Tech Part', mod: 'Trick Master' } },
  { id: 'crimson_cowl', name: 'Crimson Cowl Suit', category: 'Base Game', description: 'Level 9 — 12 Activity Tokens, 2 Tech Parts', details: { unlock: 'Level 9 — 12 Activity Tokens, 2 Tech Parts', mod: 'Ghost Strike' } },
  { id: 'strike', name: 'S.T.R.I.K.E. Suit', category: 'Base Game', description: 'Level 10 — 16 Activity Tokens, 2 Tech Parts', details: { unlock: 'Level 10 — 16 Activity Tokens, 2 Tech Parts', mod: 'Venom Overclock' } },
  { id: 'the_end', name: 'The End Suit', category: 'Base Game', description: 'Level 11 — 14 Activity Tokens, 3 Tech Parts', details: { unlock: 'Level 11 — 14 Activity Tokens, 3 Tech Parts', mod: 'Steady Focus' } },
  { id: 'miles_2099', name: 'Miles Morales 2099 Suit', category: 'Base Game', description: 'Level 12 — 14 Activity Tokens, 3 Tech Parts', details: { unlock: 'Level 12 — 14 Activity Tokens, 3 Tech Parts', mod: 'Venom Suppression Resistance' } },
  { id: 'spider_verse', name: 'Into the Spider-Verse Suit', category: 'Base Game', description: 'Level 13 — 18 Activity Tokens, 4 Tech Parts', details: { unlock: 'Level 13 — 18 Activity Tokens, 4 Tech Parts', mod: 'Bam! Pow! Wham! / Vibe the Verse' } },

  // Base Game - Mission unlocks
  { id: 'uptown_pride', name: 'Uptown Pride Suit', category: 'Base Game', description: 'Complete all FNSM App activities' },
  { id: 'winter', name: 'Winter Suit', category: 'Base Game', description: "Complete We've Got a Lead! mission" },
  { id: 'miles_2020', name: 'Miles Morales 2020 Suit', category: 'Base Game', description: 'Complete Final Test mission' },
  { id: 'programmable_matter', name: 'Programmable Matter Suit', category: 'Base Game', description: 'Complete Matter Up mission' },
  { id: 'purple_reign', name: 'Purple Reign Suit', category: 'Base Game', description: 'Complete Back to the Beginning mission', details: { unlock: 'Complete Back to the Beginning mission', mod: 'Reclaimer' } },
  { id: 'bodega_cat', name: 'Bodega Cat Suit', category: 'Base Game', description: "Finish campaign, complete Cat's Pyjamas mission" },
  { id: 'advanced_tech', name: 'Advanced Tech Suit', category: 'Base Game', description: 'Available from start (PC update)' },

  // New Game+
  { id: 'spider_training', name: 'Spider-Training Suit', category: 'New Game+', description: 'New Game+ — 20 Activity Tokens, 1 Tech Part', details: { unlock: 'New Game+ — 20 Activity Tokens, 1 Tech Part', mod: 'Power Transfer' } },
]
