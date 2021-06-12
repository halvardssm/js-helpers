/** Will loop around the array.
 *
 * Takes an array and the index of the array to access.
 * When index is larger than the array length,
 * it will loop around and start from the beginning.
 *
 *    arrayLoopAround([1,2,3], 3) // 1
 *    arrayLoopAround([1,2,3], 4) // 2
 *    arrayLoopAround([1,2,3], 7) // 2
 */
export function arrayLoopAround<T>(
  array: T[],
  index: number,
): T {
  const arrayLength = array.length;

  if (index < arrayLength && index >= 0) {
    return array[index];
  }

  const adjustedArrayIndex = index -
    (Math.floor(index / arrayLength) * arrayLength);

  return array[adjustedArrayIndex];
}

/** Creates a generator which loops around the array.
 *
 *    const gen = arrayLoopAroundGenerator([1,2], true)
 *    console.log(gen.next().value) // 1
 *    console.log(gen.next().value) // 2
 *    console.log(gen.next().value) // 1
 */
export function* arrayLoopAroundGenerator<T>(
  array: T[],
  ascending = true,
): Generator<T> {
  const arrayLength = array.length;

  if (ascending) {
    let i = 0;

    while (true) {
      yield arrayLoopAround(array, i++);
    }
  } else {
    let i = arrayLength - 1;

    while (true) {
      yield arrayLoopAround(array, i--);
    }
  }
}
