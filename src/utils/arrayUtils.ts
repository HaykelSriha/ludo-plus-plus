/** Split array into chunks of size n */
export function chunk<T>(arr: T[], n: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n));
  }
  return result;
}

/** Rotate array left by n positions */
export function rotate<T>(arr: T[], n: number): T[] {
  const len = arr.length;
  if (len === 0) return arr;
  const offset = ((n % len) + len) % len;
  return [...arr.slice(offset), ...arr.slice(0, offset)];
}
