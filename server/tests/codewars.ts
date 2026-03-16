// Facile (7 kyu) : Disemvowel Trolls
export function disemvowel(str: string): string {
  return str.replace(/[aeiou]/gi, "");
}

// Moyen (6 kyu) : Unique In Order
export function uniqueInOrder(input: string | any[]): any[] {
  const arr = typeof input === "string" ? input.split("") : input;
  const result: any[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      result.push(arr[i]);
    }
  }

  return result;
}

// Difficile (4 kyu) : Snail Sort
export function snail(matrix: number[][]): number[] {
  if (matrix.length === 0 || matrix[0].length === 0) return [];

  const result: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;

    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;

    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }

    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }

  return result;
}
