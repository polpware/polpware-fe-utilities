// firstSet - secondSet (any element not in secondSet)
export function diff<T, U>(firstSet: Array<T>,
    secondSet: Array<U>,
    predicate: (firstElem: T, secondElem: U) => boolean): Array<T> {
    return firstSet.filter((x: T) => {
        return !secondSet.some((y: U) => {
            return predicate(x, y);
        });
    });
}

// firstSet intersection secondSet
export function intersection<T, U>(firstSet: Array<T>,
    secondSet: Array<U>,
    predicate: (firstElem: T, secondElem: U) => boolean): Array<T> {
    return firstSet.filter((x: T) => {
        return secondSet.some((y: U) => {
            return predicate(x, y);
        });
    });
}
