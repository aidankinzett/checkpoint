import { expect, test, describe } from "vitest";
import { getGame, getAllGames } from "./registry";

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
});
