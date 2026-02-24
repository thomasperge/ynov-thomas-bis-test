import { getDistance } from "./getDistance";

describe("getDistance (src/utils)", () => {
  it("retourne 0 pour deux points identiques", () => {
    const p = { lat: 48.8566, lng: 2.3522 };
    expect(getDistance(p, p)).toBe(0);
  });

  it("calcule la distance entre Paris et Lyon (environ 390 km)", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const lyon = { lat: 45.764, lng: 4.8357 };
    const distance = getDistance(paris, lyon);
    expect(distance).toBeGreaterThan(385000);
    expect(distance).toBeLessThan(400000);
  });

  it("retourne la même distance quel que soit l'ordre des points", () => {
    const a = { lat: 48.8566, lng: 2.3522 };
    const b = { lat: 45.764, lng: 4.8357 };
    expect(getDistance(a, b)).toBeCloseTo(getDistance(b, a), 0);
  });
});
