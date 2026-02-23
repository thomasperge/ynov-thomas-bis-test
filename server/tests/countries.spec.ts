import { getCountriesStartingWith } from "./countries";

describe("getCountriesStartingWith", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("retourne les pays dont le nom commence par la chaîne donnée", async () => {
    const mockData = {
      data: {
        FR: { country: "France", region: "Europe" },
        FI: { country: "Finland", region: "Europe" },
        DE: { country: "Germany", region: "Europe" },
        ES: { country: "Spain", region: "Europe" },
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await getCountriesStartingWith("Fr");

    expect(result).toEqual(["France"]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.first.org/data/v1/countries?limit=1000"
    );
  });

  it("retourne un tableau vide si aucun pays ne correspond", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            FR: { country: "France", region: "Europe" },
          },
        }),
    });

    const result = await getCountriesStartingWith("Xy");

    expect(result).toEqual([]);
  });

  it("est insensible à la casse", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            FR: { country: "France", region: "Europe" },
          },
        }),
    });

    const result = await getCountriesStartingWith("fR");

    expect(result).toEqual(["France"]);
  });

  it("lance une erreur si l'API échoue", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCountriesStartingWith("Fr")).rejects.toThrow("API error: 500");
  });
});
