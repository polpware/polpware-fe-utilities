/**
 * Replaces the placeholders a given format with the given parameters.
 */
export function replace(format: string, params: { [key: string]: any }): string {
    /*jslint unparam: true */
    return format.replace(/\{([a-zA-Z]+)\}/g, function(s, key) {
        return (typeof params[key] === 'undefined') ? '' : params[key];
    });
}

/**
 * Transforms the given string into one where
 * some characters have been properly replaced with
 * their escape versions.
 */
export function applyEscape(data: string): string {
    data = data
        .replace(/[\\]/g, '\\\\')
        .replace(/[\"]/g, '\\\"')
        .replace(/[\/]/g, '\\/')
        .replace(/[\b]/g, '\\b')
        .replace(/[\f]/g, '\\f')
        .replace(/[\n]/g, '\\n')
        .replace(/[\r]/g, '\\r')
        .replace(/[\t]/g, '\\t');
    return data;
}

/**
 * Undo the work by applyEscape. It replaces the escape
 * characters with their unescaped ones.
 */
export function reverseEscape(data: string): string {
    data = data
        .replace(/\\\\/g, '\\')
        .replace(/\\\"/g, '\"')
        .replace(/\\\//g, '\/')
        .replace(/\\\b/g, '\b')
        .replace(/\\\f/g, '\f')
        .replace(/\\\n/g, '\n')
        .replace(/\\\r/g, '\r')
        .replace(/\\\t/g, '\t');
    return data;
}
