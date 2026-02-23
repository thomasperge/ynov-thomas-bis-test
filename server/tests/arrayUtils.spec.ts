import { map, filter } from "./arrayUtils";

describe("map", () => {
  it("applique la fonction de transformation à chaque élément", () => {
    const changeItem = jest.fn((x: number) => x * 2);
    const items = [1, 2, 3];

    const result = map(items, changeItem);

    expect(result).toEqual([2, 4, 6]);
    expect(changeItem).toHaveBeenCalledTimes(3);
    expect(changeItem).toHaveBeenNthCalledWith(1, 1);
    expect(changeItem).toHaveBeenNthCalledWith(2, 2);
    expect(changeItem).toHaveBeenNthCalledWith(3, 3);
  });

  it("appelée avec les bons paramètres pour chaque entrée", () => {
    const spy = jest.fn((item: string) => item.toUpperCase());
    const items = ["a", "b", "c"];

    map(items, spy);

    expect(spy).toHaveBeenCalledWith("a");
    expect(spy).toHaveBeenCalledWith("b");
    expect(spy).toHaveBeenCalledWith("c");
  });

  it("retourne un tableau vide pour un tableau vide", () => {
    const changeItem = jest.fn();
    expect(map([], changeItem)).toEqual([]);
    expect(changeItem).not.toHaveBeenCalled();
  });
});

describe("filter", () => {
  it("conserve uniquement les éléments pour lesquels le callback retourne true", () => {
    const predicate = jest.fn((x: number) => x % 2 === 0);
    const items = [1, 2, 3, 4, 5];

    const result = filter(items, predicate);

    expect(result).toEqual([2, 4]);
    expect(predicate).toHaveBeenCalledTimes(5);
    expect(predicate).toHaveBeenNthCalledWith(1, 1);
    expect(predicate).toHaveBeenNthCalledWith(2, 2);
    expect(predicate).toHaveBeenNthCalledWith(3, 3);
    expect(predicate).toHaveBeenNthCalledWith(4, 4);
    expect(predicate).toHaveBeenNthCalledWith(5, 5);
  });

  it("appelée avec les bons paramètres pour chaque entrée", () => {
    const spy = jest.fn((item: number) => item > 2);
    const items = [1, 3, 2, 4];

    filter(items, spy);

    expect(spy).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledWith(3);
    expect(spy).toHaveBeenCalledWith(2);
    expect(spy).toHaveBeenCalledWith(4);
  });

  it("retourne un tableau vide pour un tableau vide", () => {
    const predicate = jest.fn();
    expect(filter([], predicate)).toEqual([]);
    expect(predicate).not.toHaveBeenCalled();
  });
});
