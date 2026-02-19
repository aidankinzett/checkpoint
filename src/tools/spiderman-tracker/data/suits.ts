export interface Suit {
  id: string
  name: string
  category: string
  unlock: string
  power?: string
  powerDesc?: string
}

export const SUITS: Suit[] = [
  // === BASE GAME — STORY UNLOCKS ===
  { id: "advanced", name: "Advanced Suit", category: "Base Game", unlock: "Story progression (Act 1)", power: "Battle Focus", powerDesc: "Continuously generates Focus for a short time." },
  { id: "classic_damaged", name: "Classic Suit (Damaged)", category: "Base Game", unlock: "Default starting suit", },
  { id: "classic_repaired", name: "Classic Suit (Repaired)", category: "Base Game", unlock: "Story progression (Act 1)", power: "Web Blossom", powerDesc: "Leap into the air and web everything in sight." },
  { id: "anti_ock", name: "Anti-Ock Suit", category: "Base Game", unlock: "Story progression (Act 3)", power: "Resupply", powerDesc: "Distributed nano-mesh continually refills current gadget's shots." },

  // === BASE GAME — LEVEL-BASED ===
  { id: "noir", name: "Noir Suit", category: "Base Game", unlock: "Level 3 — 1 Backpack Token, 1 Base Token", power: "Sound of Silence", powerDesc: "Enemies cannot call for backup." },
  { id: "scarlet_spider", name: "Scarlet Spider Suit", category: "Base Game", unlock: "Level 4 — 3 Crime Tokens", power: "Holo Decoy", powerDesc: "Experimental AR tech spawns multiple Holo Decoys that distract enemies." },
  { id: "spider_armor_mk2", name: "Spider-Armor MK II Suit", category: "Base Game", unlock: "Level 5 — 1 Base Token, 1 Landmark Token", power: "Bullet Proof", powerDesc: "You are temporarily resistant to bullet damage." },
  { id: "secret_war", name: "Secret War Suit", category: "Base Game", unlock: "Level 7 — 2 Backpack Tokens, 1 Base Token", power: "Arms Race", powerDesc: "Stuns all nearby enemies with electric shocks." },
  { id: "stark", name: "Stark Suit", category: "Base Game", unlock: "Level 9 — 1 Base Token, 1 Research Token", power: "Spider-Bro", powerDesc: "Deploys a spider-drone that attacks enemies." },
  { id: "negative", name: "Negative Suit", category: "Base Game", unlock: "Level 11 — 1 Base Token, 1 Research Token", power: "Negative Shockwave", powerDesc: "Launches a massive wave of negative energy." },
  { id: "electrically_insulated", name: "Electrically Insulated Suit", category: "Base Game", unlock: "Level 13 — 1 Base Token, 1 Research Token", power: "Electric Punch", powerDesc: "Temporarily charges your fists with electricity." },
  { id: "spider_punk", name: "Spider-Punk Suit", category: "Base Game", unlock: "Level 16 — 2 Base Tokens, 3 Crime Tokens", power: "Rock Out", powerDesc: "Blasts enemies with waves of righteous sound." },
  { id: "wrestler", name: "Wrestler Suit", category: "Base Game", unlock: "Level 19 — 2 Base Tokens, 2 Research Tokens", power: "King of the Ring", powerDesc: "Web-throws enemies without needing to web them first." },
  { id: "fear_itself", name: "Fear Itself Suit", category: "Base Game", unlock: "Level 21 — 2 Base Tokens, 6 Crime Tokens", power: "Quad Damage", powerDesc: "Temporarily deals massive bonus damage on all attacks." },
  { id: "stealth_big_time", name: "Stealth (\"Big Time\") Suit", category: "Base Game", unlock: "Level 23 — 2 Base Tokens, 4 Crime Tokens", power: "Blur Projector", powerDesc: "Create a distortion field that obscures you from non-alerted enemies." },
  { id: "spider_armor_mk3", name: "Spider-Armor MK III Suit", category: "Base Game", unlock: "Level 26 — 2 Base Tokens, 2 Research Tokens", power: "Titanium Alloy Plates", powerDesc: "Reflects all bullets back at shooters (except snipers)." },
  { id: "spirit_spider", name: "Spirit Spider Suit", category: "Base Game", unlock: "Level 29 — 6 Base Tokens, 6 Crime Tokens", power: "Spirit Fire", powerDesc: "Launches damaging spirit projectiles at enemies." },
  { id: "spider_2099_white", name: "Spider-Man 2099 White Suit", category: "Base Game", unlock: "Level 32 — 4 Base Tokens, 4 Crime Tokens", power: "Concussion Strike", powerDesc: "Concussive technology sends enemies flying with every attack." },
  { id: "iron_spider", name: "Iron Spider Suit", category: "Base Game", unlock: "Level 31 — 3 Base Tokens, 3 Crime Tokens", power: "Iron Arms", powerDesc: "Summons four articulated arms for devastating combo attacks." },
  { id: "velocity", name: "Velocity Suit", category: "Base Game", unlock: "Level 34 — 2 Backpack Tokens, 4 Crime Tokens", power: "Blitz", powerDesc: "Dash at high speed and ram into enemies." },
  { id: "spider_2099_black", name: "Spider-Man 2099 Black Suit", category: "Base Game", unlock: "Level 36 — 2 Base Tokens, 4 Crime Tokens", power: "Low Gravity", powerDesc: "Decrease gravity while in the air." },
  { id: "vintage_comic", name: "Vintage Comic Book Suit", category: "Base Game", unlock: "Level 38 — 4 Backpack Tokens, 4 Crime Tokens", power: "Quips", powerDesc: "Witty quips that make enemies cringe and lose morale." },
  { id: "last_stand", name: "Last Stand Suit", category: "Base Game", unlock: "Level 45 — 20 Crime Tokens", power: "Unrelenting Fury", powerDesc: "Enemies cannot block or interrupt your attacks, even if they have shields." },

  // === BASE GAME — SPECIAL UNLOCK ===
  { id: "dark", name: "Dark Suit", category: "Base Game", unlock: "Complete all Black Cat Stakeouts" },
  { id: "esu", name: "ESU Suit", category: "Base Game", unlock: "Complete all Taskmaster Challenges", power: "Equalizer", powerDesc: "One-hit KO on any enemy, but you also go down in one hit." },
  { id: "undies", name: "Undies Suit", category: "Base Game", unlock: "100% all districts", power: "Equalizer", powerDesc: "One-hit KO on any enemy, but you also go down in one hit." },
  { id: "homemade", name: "Homemade Suit", category: "Base Game", unlock: "Complete all Research Stations" },
  { id: "spider_armor_mk4", name: "Spider-Armor MK IV Suit", category: "Base Game", unlock: "Level 50 — all skill points spent", power: "Defense Shield", powerDesc: "Generates an energy shield that temporarily absorbs all damage." },

  // === FREE UPDATES ===
  { id: "raimi", name: "Raimi Suit", category: "Free Updates", unlock: "Free update — available from start" },
  { id: "future_foundation", name: "Future Foundation Suit", category: "Free Updates", unlock: "Free update — available from start" },
  { id: "bag_man", name: "Bombastic Bag-Man Suit", category: "Free Updates", unlock: "Free update — available from start" },
  { id: "ffh_upgraded", name: "Upgraded Suit (Far From Home)", category: "Free Updates", unlock: "Free update — available from start" },
  { id: "ffh_stealth", name: "Stealth Suit (Far From Home)", category: "Free Updates", unlock: "Free update — available from start" },
  { id: "nwh_black_gold", name: "Black & Gold Suit (No Way Home)", category: "Free Updates", unlock: "Free update — available from start" },
  { id: "nwh_integrated", name: "Integrated Suit (No Way Home)", category: "Free Updates", unlock: "Free update — available from start" },

  // === DLC: THE HEIST ===
  { id: "resilient", name: "Resilient Suit", category: "DLC: The Heist", unlock: "Complete The Heist story", power: "Iron Arms", powerDesc: "Summons four articulated arms for devastating combo attacks." },
  { id: "spider_uk", name: "Spider-UK Suit", category: "DLC: The Heist", unlock: "Complete all Maggia Crimes in The Heist" },
  { id: "scarlet_spider_2", name: "Scarlet Spider II Suit", category: "DLC: The Heist", unlock: "Complete all Screwball Challenges in The Heist" },

  // === DLC: TURF WARS ===
  { id: "spider_armor_mk1", name: "Spider-Armor MK I Suit", category: "DLC: Turf Wars", unlock: "Complete Turf Wars story" },
  { id: "iron_spider_armor", name: "Iron Spider Armor", category: "DLC: Turf Wars", unlock: "Complete all Hammerhead Crimes in Turf Wars" },
  { id: "spider_clan", name: "Spider-Clan Suit", category: "DLC: Turf Wars", unlock: "Complete all Screwball Challenges in Turf Wars" },

  // === DLC: SILVER LINING ===
  { id: "aaron_aikman", name: "Aaron Aikman Suit", category: "DLC: Silver Lining", unlock: "Complete Silver Lining story" },
  { id: "cyborg", name: "Cyborg Spider-Man Suit", category: "DLC: Silver Lining", unlock: "Complete all Hammerhead Crimes in Silver Lining" },
  { id: "into_spider_verse", name: "Into the Spider-Verse Suit", category: "DLC: Silver Lining", unlock: "Complete all Screwball Challenges in Silver Lining" },

  // === REMASTERED EXCLUSIVE ===
  { id: "arachnid_rider", name: "Arachnid Rider Suit", category: "Remastered Exclusive", unlock: "Remastered exclusive — available from start" },
  { id: "armored_advanced", name: "Armored Advanced Suit", category: "Remastered Exclusive", unlock: "Remastered exclusive — available from start" },
]

export const SUIT_CATEGORIES = [
  "Base Game", "Free Updates",
  "DLC: The Heist", "DLC: Turf Wars", "DLC: Silver Lining",
  "Remastered Exclusive"
]
