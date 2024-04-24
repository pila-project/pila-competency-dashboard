export function moveElementToFront<T>(array: T[], predicate: (element: T) => boolean): T[] {
    const element = array.find(predicate);
    if (!element) {
        return array;
    }
    return [element, ...array.filter((e) => e !== element)];
}