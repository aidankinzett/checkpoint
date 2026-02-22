import type { Achievement } from '../types'

export const CATEGORIES = ['Story', 'Completion', 'Challenges', 'Combat & Skills', 'Exploration']

export const achievements: Achievement[] = [
  // ── Story (10) ── All story-related, cannot be missed ──

  { id: 'rhino_rodeo', name: 'Rhino Rodeo', desc: 'Ride Rhino through the shopping mall.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Ride Rhino through the shopping mall during the opening mission.' },
  { id: 'hanging_by_a_thread', name: 'Hanging by a Thread', desc: 'Keep the bridge together.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Keep the bridge together during the story.' },
  { id: 'the_core_of_the_problem', name: 'The Core of the Problem', desc: 'Investigate the underground lab.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Investigate Roxxon\'s underground lab.' },
  { id: 'true_deception', name: 'True Deception', desc: 'Complete the vault sequence.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Complete the vault sequence during Underground Undercover.' },
  { id: 'the_harlem_express', name: 'The Harlem Express', desc: 'Get the trains running again.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Get the trains running again.' },
  { id: 'veloci_skates', name: 'Veloci-Skates', desc: 'Chase the Tinkerer through the city.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Chase the Tinkerer through the city.' },
  { id: 'shared_history', name: 'Shared History', desc: 'Walk through Miles and Phin\'s past.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Walk through Miles and Phin\'s past.' },
  { id: 'exploding_bulldozer', name: 'Exploding Bulldozer', desc: 'Defeat Roxxon Rhino.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Defeat Roxxon Rhino.' },
  { id: 'family_drama', name: 'Family Drama', desc: 'Defeat Prowler.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Defeat Prowler.' },
  { id: 'ultimate_sacrifice', name: 'Ultimate Sacrifice', desc: 'Save Harlem.', tier: 'bronze', category: 'Story', secret: true, guide: 'Story related, cannot be missed. Save Harlem.' },

  // ── Completion (12) ──

  { id: 'just_the_beginning', name: 'Just the Beginning', desc: 'Unlock all Skills.', tier: 'gold', category: 'Completion', guide: 'Unlock all 33 Skills. You need 24 skill points from leveling up to max level 24 and 9 from Spider-Training Challenges. The last skill in each of the 3 skill trees is only available in New Game Plus.' },
  { id: 'a_new_home', name: 'A New Home', desc: '100% complete all districts.', tier: 'gold', category: 'Completion', guide: '100% complete all districts. Complete all activities on the map including challenges, FNSM requests, underground caches, hideouts, labs, missions, postcards, time capsules, and sound samples.' },
  { id: 'urban_explorers', name: 'Urban Explorers', desc: 'Collect all Time Capsules.', tier: 'silver', category: 'Completion', guide: 'Collect all 16 Time Capsules. They are marked on the map after progressing through the story.' },
  { id: 'memory_lane', name: 'Memory Lane', desc: 'Collect all Postcards.', tier: 'silver', category: 'Completion', guide: 'Collect all 8 Postcards. Available after story completion via a side mission at Miles\' home.' },
  { id: 'salvager', name: 'Salvager', desc: 'Open all Underground Caches.', tier: 'silver', category: 'Completion', guide: 'Open all 35 Underground Caches scattered across the map. They contain suit parts and upgrade materials.' },
  { id: 'under_their_noses', name: 'Under Their Noses', desc: 'Shut down all Roxxon Labs.', tier: 'silver', category: 'Completion', guide: 'Shut down all 3 Roxxon Labs. They become available throughout the story and are marked on the map.' },
  { id: 'underground_undone', name: 'Underground Undone', desc: 'Shut down all Underground Hideouts.', tier: 'silver', category: 'Completion', guide: 'Shut down all 3 Underground Hideouts marked on the map.' },
  { id: 'ready_for_anything', name: 'Ready for Anything', desc: 'Collect all suits.', tier: 'silver', category: 'Completion', guide: 'Purchase all 19 suits through crafting and story progression.' },
  { id: 'come_at_the_king', name: 'Come at the King', desc: 'Unravel a criminal conspiracy in Harlem.', tier: 'silver', category: 'Completion', guide: 'Unravel a criminal conspiracy in Harlem by completing side quests, ultimately unlocking the \'We\'ve Got a Lead!\' mission.' },
  { id: 'deep_cuts', name: 'Deep Cuts', desc: 'Collect all Sound Samples.', tier: 'silver', category: 'Completion', guide: 'Collect all 10 Sound Samples to recreate the Davis Brothers Mix. The trophy may unlock after the 9th sample.' },
  { id: 'five_star_review', name: 'Five Star Review', desc: 'Complete all FNSM App requests.', tier: 'bronze', category: 'Completion', guide: 'Complete all FNSM App requests that appear throughout the story and open world.' },
  { id: 'crime_master', name: 'Crime Master', desc: 'Complete all Crimes.', tier: 'bronze', category: 'Completion', guide: 'Complete all random crime encounters across every district in the city.' },

  // ── Challenges (5) ──

  { id: 'spider_training_complete', name: 'Spider-Training: Complete', desc: 'Complete all Spider-Training challenges.', tier: 'bronze', category: 'Challenges', guide: 'Complete all 9 Spider-Training Challenges with any result. They\'re holographic challenges set up by Peter Parker.' },
  { id: 'petes_first_villain', name: 'Pete\'s First Villain', desc: 'Complete the Final Test mission.', tier: 'bronze', category: 'Challenges', guide: 'Complete the Final Test mission. This unlocks after beating all 9 Spider-Training Challenges.' },
  { id: 'launch_swing_and_dive', name: 'Launch, Swing and Dive', desc: 'Get Spectacular or better in a Traversal Challenge.', tier: 'bronze', category: 'Challenges', guide: 'Get Spectacular or better in a Spider-Training Traversal Challenge.' },
  { id: 'punching_pixels', name: 'Punching Pixels', desc: 'Get Spectacular or better in a Combat Challenge.', tier: 'bronze', category: 'Challenges', guide: 'Get Spectacular or better in a Spider-Training Combat Challenge.' },
  { id: 'dodging_light', name: 'Dodging Light', desc: 'Get Spectacular or better in a Stealth Challenge.', tier: 'bronze', category: 'Challenges', guide: 'Get Spectacular or better in a Spider-Training Stealth Challenge.' },

  // ── Combat & Skills (12) ──

  { id: 'never_saw_it_coming', name: 'Never Saw It Coming', desc: 'Clear an Enemy Base without being detected.', tier: 'silver', category: 'Combat & Skills', guide: 'Complete an Enemy Base without being detected. Use stealth takedowns and the Camouflage ability to remain hidden throughout.' },
  { id: '100x_combo', name: '100x Combo!!!', desc: 'Perform a 100-hit combo.', tier: 'silver', category: 'Combat & Skills', guide: 'Perform a 100-hit combo during combat. On easy difficulty your combo counter no longer resets when being hit, making this much easier.' },
  { id: 'from_the_rafters', name: 'From the Rafters', desc: 'Perform 25 Ceiling Takedowns.', tier: 'bronze', category: 'Combat & Skills', guide: 'Perform 25 Ceiling Takedowns by crawling on ceilings above enemies and pressing the takedown button.' },
  { id: 'climbing_the_walls', name: 'Climbing the Walls', desc: 'Perform 25 Wall Takedowns.', tier: 'bronze', category: 'Combat & Skills', guide: 'Perform 25 Wall Takedowns by crawling on walls near enemies.' },
  { id: 'invisible_spider', name: 'Invisible Spider', desc: 'Defeat 50 enemies while Camouflaged.', tier: 'bronze', category: 'Combat & Skills', guide: 'Defeat 50 enemies while Camouflaged. Activate Camouflage, take down one enemy, let it recharge, repeat.' },
  { id: 'overcharge', name: 'Overcharge', desc: 'Defeat 100 enemies with Venom attacks.', tier: 'bronze', category: 'Combat & Skills', guide: 'Defeat 100 enemies with Venom attacks. Requires a full Venom bar to use Venom abilities.' },
  { id: 'up_and_over', name: 'Up and Over', desc: 'Perform a Venom Jump then immediately a Venom Dash on an enemy.', tier: 'bronze', category: 'Combat & Skills', guide: 'Perform a Venom Jump (L1+X), then immediately a Venom Dash (L1+Triangle) on a single enemy.' },
  { id: 'from_downtown', name: 'From Downtown', desc: 'Use Venom Dash to throw an enemy into three or more enemies.', tier: 'bronze', category: 'Combat & Skills', guide: 'Use Venom Dash to throw an enemy into a group of three or more enemies.' },
  { id: 'nowhere_to_hide', name: 'Nowhere to Hide', desc: 'Perform 100 Stealth Takedowns.', tier: 'bronze', category: 'Combat & Skills', guide: 'Perform 100 Stealth Takedowns total without alerting enemies.' },
  { id: 'kitbash', name: 'Kitbash', desc: 'Craft 10 Upgrades.', tier: 'bronze', category: 'Combat & Skills', guide: 'Craft 10 Upgrades from the gadgets menu using Activity Tokens and Tech Parts.' },
  { id: 'trapped', name: 'Trapped', desc: 'Defeat 50 enemies with the Remote Mine gadget.', tier: 'bronze', category: 'Combat & Skills', guide: 'Defeat 50 enemies with the Remote Mine gadget.' },
  { id: 'like_a_rhino_in_a_china_shop', name: 'Like a Rhino in a China Shop', desc: 'Smash into 15 breakable objects while steering Rhino.', tier: 'bronze', category: 'Combat & Skills', guide: 'Smash into 15 breakable objects while steering Rhino through the shopping mall in the first mission.' },

  // ── Exploration (10) ──

  { id: 'best_fries_in_town', name: 'Best Fries in Town', desc: 'Pay respects to a legendary figure.', tier: 'bronze', category: 'Exploration', guide: 'Pay respects to the Stan Lee statue in the Upper West Side. Use Spider-Sense (R3) when nearby to find it.' },
  { id: 'jjj_would_be_proud', name: 'JJJ Would Be Proud', desc: 'Apply a sticker and customize lighting in Photo Mode.', tier: 'bronze', category: 'Exploration', guide: 'Apply a sticker and customize lighting while in Photo Mode.' },
  { id: 'mod_that_suit', name: 'Mod that Suit', desc: 'Craft a Suit Mod.', tier: 'bronze', category: 'Exploration', guide: 'Craft a Suit Mod in the Suits menu.' },
  { id: 'look_with_better_eyes', name: 'Look with Better Eyes', desc: 'Craft a Visor Mod.', tier: 'bronze', category: 'Exploration', guide: 'Craft a Visor Mod in the Suits menu.' },
  { id: 'never_give_up', name: 'Never Give Up', desc: 'Pay respects at a grave.', tier: 'bronze', category: 'Exploration', guide: 'Pay respects at Jefferson Davis\' grave in the Harlem cemetery. Available from the start of the game.' },
  { id: 'a_gift_from_pete', name: 'A Gift From Pete', desc: 'Receive a gift from Peter Parker.', tier: 'bronze', category: 'Exploration', secret: true, guide: 'Story related, cannot be missed. Receive the Gift Suit from Peter Parker during the Parting Gift mission.' },
  { id: 'competitive_spirit', name: 'Competitive Spirit', desc: 'Beat Phin at the rocket launch mini-game.', tier: 'bronze', category: 'Exploration', guide: 'Beat Phin at the rocket launch mini-game during the \'Like Real Scientists\' flashback.' },
  { id: 'im_on_a_boat', name: "I'm on a Boat", desc: 'Ride the derelict boat.', tier: 'bronze', category: 'Exploration', guide: 'Ride the derelict boat found at the southern Chinatown docks.' },
  { id: 'socially_acceptable', name: 'Socially Acceptable', desc: 'Scroll through the entire Social Feed.', tier: 'bronze', category: 'Exploration', guide: 'Scroll through the entire Social Feed at the end of the story after completing the main campaign.' },
  { id: 'plus_plus', name: 'Plus Plus', desc: 'Complete the game on New Game+.', tier: 'bronze', category: 'Exploration', guide: 'Complete the game on New Game+. Simply beat the story a second time. Expect it to take about 3 hours.' },
]
