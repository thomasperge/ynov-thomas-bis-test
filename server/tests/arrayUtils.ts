/**
 * Applique une fonction de transformation à chaque élément du tableau.
 * Implémentation sans utiliser Array.map ni aucune méthode des tableaux.
 */
export function map<T, U>(
  items: T[],
  changeItem: (item: T) => U
): U[] {
  const result: U[] = [];
  for (let i = 0; i < items.length; i++) {
    result.push(changeItem(items[i]));
  }
  return result;
}

/**
 * Filtre les éléments du tableau selon le résultat (vrai/faux) du callback.
 * Implémentation sans utiliser Array.filter ni aucune méthode des tableaux.
 */
export function filter<T>(
  items: T[],
  predicate: (item: T) => boolean
): T[] {
  const result: T[] = [];
  for (let i = 0; i < items.length; i++) {
    if (predicate(items[i])) {
      result.push(items[i]);
    }
  }
  return result;
}
