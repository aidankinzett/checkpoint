import { expect, test, describe } from "vitest";
import { getGame, getAllGames } from "./registry";
import type { Achievement } from "~/games/types";

describe("games registry", () => {
  describe("getAllGames", () => {
    test("returns all registered games", () => {
      const games = getAllGames();
      expect(Array.isArray(games)).toBe(true);
      expect(games.length).toBe(5);
    });

    test("each game has required properties", () => {
      const games = getAllGames();
      for (const game of games) {
        expect(game).toHaveProperty("id");
        expect(game).toHaveProperty("title");
        expect(typeof game.id).toBe("string");
        expect(typeof game.title).toBe("string");
      }
    });
  });

  describe("getGame", () => {
    test("returns the correct game for a valid ID (spiderman-remastered)", () => {
      const game = getGame("spiderman-remastered");
      expect(game).toBeDefined();
      expect(game?.id).toBe("spiderman-remastered");
      expect(game?.title).toBe("SPIDER-MAN");
    });

    test("returns the correct game for a valid ID (miles-morales)", () => {
      const game = getGame("miles-morales");
      expect(game).toBeDefined();
      expect(game?.id).toBe("miles-morales");
      expect(game?.subtitle).toBe("MILES MORALES");
    });

    test("returns undefined for a non-existent ID", () => {
      const game = getGame("invalid-id");
      expect(game).toBeUndefined();
    });

    test("returns undefined for an empty string ID", () => {
      const game = getGame("");
      expect(game).toBeUndefined();
    });

    test("is case-sensitive (returns undefined for wrong case)", () => {
      // IDs are typically lowercase slugs
      const game = getGame("Spider-Man-Remastered");
      expect(game).toBeUndefined();
    });
  });

  describe("game data integrity", () => {
    const games = getAllGames();

    for (const game of games) {
      describe(`${game.id}`, () => {
        test("achievements have no duplicate IDs", () => {
          const ids = game.achievements.map((a: Achievement) => a.id);
          const uniqueIds = new Set(ids);
          expect(uniqueIds.size).toBe(ids.length);
        });

        test("all achievement tiers reference a key in tierConfig", () => {
          for (const achievement of game.achievements) {
            expect(game.tierConfig).toHaveProperty(achievement.tier);
          }
        });

        test("all achievements have non-empty required fields", () => {
          for (const achievement of game.achievements) {
            expect(achievement.id.length).toBeGreaterThan(0);
            expect(achievement.name.length).toBeGreaterThan(0);
            expect(achievement.desc.length).toBeGreaterThan(0);
            expect(achievement.guide.length).toBeGreaterThan(0);
            expect(achievement.category.length).toBeGreaterThan(0);
          }
        });

        test("extras have no duplicate item IDs within each type", () => {
          for (const extra of game.extras ?? []) {
            const ids = extra.items.map((item) => item.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
          }
        });
      });
    }
  });
});
