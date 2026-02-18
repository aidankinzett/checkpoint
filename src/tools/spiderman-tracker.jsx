import { useState, useEffect, useCallback } from "react";

export const meta = {
  title: "Spider-Man Tracker",
  description: "Achievement tracker for Marvel's Spider-Man Remastered",
  icon: "🕷️",
};

const ACHIEVEMENTS = [
  // === BASE GAME — STORY ===
  { id: "demons_emerge", name: "Demons Emerge", desc: "Complete Act 1", tier: "bronze", category: "Story", secret: true, guide: "Story related, cannot be missed. Unlocks after completing all main missions in Act 1." },
  { id: "six_assemble", name: "The Six Assemble", desc: "Complete Act 2", tier: "bronze", category: "Story", secret: true, guide: "Story related, cannot be missed. Unlocks after completing all main missions in Act 2." },
  { id: "end_game", name: "End Game", desc: "Complete Act 3", tier: "bronze", category: "Story", secret: true, guide: "Story related, cannot be missed. Unlocks after completing the final main story mission in Act 3." },
  { id: "knocking_kingpin", name: "Knocking Down Kingpin", desc: "Defeat Fisk", tier: "bronze", category: "Story", secret: true, guide: "Story related, cannot be missed. Unlocks at the end of the very first mission when you defeat Wilson Fisk." },
  { id: "staying_positive", name: "Staying Positive", desc: "Defeat Li", tier: "bronze", category: "Story", secret: true, guide: "Story related, cannot be missed. Unlocks after defeating Martin Li (Mr. Negative) during the main story." },
  { id: "grounded", name: "Grounded", desc: "Defeat Electro and Vulture", tier: "bronze", category: "Story", secret: true, guide: "Story related, cannot be missed. Unlocks after the boss fight against Electro and Vulture during the main story." },
  { id: "sting_smash", name: "Sting and Smash", desc: "Defeat Scorpion and Rhino", tier: "bronze", category: "Story", secret: true, guide: "Story related, cannot be missed. Unlocks after the boss fight against Scorpion and Rhino during the main story." },
  { id: "shock_awe", name: "Shock and Awe", desc: "Defeat Shocker", tier: "bronze", category: "Story", secret: true, guide: "Story related, cannot be missed. Unlocks after the boss fight against Shocker during the main story." },
  { id: "tombstone", name: "Tombstone Takedown", desc: "Defeat Tombstone", tier: "bronze", category: "Story", secret: true, guide: "During Act 2, a side mission chain starting with \"Tombstone: On the Move\" becomes available. Complete all missions in this chain, culminating in a one-on-one fight with Tombstone in \"Let's Get Ready To…\"." },
  { id: "wing_it", name: "Wing It", desc: "Traverse across the city rooftops", tier: "bronze", category: "Story", secret: true, guide: "You need to disturb 500 groups of pigeons (the birds sitting on rooftops) while swinging around New York. This should unlock naturally while playing through the game." },

  // === COMPLETION ===
  { id: "superior", name: "Superior Spider-Man", desc: "Unlock all Skills", tier: "gold", category: "Completion", guide: "Reach level 50 and spend all 50 Skill Points to purchase every skill in the Skills tab. You'll earn enough XP by completing the story and side content." },
  { id: "i_heart_manhattan", name: "I Heart Manhattan", desc: "100% complete all districts", tier: "gold", category: "Completion", guide: "Use the in-game map to track completion across all districts. You need to finish every collectible, base, crime, and activity in every district. The map shows everything you need." },
  { id: "power_responsibility", name: "Power and Responsibility", desc: "Complete a playthrough on Ultimate difficulty", tier: "silver", category: "Completion", guide: "Best done on New Game+ where you keep all your upgrades and skills. You must NOT change the difficulty at any point during the playthrough. Only main story (yellow marker) missions are required." },
  { id: "backpacker", name: "Backpacker", desc: "Collect all Backpacks", tier: "silver", category: "Completion", guide: "There are 55 backpacks scattered across the city. Activate Surveillance Towers to reveal their locations on the map. Each one contains a memento from Peter's past." },
  { id: "cat_prints", name: "Cat Prints", desc: "Track down Black Cat", tier: "silver", category: "Completion", guide: "Complete the mission from Felicia Hardy to unlock locations for all 12 Black Cat Stakeout collectibles on the map. Collect all of them to earn this." },
  { id: "inner_sanctuary", name: "Inner Sanctuary", desc: "Take down each Demon Warehouse", tier: "silver", category: "Completion", secret: true, guide: "Demon Warehouses unlock during Act 2. They appear as red devil icons on the map. Clear all of them — they are wave-based combat encounters." },
  { id: "all_kings_men", name: "All the King's Men", desc: "Take down each Fisk Hideout", tier: "silver", category: "Completion", secret: true, guide: "Yuri contacts you about Fisk goons operating out of construction sites. Complete the mission and Fisk Hideouts appear on the map. Clear all of them." },
  { id: "mercenary_tactics", name: "Mercenary Tactics", desc: "Take down each Sable Outpost", tier: "silver", category: "Completion", secret: true, guide: "Sable Outposts unlock during Act 3. They appear as red Sable logos on the map. These are tougher combat encounters with Sable International troops." },
  { id: "back_slammer", name: "Back in the Slammer", desc: "Take down each Prisoner Camp", tier: "silver", category: "Completion", secret: true, guide: "Prisoner Camps unlock during Act 3. They appear as red barbed wire icons on the map. Clear all of them." },
  { id: "neighborhood_watch", name: "Neighborhood Watch", desc: "Complete all Faction Crimes in a district", tier: "silver", category: "Completion", guide: "Central Park is the easiest spot — only Thug Crimes appear there. Swing back and forth looking for crime events until you've completed all 5 in one district." },
  { id: "suit_all_seasons", name: "A Suit For All Seasons", desc: "Purchase all Suits", tier: "silver", category: "Completion", guide: "Purchase all base game suits (DLC suits don't count). Most unlock through story progression and side activities. Use tokens earned from side content to buy them from the Suits tab." },
  { id: "schooled", name: "Schooled", desc: "Complete all Corrupted Student missions", tier: "silver", category: "Completion", secret: true, guide: "Available during Act 2. All 5 missions start at Empire State University from a student named Philip Chang. Complete his entire mission chain." },
  { id: "full_arsenal", name: "Full Arsenal", desc: "Max out all Gadgets", tier: "silver", category: "Completion", guide: "Max out all 8 gadgets (34 total upgrades). Don't force this early — focus on 100% district completion first to earn most tokens needed. The DLC provides extra tokens too." },
  { id: "friendly_neighborhood", name: "Friendly Neighborhood Spider-Man", desc: "Complete all Side Missions", tier: "bronze", category: "Completion", guide: "Side missions appear on the map as you progress through the main campaign. Complete all of them — they can be done at any time." },
  { id: "amazing_coverage", name: "Amazing Coverage", desc: "All Surveillance Towers activated", tier: "bronze", category: "Completion", guide: "Given early by Yuri Watanabe. Interact with towers across the city and complete the wavelength-matching minigame. Essential for revealing collectibles on the map." },
  { id: "rd", name: "R&D", desc: "Complete all Research Stations", tier: "bronze", category: "Completion", guide: "Harry Osborne's research stations appear as purple microscope icons on the map. Each involves a unique puzzle or mini-challenge. Complete all of them." },
  { id: "pigeon_hunter", name: "Pigeon Hunter", desc: "Catch all of Howard's Pigeons", tier: "bronze", category: "Completion", secret: true, guide: "Start the \"Helping Howard\" side quest from a rooftop near the F.E.A.S.T. Center. This unlocks pigeon locations (pale blue bird icons) on the map. Chase and catch all of them." },
  { id: "sightseeing", name: "Sightseeing", desc: "Photograph all Landmarks on the Map", tier: "bronze", category: "Completion", guide: "Visit each landmark (pale blue building icons on the map) and take a photo of them. Peter uses them to upgrade his mapping software." },
  { id: "fixer_upper", name: "A Bit of a Fixer-Upper", desc: "Complete all optional projects in the lab", tier: "bronze", category: "Completion", secret: true, guide: "Visit Doctor Octavius' lab (Octavius Industries logo on map, enter via rooftop door). Complete the circuit/pipe puzzles that appear. More unlock as you progress the story." },

  // === CHALLENGES ===
  { id: "master_masters", name: "Master of Masters", desc: "Defeat Taskmaster", tier: "silver", category: "Challenges", secret: true, guide: "After completing some Taskmaster Challenges, Taskmaster attacks you mid-swing. He flees after a short fight, then fights you for real after you complete all 16 challenges. Defeat him the second time." },
  { id: "grinding_all_way", name: "Grinding All the Way", desc: "Max out one Benchmark type", tier: "silver", category: "Challenges", guide: "Check the Benchmarks tab in the pause menu. Get any single benchmark to Tier 3 (max). The parkour benchmark (flipping over obstacles while running) is one of the easiest — just run down a road vaulting over cars." },
  { id: "masters_education", name: "Master's Education", desc: "Achieve Ultimate on a Taskmaster Challenge", tier: "silver", category: "Challenges", guide: "Get a gold (Ultimate) ranking in any of the 16 Taskmaster Challenges. Easier with late-game upgrades. Combat and Bomb challenges tend to be the most forgiving." },
  { id: "short_fuse", name: "Short Fuse", desc: "Get Spectacular or better in a Taskmaster Bomb Challenge", tier: "bronze", category: "Challenges", secret: true, guide: "Challenges unlock during Act 2 (orange circular icons on map). Complete any Bomb Challenge with at least Spectacular (silver) rank. Focus on efficient web-swinging between bombs." },
  { id: "fists_fury", name: "Fists of Fury", desc: "Get Spectacular or better in a Taskmaster Combat Challenge", tier: "bronze", category: "Challenges", secret: true, guide: "Complete any Combat Challenge with at least Spectacular (silver) rank. Use varied attacks, gadgets, and finishers for higher scores." },
  { id: "ninja", name: "Ninja", desc: "Get Spectacular or better in a Taskmaster Stealth Challenge", tier: "bronze", category: "Challenges", secret: true, guide: "Complete any Stealth Challenge with at least Spectacular (silver) rank. Stay undetected and take down enemies quickly for the best score." },
  { id: "spy_hunter", name: "Spy Hunter", desc: "Get Spectacular or better in a Taskmaster Drone Challenge", tier: "bronze", category: "Challenges", secret: true, guide: "Complete any Drone Challenge with at least Spectacular (silver) rank. Follow the drone closely and hit checkpoints efficiently." },
  { id: "challenge_finder", name: "Challenge Finder", desc: "Complete every Taskmaster Challenge in the city once", tier: "bronze", category: "Challenges", secret: true, guide: "Complete all 16 Taskmaster Challenges at least once (any rank). They're scattered across the map as orange circular icons." },
  { id: "king_swing", name: "King of Swing", desc: "Complete a level 1 Traversal Benchmark", tier: "bronze", category: "Challenges", guide: "Check the Benchmarks tab in the pause menu. Blue icons are traversal benchmarks. Complete any one of them to Tier 1." },
  { id: "and_stay_down", name: "And Stay Down!", desc: "Complete a level 1 Combat Benchmark", tier: "bronze", category: "Challenges", guide: "Check the Benchmarks tab in the pause menu. Green icons are combat benchmarks. Complete any one of them to Tier 1." },
  { id: "ace_base", name: "Ace the Base", desc: "Complete all objectives in a base", tier: "bronze", category: "Challenges", guide: "When you start an enemy base activity, you get two bonus objectives on top of clearing the waves. Complete both bonus objectives before finishing. Fisk Hideouts are the easiest. You can retry bases." },

  // === COMBAT & SKILLS ===
  { id: "so_many_hits", name: "So Many Hits...", desc: "Achieve a combo of 100", tier: "silver", category: "Combat & Skills", guide: "Get a 100-hit combo without taking damage. Equip the Bio Mesh Suit Mod to absorb a few hits without breaking your combo. Find a large group of enemies and focus on dodging between strikes." },
  { id: "untouchable", name: "The Untouchable Spider-Man", desc: "Complete any Enemy Base without taking damage", tier: "silver", category: "Combat & Skills", guide: "Set difficulty to Friendly Neighbourhood. Try a Fisk Hideout (construction zone). Use stealth for wave 1, then dodge everything. The \"Equaliser\" suit ability makes enemies die in one hit, which helps a lot." },
  { id: "science_ftw", name: "Science FTW!", desc: "Craft 15 Upgrades", tier: "bronze", category: "Combat & Skills", guide: "Open the Gadgets tab and use tokens to craft upgrades for any gadgets. Craft 15 total upgrades across all gadgets." },
  { id: "scientific_method", name: "The Scientific Method", desc: "Craft your first Upgrade", tier: "bronze", category: "Combat & Skills", guide: "Once the Gadgets tab unlocks, select any gadget and craft one upgrade using tokens earned from side content." },
  { id: "hug_it_out", name: "Hug It Out", desc: "Knock together 10 pairs of enemies with Trip Mines", tier: "bronze", category: "Combat & Skills", secret: true, guide: "Trip Mine unlocks in Act 2. Shoot a Trip Mine at an enemy and it will web them to the nearest enemy or wall. You need 10 enemy-to-enemy pairs. Works best in large groups — shoot a Trip Mine at one enemy and make sure another is nearby." },
  { id: "spider_sensible", name: "Spider-Sensible", desc: "Perfect Dodge 10 attacks", tier: "bronze", category: "Combat & Skills", guide: "When attacked, a white flash appears above your head. Wait until the last second — when the flash turns blue — then dodge. That's a Perfect Dodge. Do this 10 times total (cumulative)." },
  { id: "arachnophobia", name: "Arachnophobia", desc: "Perform 75 Stealth Takedowns", tier: "bronze", category: "Combat & Skills", guide: "When undetected, a purple or green indicator appears over enemies. Press the takedown button to silently take them out. Do this 75 times total (cumulative across all encounters)." },
  { id: "overdrive", name: "Overdrive", desc: "Complete 10 Vehicle Takedowns", tier: "bronze", category: "Combat & Skills", guide: "Vehicle takedowns occur during car chase crime events. Some happen in the story, but most come from random Crime activities. You'll likely get this naturally while going for 100% district completion." },

  // === EXPLORATION ===
  { id: "with_great_power", name: "With Great Power...", desc: "Pay respects at Ben Parker's grave", tier: "bronze", category: "Exploration", guide: "Go to the far north-west corner of the map. Find the church and graveyard. Use Spider-Sense (R3 on controller) to highlight the interactable grave, then pay your respects." },
  { id: "hero_higher", name: "Hero for Higher", desc: "Perch atop Avengers Tower", tier: "bronze", category: "Exploration", guide: "Find Avengers Tower in the Upper East Side district. Climb to the very top of one of the building's two tips. Peter will do a perched pose when you reach the right spot." },
  { id: "born_ride", name: "Born to Ride", desc: "Ride the Subway 5 times", tier: "bronze", category: "Exploration", guide: "Fast travel by holding the interact button over a fast-travel icon on the map. Do this 5 times. Fast travel unlocks after activating surveillance towers." },
  { id: "sticky_tricky", name: "Sticky and Tricky", desc: "Chain 4 unique tricks before landing", tier: "bronze", category: "Exploration", guide: "Jump from a very tall building (like Avengers Tower) and perform 4 different tricks while falling before you land or web-swing. Each trick must be unique." },
  { id: "snappy_dresser", name: "Snappy Dresser", desc: "Wear 5 new Spider-Suits", tier: "bronze", category: "Exploration", secret: true, guide: "Simply equip 5 different suits from the Suits tab. You don't need to own them all — just wear 5 different ones." },
  { id: "lost_found", name: "Lost and Found", desc: "Collect 5 Backpacks", tier: "bronze", category: "Exploration", guide: "Activate Surveillance Towers to reveal backpack locations on the map. Collect any 5 of the 55 total backpacks." },
  { id: "spiderman_about_town", name: "Spider-Man About Town", desc: "Greet 10 citizens", tier: "bronze", category: "Exploration", guide: "Citizens with a white circle above their head will greet you. Approach them and press the prompted button to interact. Do this 10 times while swinging around the city." },
  { id: "cats_out_bag", name: "Cat's Out of the Bag", desc: "Collect a Black Cat collectible", tier: "bronze", category: "Exploration", guide: "Find and collect any one of the Black Cat Stakeout collectibles. Some appear naturally during the story; others are revealed on the map after the initial Black Cat mission." },
  { id: "one_more_time", name: "One More Time", desc: "Complete a New Game+ playthrough", tier: "bronze", category: "Exploration", guide: "After completing the game, start a New Game+ from the save selection menu. Complete the main story again (yellow markers only). Best combined with Ultimate difficulty for Power and Responsibility." },

  // === DLC: THE HEIST ===
  { id: "seduced_city", name: "Seduced by the City", desc: "100% Complete CTNS: The Heist", tier: "gold", category: "DLC: The Heist", guide: "100% every district in The Heist DLC. Collect all Stolen Paintings, complete all Maggia Crimes, Screwball Challenges, side missions, and main missions. Track via the map." },
  { id: "screwy", name: "Screwy", desc: "Get Spectacular or better in all Screwball Challenges", tier: "silver", category: "DLC: The Heist", guide: "Screwball contacts you midway through The Heist. Complete all 5 of her challenges with at least Spectacular (silver) rank." },
  { id: "cat_came_back", name: "The Cat Came Back", desc: "Complete \"The Maria\" mission", tier: "bronze", category: "DLC: The Heist", secret: true, guide: "Story related, cannot be missed. Unlocks upon completing the main mission \"The Maria\" in The Heist DLC." },
  { id: "here_kitty", name: "Here Kitty-Kitty", desc: "Complete the Black Cat chase", tier: "bronze", category: "DLC: The Heist", secret: true, guide: "Story related, cannot be missed. Unlocks after completing the Black Cat chase sequence during The Heist." },
  { id: "bye_felicia", name: "Bye Felicia", desc: "Complete the \"Follow the Money\" mission", tier: "bronze", category: "DLC: The Heist", secret: true, guide: "Story related, cannot be missed. Unlocks upon completing the final story mission \"Follow the Money\" in The Heist." },
  { id: "long_con", name: "The Long Con", desc: "Complete the \"Like a Fiddle\" mission", tier: "bronze", category: "DLC: The Heist", secret: true, guide: "Midway through The Heist, Detective Mackey contacts you. Collect all 10 Stolen Paintings that appear on the map. After collecting them all, a mission appears at his precinct — complete it." },
  { id: "disorganized_crime", name: "Disorganized Crime", desc: "Complete all Crimes in a district", tier: "bronze", category: "DLC: The Heist", guide: "Complete all 5 Maggia Crime events in any single district. Maggia crimes unlock after the first Heist mission and appear randomly like main game crimes." },

  // === DLC: TURF WARS ===
  { id: "city_family", name: "The City is My Family", desc: "100% Complete CTNS: Turf Wars", tier: "gold", category: "DLC: Turf Wars", guide: "100% every district in the Turf Wars DLC. Complete all Hammerhead Front bases, Crime events, Screwball Challenges, side missions, and main missions. Track via the map." },
  { id: "turning_screw", name: "Turning the Screw", desc: "Get Spectacular or better in all Screwball Challenges", tier: "silver", category: "DLC: Turf Wars", guide: "Screwball contacts you midway through Turf Wars. Complete all 5 challenges with at least Spectacular (silver) rank." },
  { id: "pulling_trigger", name: "Pulling the Trigger", desc: "Complete the \"Blindsided\" mission", tier: "bronze", category: "DLC: Turf Wars", secret: true, guide: "Story related, cannot be missed. Unlocks upon completing the \"Blindsided\" mission in Turf Wars." },
  { id: "crossing_line", name: "Crossing the Thin Blue Line", desc: "Complete the \"Lockup\" mission", tier: "bronze", category: "DLC: Turf Wars", secret: true, guide: "Story related, cannot be missed. Unlocks upon completing the \"Lockup\" mission in Turf Wars." },
  { id: "steel_skull", name: "Steel Skull, Glass Jaw", desc: "Complete the \"Bring the Hammer Down\" mission", tier: "bronze", category: "DLC: Turf Wars", secret: true, guide: "Story related, cannot be missed. Unlocks upon completing the final story mission \"Bring the Hammer Down\" in Turf Wars." },
  { id: "prohibition", name: "Prohibition", desc: "Take down each Hammerhead Front", tier: "bronze", category: "DLC: Turf Wars", secret: true, guide: "Midway through Turf Wars, 4 Hammerhead Front enemy bases appear on the map (red Hammerhead icons). Clear all 4 bases." },
  { id: "gang_war", name: "The Gang War", desc: "Complete all Crimes in a district", tier: "bronze", category: "DLC: Turf Wars", guide: "Complete all 5 Hammerhead Crime events in any single district. They unlock after the third Turf Wars mission and appear randomly." },

  // === DLC: SILVER LINING ===
  { id: "city_sleeps", name: "The City Sleeps", desc: "100% Complete CTNS: Silver Lining", tier: "gold", category: "DLC: Silver Lining", guide: "100% every district in Silver Lining. Complete all Crime Scene Recordings, Screwball Challenges, Olympus Hideouts, Hammerhead Crimes, side missions, and main missions." },
  { id: "screwballed", name: "Screwballed", desc: "Get Spectacular or better in all Screwball Challenges", tier: "silver", category: "DLC: Silver Lining", guide: "Screwball contacts you after the first Silver Lining mission. Complete all 5 challenges with at least Spectacular (silver) rank." },
  { id: "frenemies", name: "Frenemies", desc: "Complete the \"Old Friends\" mission", tier: "bronze", category: "DLC: Silver Lining", secret: true, guide: "Story related, cannot be missed. Unlocks upon completing the \"Old Friends\" mission in Silver Lining." },
  { id: "unplugged", name: "Unplugged", desc: "Complete the Screwball chase", tier: "bronze", category: "DLC: Silver Lining", secret: true, guide: "After completing all 5 Screwball Challenges, a side mission unlocks where you chase Screwball. Complete it." },
  { id: "terminated", name: "Terminated", desc: "Complete the \"One Plus One Equals Win\" mission", tier: "bronze", category: "DLC: Silver Lining", secret: true, guide: "Story related, cannot be missed. Unlocks upon completing the \"One Plus One Equals Win\" mission in Silver Lining." },
  { id: "wages_war", name: "The Wages of War", desc: "Complete the \"Aiding a Human\" mission", tier: "bronze", category: "DLC: Silver Lining", secret: true, guide: "Complete all 3 Olympus Hideout bases (tracked on map), then a new mission appears at the docks in the Financial District. Complete it." },
  { id: "unacceptable", name: "Unacceptable", desc: "Complete the \"Scales of Justice\" mission", tier: "bronze", category: "DLC: Silver Lining", guide: "Near the end of the DLC, find yellow tape leading to the first of 9 voice recorders. Collect it and the rest appear on the map (light blue magnifying glass icons). Collect all 9 to unlock a side mission — complete it." },
];

