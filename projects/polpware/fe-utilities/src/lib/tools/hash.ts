/**
 * @fileOverview
 * Provides utilities for computing hash values
 */

import * as typeChecker from '../typing/type-checker';

/**
 * Computes the hash code for a given value.
 * This method takes into account the type of the given
 * value when generating its hash code.
 */
export function hashCode(value: any): number {
    let hash = 0;
    if (typeChecker.ok(value, typeChecker.tyBool)) {
        value = value ? 1 : 0;
    } else if (typeChecker.ok(value, typeChecker.tyNumber)) {
        if (value === 0) {
            return 0;
        }
    }

    if (!value) {
        return 0;
    }

    value = value.toString();
    if (value.length === 0) {
        return hash;
    }
    /*jslint plusplus: true */
    for (let i = 0, len = value.length; i < len; i++) {
        const chr = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Computes the hash code for a member of an object.
 */
function hashPrimitiveMember(name: string, value: any, configuration: { [key: string]: number }) {
    const code = hashCode(value);
    if (configuration) {
        const bits = configuration[name];
        if (bits) {
            return code << configuration[name];
        }
    }
    return code;
}

/**
 * Computes the hash code for a member of an object, based on
 * the given member member, the value to be hashed, and the configuration
 * about how each member contributes to the enire hash code of the
 * object.
 */
export function hashMember(name: string, value: any, configuration: { [key: string]: number }) {
    if (typeChecker.ok(value, typeChecker.tyArray)) {
        let code = 0;
        /*jslint plusplus: true */
        for (let i = 0; i < value.length; i++) {
            code = code + hashPrimitiveMember(name, value[i], configuration);
        }
        return code;
    }
    return hashPrimitiveMember(name, value, configuration);
}
