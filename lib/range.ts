/** Will return an array containing the range. Supports descending ranges as well.
 *
 *      range(0,3) // [0,1,2,3]
 *
 *      for(const i of range(0,3)) {
 *          console.log(i)
 *      }
 *      // 0,1,2,3
 */
export function range(start: number, end: number) {
  if (start === end) {
    return [start];
  }

  if (start > end) {
    return Array.from({ length: start - end + 1 }, (_, i) => start - i);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** A generator for range. Supports descending ranges as well.
 *
 *      for(const i of rangeGenerator(0,3)) {
 *          console.log(i)
 *      }
 *      // 0,1,2,3
 */
export function* rangeGenerator(start: number, end: number) {
  if (start > end) {
    for (let i = start; end <= i; i--) {
      yield i;
    }
  }

  for (let i = start; i <= end; i++) {
    yield i;
  }
}