const CATEGORIES = [
  "Story", "Completion", "Challenges", "Combat & Skills", "Exploration",
  "DLC: The Heist", "DLC: Turf Wars", "DLC: Silver Lining"
];

const TIER_CONFIG = {
  gold: { label: "Gold", color: "#F5C518", icon: "🏆" },
  silver: { label: "Silver", color: "#A8B4C0", icon: "🥈" },
  bronze: { label: "Bronze", color: "#CD7F32", icon: "🥉" },
};

const STORAGE_KEY = "spiderman-achievements";

export default function SpiderManTracker() {
  const [completed, setCompleted] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showStory, setShowStory] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompleted(JSON.parse(stored));
    } catch (e) {}
    setLoaded(true);
  }, []);

  const saveProgress = useCallback((data) => {
    setSaving(true);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    setTimeout(() => setSaving(false), 400);
  }, []);

  const toggleAchievement = (id, e) => {
    e.stopPropagation();
    const next = { ...completed, [id]: !completed[id] };
    if (!next[id]) delete next[id];
    setCompleted(next);
    saveProgress(next);
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      setCompleted({});
      saveProgress({});
    }
  };

  const filtered = ACHIEVEMENTS.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory !== "all" && a.category !== activeCategory) return false;
    if (filterTier !== "all" && a.tier !== filterTier) return false;
    if (!showCompleted && completed[a.id]) return false;
    if (!showStory && a.guide?.includes("cannot be missed")) return false;
    return true;
  });

  const totalCount = ACHIEVEMENTS.length;
  const completedCount = Object.keys(completed).length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const catCounts = {};
  CATEGORIES.forEach((cat) => {
    const total = ACHIEVEMENTS.filter((a) => a.category === cat).length;
    const done = ACHIEVEMENTS.filter((a) => a.category === cat && completed[a.id]).length;
    catCounts[cat] = { total, done };
  });

  if (!loaded) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0f", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "3px solid #222", borderTop: "3px solid #E23636", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#E23636", fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2 }}>LOADING...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#E8E8E8", fontFamily: "'Barlow', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        .ach-row { transition: background 0.15s, border-color 0.15s; }
        .ach-row:hover { background: #14141f !important; border-color: #2a2a3a !important; }
        .ach-row-done:hover { background: rgba(226,54,54,0.07) !important; }
        .cat-btn { transition: border-color 0.15s, color 0.15s; }
        .cat-btn:hover { border-color: #555 !important; color: #aaa !important; }
        .check-circle { transition: all 0.2s; }
        .check-circle:hover { transform: scale(1.15); filter: brightness(1.2); }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "linear-gradient(180deg, #1a0a0a 0%, #0a0a0f 100%)", borderBottom: "2px solid #E23636", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px 28px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 120, height: 120, background: "radial-gradient(circle at 0% 0%, rgba(226,54,54,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle at 100% 0%, rgba(226,54,54,0.08) 0%, transparent 70%)" }} />
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 8, color: "#888", marginBottom: -2 }}>MARVEL'S</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 10vw, 72px)", color: "#E23636", margin: 0, letterSpacing: 6, lineHeight: 1, textShadow: "0 0 40px rgba(226,54,54,0.3), 0 2px 0 #8B0000" }}>SPIDER-MAN</h1>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 5, color: "#666", marginTop: 4 }}>REMASTERED — ACHIEVEMENT TRACKER</div>
          </div>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 10 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "#E23636", lineHeight: 1 }}>{completedCount}</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#444" }}>/</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#666", lineHeight: 1 }}>{totalCount}</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#E23636", marginLeft: 12, opacity: 0.8 }}>{pct}%</span>
              {saving && <span style={{ fontSize: 10, color: "#E23636", background: "rgba(226,54,54,0.1)", padding: "2px 8px", borderRadius: 4, marginLeft: 12, fontWeight: 600, letterSpacing: 1 }}>SAVING...</span>}
            </div>
            <div style={{ width: "100%", height: 8, background: "#1a1a24", borderRadius: 4, overflow: "hidden", border: "1px solid #222" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #8B0000, #E23636, #FF4444)", borderRadius: 4, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden", width: `${pct}%` }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)" }} />
              </div>
            </div>
            {pct === 100 && (
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, color: "#F5C518", textAlign: "center", marginTop: 14, textShadow: "0 0 20px rgba(245,197,24,0.4)", animation: "pulse 2s ease-in-out infinite" }}>
                🕷️ BE GREATER — PLATINUM UNLOCKED! 🕷️
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTROLS */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {["all", ...CATEGORIES].map((cat) => {
            const isAll = cat === "all";
            const active = activeCategory === cat;
            const label = isAll ? `ALL (${completedCount}/${totalCount})` : `${cat.toUpperCase()} (${catCounts[cat].done}/${catCounts[cat].total})`;
            return (
              <button key={cat} className="cat-btn" onClick={() => setActiveCategory(cat)} style={{
                background: active ? "rgba(226,54,54,0.12)" : "#111118",
                border: `1px solid ${active ? "#E23636" : "#222"}`,
                color: active ? "#E23636" : "#777",
                padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                fontFamily: "'Barlow', sans-serif", letterSpacing: 0.5, cursor: "pointer",
              }}>{label}</button>
            );
          })}
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search achievements..."
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 6,
              background: "#111118", border: "1px solid #222", color: "#ddd",
              fontSize: 14, fontFamily: "'Barlow', sans-serif",
              outline: "none",
            }}
            onFocus={(e) => e.target.style.borderColor = "#E23636"}
            onBlur={(e) => e.target.style.borderColor = "#222"}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #1a1a24" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "gold", "silver", "bronze"].map((t) => {
              const active = filterTier === t;
              return (
                <button key={t} onClick={() => setFilterTier(t)} style={{
                  background: active ? "rgba(226,54,54,0.08)" : "transparent",
                  border: `1px solid ${active ? "rgba(226,54,54,0.4)" : "#222"}`,
                  color: active ? "#ccc" : "#555",
                  padding: "5px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600,
                  fontFamily: "'Barlow', sans-serif", cursor: "pointer",
                }}>{t === "all" ? "ALL TIERS" : `${TIER_CONFIG[t].icon} ${TIER_CONFIG[t].label.toUpperCase()}`}</button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={showStory} onChange={() => setShowStory(!showStory)} style={{ accentColor: "#E23636" }} />
              Show story
            </label>
            <label style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} style={{ accentColor: "#E23636" }} />
              Show completed
            </label>
            <button onClick={resetAll} style={{ background: "transparent", border: "1px solid #333", color: "#555", padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: "'Barlow', sans-serif", letterSpacing: 1, cursor: "pointer" }}>RESET ALL</button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 40px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#555", fontSize: 14 }}>
            {!showCompleted && completedCount > 0 ? "🕸️ All visible achievements completed! Toggle 'Show completed' to see them." : "No achievements match this filter."}
          </div>
        )}
        {filtered.map((a) => {
          const done = !!completed[a.id];
          const tier = TIER_CONFIG[a.tier];
          const isOpen = !!expanded[a.id];
          return (
            <div key={a.id} style={{ marginBottom: 4 }}>
              {/* Achievement Row */}
              <div
                className={`ach-row ${done ? "ach-row-done" : ""}`}
                onClick={() => toggleExpanded(a.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, width: "100%",
                  padding: "14px 16px",
                  background: done ? "rgba(226,54,54,0.04)" : "#0f0f18",
                  border: `1px solid ${done ? "rgba(226,54,54,0.15)" : "#1a1a26"}`,
                  borderRadius: isOpen ? "8px 8px 0 0" : 8,
                  borderBottom: isOpen ? "none" : undefined,
                  cursor: "pointer", textAlign: "left", fontFamily: "'Barlow', sans-serif",
                }}>
                {/* Checkbox */}
                <div
                  className="check-circle"
                  onClick={(e) => toggleAchievement(a.id, e)}
                  style={{
                    width: 28, height: 28, minWidth: 28, borderRadius: "50%",
                    border: `2px solid ${done ? "#E23636" : tier.color}`,
                    background: done ? "#E23636" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, cursor: "pointer",
                  }}>
                  {done && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#ddd", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ opacity: done ? 0.5 : 1, textDecoration: done ? "line-through" : "none" }}>{a.name}</span>
                    {a.secret && <span style={{ fontSize: 9, fontWeight: 700, color: "#666", background: "#1a1a26", padding: "1px 6px", borderRadius: 3, letterSpacing: 1 }}>SECRET</span>}
                    {a.guide?.includes("cannot be missed") && <span style={{ fontSize: 9, fontWeight: 700, color: "#E23636", background: "rgba(226,54,54,0.1)", padding: "1px 6px", borderRadius: 3, letterSpacing: 1 }}>STORY</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2, opacity: done ? 0.35 : 0.65 }}>{a.desc}</div>
                </div>
                {/* Tier + Expand */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", background: tier.color }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: tier.color }}>{tier.label}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", opacity: 0.4 }}>
                    <path d="M3 5L7 9L11 5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {/* Guide Panel */}
              {isOpen && (
                <div style={{
                  padding: "14px 16px 14px 58px",
                  background: done ? "rgba(226,54,54,0.02)" : "#0c0c14",
                  borderLeft: `1px solid ${done ? "rgba(226,54,54,0.15)" : "#1a1a26"}`,
                  borderRight: `1px solid ${done ? "rgba(226,54,54,0.15)" : "#1a1a26"}`,
                  borderBottom: `1px solid ${done ? "rgba(226,54,54,0.15)" : "#1a1a26"}`,
                  borderRadius: "0 0 8px 8px",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#E23636", whiteSpace: "nowrap", marginTop: 1 }}>HOW TO</span>
                    <p style={{ fontSize: 13, color: "#999", lineHeight: 1.65, margin: 0 }}>{a.guide}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1a1a24", padding: "16px 20px", marginTop: 20 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#555", flexWrap: "wrap", gap: 8 }}>
          <span>🕷️ Progress saves automatically · Tap any row to see how to unlock it</span>
          <span style={{ opacity: 0.4 }}>{totalCount} achievements · Base game + City That Never Sleeps DLC</span>
        </div>
      </footer>
    </div>
  );
}
