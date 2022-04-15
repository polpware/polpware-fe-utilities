import * as typeChecker from './type-checker';

export function safeParseString(value: any): string {
    if (!value) {
        return '';
    }

    return value.toString();
}

/**
 * Parses a given value into an integer.
 */
export function safeParseInt(value: any): number {
    if (!value) {
        return 0;
    }
    if (typeChecker.ok(value, typeChecker.tyString)) {
        return parseInt(value, 10);
    }
    if (typeChecker.ok(value, typeChecker.tyNumber)) {
        return value;
    }
    return 0;
}

/**
 * Parses a given value into a float number.
 */
export function safeParseFloat(value: any): number {
    if (!value) {
        return 0.00;
    }
    if (typeChecker.ok(value, typeChecker.tyString)) {
        return parseFloat(value);
    }
    if (typeChecker.ok(value, typeChecker.tyNumber)) {
        return value;
    }
    return 0.00;
}

/**
 * Parses a given value into a bool value.
 */
export function safeParseBool(value: any): boolean {
    if (!value) {
        return false;
    }
    if (typeChecker.ok(value, typeChecker.tyBool)) {
        return value;
    }
    if (typeChecker.ok(value, typeChecker.tyString)) {
        return value.toLowerCase() === 'true';
    }
    if (typeChecker.ok(value, typeChecker.tyNumber)) {
        return value > 0;
    }
    return false;
}

/**
 * Returns if a given value can be safely converted into the given type.
 */
export function convertible(value: any, ty: typeChecker.ITypeDef): boolean {
    if (typeChecker.ok(value, ty)) {
        return true;
    }

    if (typeChecker.isNull(value) || typeChecker.isUndefined(value)) {
        return false;
    }

    if (ty === typeChecker.tyNumber && isNaN(value)) {
        return false;
    }

    // TODO: refine
    return true;
}

/**
 * Safely converts the given value into a value of the given type.
 */
export function convert(value: any, ty: typeChecker.ITypeDef): any {
    if (ty === typeChecker.tyNumber) {
        return safeParseFloat(value);
    }
    if (ty === typeChecker.tyBool) {
        return safeParseBool(value);
    }
    if (ty === typeChecker.tyString) {
        return value.toString();
    }

    throw new Error('Cannot convert the given value to the given type');
}
