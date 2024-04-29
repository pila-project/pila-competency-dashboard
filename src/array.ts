export function moveElementToFront<T>(array: T[], predicate: (element: T) => boolean): T[] {
    const element = array.find(predicate);
    if (!element) {
        return array;
    }
    return [element, ...array.filter((e) => e !== element)];
}

export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
    const l = Math.min(array1.length, array2.length);
    return new Array(l).fill(undefined).map((_, i) => [array1[i]!, array2[i]!]);
}