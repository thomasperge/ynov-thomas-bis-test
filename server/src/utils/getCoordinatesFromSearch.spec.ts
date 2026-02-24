import axios from "axios";
import { getCoordinatesFromSearch } from "./getCoordinatesFromSearch";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getCoordinatesFromSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retourne les coordonnées quand l'API renvoie des features valides", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        features: [
          {
            geometry: { coordinates: [2.35, 48.85] },
          },
        ],
      },
    });

    const result = await getCoordinatesFromSearch("Paris");
    expect(result).toEqual({ lng: 2.35, lat: 48.85 });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("q=Paris"),
    );
  });

  it("retourne null quand features est vide", async () => {
    mockedAxios.get.mockResolvedValue({ data: { features: [] } });
    const result = await getCoordinatesFromSearch("xyz");
    expect(result).toBeNull();
  });

  it("retourne null quand aucune feature n'a de geometry.coordinates à 2 éléments", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        features: [
          { geometry: { coordinates: [1] } },
          { geometry: {} },
        ],
      },
    });
    const result = await getCoordinatesFromSearch("nope");
    expect(result).toBeNull();
  });

  it("retourne null en cas d'erreur réseau", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error("Network error"));
    const result = await getCoordinatesFromSearch("Paris");
    expect(result).toBeNull();
    consoleSpy.mockRestore();
  });
});
