/**
 * Codewars TDD - 3 algorithmes (facile, moyen, difficile)
 *
 * Sur Codewars, les tests sont au cœur de la résolution :
 * - Chaque kata fournit des tests pré-écrits que le code doit satisfaire
 * - On code itérativement jusqu'à ce que tous les tests passent
 * - C'est exactement l'approche TDD : RED → GREEN → REFACTOR
 * - Les tests guident la compréhension du problème et les cas limites
 */

import {
  disemvowel,
  uniqueInOrder,
  snail,
} from "./codewars";

// --- FACILE : Disemvowel Trolls (7 kyu) ---
// Enlever toutes les voyelles d'une chaîne

describe("Codewars Facile - disemvowel", () => {
  it("enlève les voyelles minuscules", () => {
    expect(disemvowel("hello")).toBe("hll");
  });

  it("enlève les voyelles majuscules", () => {
    expect(disemvowel("HELLO")).toBe("HLL");
  });

  it("gère une phrase complète", () => {
    expect(disemvowel("This website is for losers LOL!")).toBe(
      "Ths wbst s fr lsrs LL!"
    );
  });

  it("retourne une chaîne vide si que des voyelles", () => {
    expect(disemvowel("aeiouAEIOU")).toBe("");
  });

  it("retourne la même chaîne si pas de voyelles", () => {
    expect(disemvowel("rhythm")).toBe("rhythm");
  });

  it("gère une chaîne vide", () => {
    expect(disemvowel("")).toBe("");
  });
});

// --- MOYEN : Unique In Order (6 kyu) ---
// Retirer les doublons consécutifs tout en gardant l'ordre

describe("Codewars Moyen - uniqueInOrder", () => {
  it("supprime les doublons consécutifs de lettres", () => {
    expect(uniqueInOrder("AAAABBBCCDAABBB")).toEqual([
      "A", "B", "C", "D", "A", "B",
    ]);
  });

  it("fonctionne avec un tableau de nombres", () => {
    expect(uniqueInOrder([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it("gère une chaîne avec un seul caractère répété", () => {
    expect(uniqueInOrder("aaaa")).toEqual(["a"]);
  });

  it("retourne un tableau vide pour une entrée vide", () => {
    expect(uniqueInOrder("")).toEqual([]);
    expect(uniqueInOrder([])).toEqual([]);
  });

  it("garde les éléments non-consécutifs identiques", () => {
    expect(uniqueInOrder("ABBCcAD")).toEqual(["A", "B", "C", "c", "A", "D"]);
  });
});

// --- DIFFICILE : Snail Sort (4 kyu) ---
// Parcourir une matrice en spirale (sens horaire)

describe("Codewars Difficile - snail", () => {
  it("gère une matrice 1x1", () => {
    expect(snail([[1]])).toEqual([1]);
  });

  it("gère une matrice 2x2", () => {
    expect(snail([
      [1, 2],
      [3, 4],
    ])).toEqual([1, 2, 4, 3]);
  });

  it("gère une matrice 3x3", () => {
    expect(snail([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
  });

  it("gère une matrice 4x4", () => {
    expect(snail([
      [1,  2,  3,  4],
      [5,  6,  7,  8],
      [9,  10, 11, 12],
      [13, 14, 15, 16],
    ])).toEqual([1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10]);
  });

  it("gère une matrice vide", () => {
    expect(snail([])).toEqual([]);
    expect(snail([[]])).toEqual([]);
  });
});
