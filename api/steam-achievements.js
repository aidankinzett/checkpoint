const STEAM_API_BASE = "https://api.steampowered.com";
const APP_ID = "1817070"; // Marvel's Spider-Man Remastered

function parseSteamProfile(input) {
  const trimmed = input.trim().replace(/\/+$/, "");

  // Raw 64-bit Steam ID (17 digits)
  if (/^\d{17}$/.test(trimmed)) {
    return { steamId: trimmed };
  }

  // Full profile URL: steamcommunity.com/profiles/<id>
  const profileMatch = trimmed.match(
    /steamcommunity\.com\/profiles\/(\d{17})/
  );
  if (profileMatch) {
    return { steamId: profileMatch[1] };
  }

  // Vanity URL: steamcommunity.com/id/<name>
  const vanityUrlMatch = trimmed.match(/steamcommunity\.com\/id\/([^/]+)/);
  if (vanityUrlMatch) {
    return { vanityName: vanityUrlMatch[1] };
  }

  // Bare vanity name (no slashes, not all digits)
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed) && !/^\d+$/.test(trimmed)) {
    return { vanityName: trimmed };
  }

  return null;
}

async function resolveVanityUrl(apiKey, vanityName) {
  const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${encodeURIComponent(vanityName)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`);
  }
  const data = await res.json();
  if (data.response.success !== 1) {
    throw new Error(
      `Could not resolve Steam vanity URL "${vanityName}". Check the profile name.`
    );
  }
  return data.response.steamid;
}

async function getPlayerAchievements(apiKey, steamId) {
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamId}&appid=${APP_ID}&l=english`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`);
  }
  const data = await res.json();

  if (!data.playerstats.success) {
    throw new Error(
      data.playerstats.error ||
        "Failed to fetch achievements. The profile may be private."
    );
  }

  return data.playerstats.achievements.map((a) => ({
    name: a.name,
    achieved: a.achieved === 1,
  }));
}

export default async function handler(req, res) {
  const { profile } = req.query;

  if (!profile) {
    return res.status(400).json({
      error:
        "Missing 'profile' query parameter. Provide a Steam profile URL, vanity name, or 64-bit Steam ID.",
    });
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "STEAM_API_KEY is not configured on the server.",
    });
  }

  const parsed = parseSteamProfile(profile);
  if (!parsed) {
    return res.status(400).json({
      error:
        "Invalid profile input. Provide a Steam profile URL (e.g. steamcommunity.com/id/username), vanity name, or 64-bit Steam ID.",
    });
  }

  try {
    let steamId;
    if (parsed.steamId) {
      steamId = parsed.steamId;
    } else {
      steamId = await resolveVanityUrl(apiKey, parsed.vanityName);
    }

    const achievements = await getPlayerAchievements(apiKey, steamId);
    return res.status(200).json({ achievements });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
}
