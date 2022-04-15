/**
 * Pushs an array or a single value into the thisArg;
 */
export function pushArray<T>(thisArg: Array<T>, src: Array<T> | T): void {
    if (!(src instanceof Array)) {
        thisArg.push(src);
        return;
    }

    src.forEach(function(item) {
        thisArg.push(item);
    });
}

/**
 * Turns the values in an object into an array
 */
export function makeArray(o: Object) {
    const ret = [];
    for (let n in o) {
        if (o.hasOwnProperty(n)) {
            ret.push(o[n]);
        }
    }
    return ret;
}
