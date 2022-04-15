/**
 * Encodes a key-value pair, where a value can be an array.
 */
export function urlEncodePair(key: string, value: any, str: Array<string>): void {
    if (value instanceof Array) {
        value.forEach((item) => {
            str.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(item));
        });
    } else {
        str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
}

/**
 * Encodes an object in www form.
 */
export function urlEncode(data: Object): string {
    const str: Array<string> = [];
    for (let p in data) {
        if (data.hasOwnProperty(p)) {
            urlEncodePair(p, data[p], str);
        }
    }
    return str.join('&').replace(/%20/g, '+');
}

export function getParamByName(name: string, url: string): string | null {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?#&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getQueryParamByName(name: string, url?: string): string | null {
    if (!url) {
        url = window.location.href;
    }
    return getParamByName(name, url);
}

export function getHashParamByName(name: string, url?: string): string | null {
    if (!url) {
        url = window.location.hash;
    }
    return getParamByName(name, url);
}
