import type { TrackableItem } from '../types'

export const suits: TrackableItem[] = [
  // === BASE GAME — STORY UNLOCKS ===
  { id: "advanced", name: "Advanced Suit", category: "Base Game", description: "Story progression (Act 1)", details: { unlock: "Story progression (Act 1)", power: "Battle Focus \u2014 Continuously generates Focus for a short time." } },
  { id: "classic_damaged", name: "Classic Suit (Damaged)", category: "Base Game", description: "Default starting suit", details: { unlock: "Default starting suit" } },
  { id: "classic_repaired", name: "Classic Suit (Repaired)", category: "Base Game", description: "Story progression (Act 1)", details: { unlock: "Story progression (Act 1)", power: "Web Blossom \u2014 Leap into the air and web everything in sight." } },
  { id: "anti_ock", name: "Anti-Ock Suit", category: "Base Game", description: "Story progression (Act 3)", details: { unlock: "Story progression (Act 3)", power: "Resupply \u2014 Distributed nano-mesh continually refills current gadget's shots." } },

  // === BASE GAME — LEVEL-BASED ===
  { id: "noir", name: "Noir Suit", category: "Base Game", description: "Level 3 \u2014 1 Backpack Token, 1 Base Token", details: { unlock: "Level 3 \u2014 1 Backpack Token, 1 Base Token", power: "Sound of Silence \u2014 Enemies cannot call for backup." } },
  { id: "scarlet_spider", name: "Scarlet Spider Suit", category: "Base Game", description: "Level 4 \u2014 3 Crime Tokens", details: { unlock: "Level 4 \u2014 3 Crime Tokens", power: "Holo Decoy \u2014 Experimental AR tech spawns multiple Holo Decoys that distract enemies." } },
  { id: "spider_armor_mk2", name: "Spider-Armor MK II Suit", category: "Base Game", description: "Level 5 \u2014 1 Base Token, 1 Landmark Token", details: { unlock: "Level 5 \u2014 1 Base Token, 1 Landmark Token", power: "Bullet Proof \u2014 You are temporarily resistant to bullet damage." } },
  { id: "secret_war", name: "Secret War Suit", category: "Base Game", description: "Level 7 \u2014 2 Backpack Tokens, 1 Base Token", details: { unlock: "Level 7 \u2014 2 Backpack Tokens, 1 Base Token", power: "Arms Race \u2014 Stuns all nearby enemies with electric shocks." } },
  { id: "stark", name: "Stark Suit", category: "Base Game", description: "Level 9 \u2014 1 Base Token, 1 Research Token", details: { unlock: "Level 9 \u2014 1 Base Token, 1 Research Token", power: "Spider-Bro \u2014 Deploys a spider-drone that attacks enemies." } },
  { id: "negative", name: "Negative Suit", category: "Base Game", description: "Level 11 \u2014 1 Base Token, 1 Research Token", details: { unlock: "Level 11 \u2014 1 Base Token, 1 Research Token", power: "Negative Shockwave \u2014 Launches a massive wave of negative energy." } },
  { id: "electrically_insulated", name: "Electrically Insulated Suit", category: "Base Game", description: "Level 13 \u2014 1 Base Token, 1 Research Token", details: { unlock: "Level 13 \u2014 1 Base Token, 1 Research Token", power: "Electric Punch \u2014 Temporarily charges your fists with electricity." } },
  { id: "spider_punk", name: "Spider-Punk Suit", category: "Base Game", description: "Level 16 \u2014 2 Base Tokens, 3 Crime Tokens", details: { unlock: "Level 16 \u2014 2 Base Tokens, 3 Crime Tokens", power: "Rock Out \u2014 Blasts enemies with waves of righteous sound." } },
  { id: "wrestler", name: "Wrestler Suit", category: "Base Game", description: "Level 19 \u2014 2 Base Tokens, 2 Research Tokens", details: { unlock: "Level 19 \u2014 2 Base Tokens, 2 Research Tokens", power: "King of the Ring \u2014 Web-throws enemies without needing to web them first." } },
  { id: "fear_itself", name: "Fear Itself Suit", category: "Base Game", description: "Level 21 \u2014 2 Base Tokens, 6 Crime Tokens", details: { unlock: "Level 21 \u2014 2 Base Tokens, 6 Crime Tokens", power: "Quad Damage \u2014 Temporarily deals massive bonus damage on all attacks." } },
  { id: "stealth_big_time", name: "Stealth (\"Big Time\") Suit", category: "Base Game", description: "Level 23 \u2014 2 Base Tokens, 4 Crime Tokens", details: { unlock: "Level 23 \u2014 2 Base Tokens, 4 Crime Tokens", power: "Blur Projector \u2014 Create a distortion field that obscures you from non-alerted enemies." } },
  { id: "spider_armor_mk3", name: "Spider-Armor MK III Suit", category: "Base Game", description: "Level 26 \u2014 2 Base Tokens, 2 Research Tokens", details: { unlock: "Level 26 \u2014 2 Base Tokens, 2 Research Tokens", power: "Titanium Alloy Plates \u2014 Reflects all bullets back at shooters (except snipers)." } },
  { id: "spirit_spider", name: "Spirit Spider Suit", category: "Base Game", description: "Level 29 \u2014 6 Base Tokens, 6 Crime Tokens", details: { unlock: "Level 29 \u2014 6 Base Tokens, 6 Crime Tokens", power: "Spirit Fire \u2014 Launches damaging spirit projectiles at enemies." } },
  { id: "spider_2099_white", name: "Spider-Man 2099 White Suit", category: "Base Game", description: "Level 32 \u2014 4 Base Tokens, 4 Crime Tokens", details: { unlock: "Level 32 \u2014 4 Base Tokens, 4 Crime Tokens", power: "Concussion Strike \u2014 Concussive technology sends enemies flying with every attack." } },
  { id: "iron_spider", name: "Iron Spider Suit", category: "Base Game", description: "Level 31 \u2014 3 Base Tokens, 3 Crime Tokens", details: { unlock: "Level 31 \u2014 3 Base Tokens, 3 Crime Tokens", power: "Iron Arms \u2014 Summons four articulated arms for devastating combo attacks." } },
  { id: "velocity", name: "Velocity Suit", category: "Base Game", description: "Level 34 \u2014 2 Backpack Tokens, 4 Crime Tokens", details: { unlock: "Level 34 \u2014 2 Backpack Tokens, 4 Crime Tokens", power: "Blitz \u2014 Dash at high speed and ram into enemies." } },
  { id: "spider_2099_black", name: "Spider-Man 2099 Black Suit", category: "Base Game", description: "Level 36 \u2014 2 Base Tokens, 4 Crime Tokens", details: { unlock: "Level 36 \u2014 2 Base Tokens, 4 Crime Tokens", power: "Low Gravity \u2014 Decrease gravity while in the air." } },
  { id: "vintage_comic", name: "Vintage Comic Book Suit", category: "Base Game", description: "Level 38 \u2014 4 Backpack Tokens, 4 Crime Tokens", details: { unlock: "Level 38 \u2014 4 Backpack Tokens, 4 Crime Tokens", power: "Quips \u2014 Witty quips that make enemies cringe and lose morale." } },
  { id: "last_stand", name: "Last Stand Suit", category: "Base Game", description: "Level 45 \u2014 20 Crime Tokens", details: { unlock: "Level 45 \u2014 20 Crime Tokens", power: "Unrelenting Fury \u2014 Enemies cannot block or interrupt your attacks, even if they have shields." } },

  // === BASE GAME — SPECIAL UNLOCK ===
  { id: "dark", name: "Dark Suit", category: "Base Game", description: "Complete all Black Cat Stakeouts", details: { unlock: "Complete all Black Cat Stakeouts" } },
  { id: "esu", name: "ESU Suit", category: "Base Game", description: "Complete all Taskmaster Challenges", details: { unlock: "Complete all Taskmaster Challenges", power: "Equalizer \u2014 One-hit KO on any enemy, but you also go down in one hit." } },
  { id: "undies", name: "Undies Suit", category: "Base Game", description: "100% all districts", details: { unlock: "100% all districts", power: "Equalizer \u2014 One-hit KO on any enemy, but you also go down in one hit." } },
  { id: "homemade", name: "Homemade Suit", category: "Base Game", description: "Complete all Research Stations", details: { unlock: "Complete all Research Stations" } },
  { id: "spider_armor_mk4", name: "Spider-Armor MK IV Suit", category: "Base Game", description: "Level 50 \u2014 all skill points spent", details: { unlock: "Level 50 \u2014 all skill points spent", power: "Defense Shield \u2014 Generates an energy shield that temporarily absorbs all damage." } },

  // === FREE UPDATES ===
  { id: "raimi", name: "Raimi Suit", category: "Free Updates", description: "Free update \u2014 available from start", details: { unlock: "Free update \u2014 available from start" } },
  { id: "future_foundation", name: "Future Foundation Suit", category: "Free Updates", description: "Free update \u2014 available from start", details: { unlock: "Free update \u2014 available from start" } },
  { id: "bag_man", name: "Bombastic Bag-Man Suit", category: "Free Updates", description: "Free update \u2014 available from start", details: { unlock: "Free update \u2014 available from start" } },
  { id: "ffh_upgraded", name: "Upgraded Suit (Far From Home)", category: "Free Updates", description: "Free update \u2014 available from start", details: { unlock: "Free update \u2014 available from start" } },
  { id: "ffh_stealth", name: "Stealth Suit (Far From Home)", category: "Free Updates", description: "Free update \u2014 available from start", details: { unlock: "Free update \u2014 available from start" } },
  { id: "nwh_black_gold", name: "Black & Gold Suit (No Way Home)", category: "Free Updates", description: "Free update \u2014 available from start", details: { unlock: "Free update \u2014 available from start" } },
  { id: "nwh_integrated", name: "Integrated Suit (No Way Home)", category: "Free Updates", description: "Free update \u2014 available from start", details: { unlock: "Free update \u2014 available from start" } },

  // === DLC: THE HEIST ===
  { id: "resilient", name: "Resilient Suit", category: "DLC: The Heist", description: "Complete The Heist story", details: { unlock: "Complete The Heist story", power: "Iron Arms \u2014 Summons four articulated arms for devastating combo attacks." } },
  { id: "spider_uk", name: "Spider-UK Suit", category: "DLC: The Heist", description: "Complete all Maggia Crimes in The Heist", details: { unlock: "Complete all Maggia Crimes in The Heist" } },
  { id: "scarlet_spider_2", name: "Scarlet Spider II Suit", category: "DLC: The Heist", description: "Complete all Screwball Challenges in The Heist", details: { unlock: "Complete all Screwball Challenges in The Heist" } },

  // === DLC: TURF WARS ===
  { id: "spider_armor_mk1", name: "Spider-Armor MK I Suit", category: "DLC: Turf Wars", description: "Complete Turf Wars story", details: { unlock: "Complete Turf Wars story" } },
  { id: "iron_spider_armor", name: "Iron Spider Armor", category: "DLC: Turf Wars", description: "Complete all Hammerhead Crimes in Turf Wars", details: { unlock: "Complete all Hammerhead Crimes in Turf Wars" } },
  { id: "spider_clan", name: "Spider-Clan Suit", category: "DLC: Turf Wars", description: "Complete all Screwball Challenges in Turf Wars", details: { unlock: "Complete all Screwball Challenges in Turf Wars" } },

  // === DLC: SILVER LINING ===
  { id: "aaron_aikman", name: "Aaron Aikman Suit", category: "DLC: Silver Lining", description: "Complete Silver Lining story", details: { unlock: "Complete Silver Lining story" } },
  { id: "cyborg", name: "Cyborg Spider-Man Suit", category: "DLC: Silver Lining", description: "Complete all Hammerhead Crimes in Silver Lining", details: { unlock: "Complete all Hammerhead Crimes in Silver Lining" } },
  { id: "into_spider_verse", name: "Into the Spider-Verse Suit", category: "DLC: Silver Lining", description: "Complete all Screwball Challenges in Silver Lining", details: { unlock: "Complete all Screwball Challenges in Silver Lining" } },

  // === REMASTERED EXCLUSIVE ===
  { id: "arachnid_rider", name: "Arachnid Rider Suit", category: "Remastered Exclusive", description: "Remastered exclusive \u2014 available from start", details: { unlock: "Remastered exclusive \u2014 available from start" } },
  { id: "armored_advanced", name: "Armored Advanced Suit", category: "Remastered Exclusive", description: "Remastered exclusive \u2014 available from start", details: { unlock: "Remastered exclusive \u2014 available from start" } },
]

export const SUIT_CATEGORIES = [
  "Base Game", "Free Updates",
  "DLC: The Heist", "DLC: Turf Wars", "DLC: Silver Lining",
  "Remastered Exclusive"
]
