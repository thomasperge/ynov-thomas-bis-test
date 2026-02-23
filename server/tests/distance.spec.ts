import { getDistance } from "../distance";

describe("getDistance", () => {
  it("retourne 0 pour deux points identiques", () => {
    expect(getDistance(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0);
  });

  it("calcule la distance à vol d'oiseau entre Paris et Lyon (environ 390 km)", () => {
    // Paris : 48.8566, 2.3522 — Lyon : 45.7640, 4.8357 (Haversine ≈ 391 km)
    const distance = getDistance(48.8566, 2.3522, 45.764, 4.8357);
    expect(distance).toBeGreaterThan(385);
    expect(distance).toBeLessThan(400);
  });

  it("calcule la distance entre deux points sur l'équateur", () => {
    // 1 degré de longitude à l'équateur ≈ 111 km
    const distance = getDistance(0, 0, 0, 1);
    expect(distance).toBeGreaterThan(110);
    expect(distance).toBeLessThan(112);
  });

  it("retourne une distance positive quel que soit l'ordre des points", () => {
    const d1 = getDistance(48.8566, 2.3522, 45.764, 4.8357);
    const d2 = getDistance(45.764, 4.8357, 48.8566, 2.3522);
    expect(d1).toBeGreaterThan(0);
    expect(d2).toBeGreaterThan(0);
    expect(d1).toBeCloseTo(d2, 5);
  });
});
