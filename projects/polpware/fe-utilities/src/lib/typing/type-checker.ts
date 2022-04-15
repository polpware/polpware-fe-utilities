/*
BasicTypes := 
    boolean 
  | number 
  | string 
  | date
  | symbol
  | null
  | undefined
  | array 
  | object
  | function
*/


export function isBoolean(x: any): x is boolean {
    return typeof x === 'boolean';
}

export function isNumber(x: any): x is number {
    return typeof x === 'number';
}

export function isString(x: any): x is string {
    return typeof x === 'string';
}

export function isDate(x: any): x is Object {
    return Object.prototype.toString.call(x) === '[object Date]';
}

export function isSymbol(x: any): x is symbol {
    return typeof x === 'symbol';
}

export function isNull(x: any): x is null {
    return x === null;
}

export function isUndefined(x: any): x is undefined {
    return x === undefined;
}

export function isArray(x: any): x is Array<any> {
    return x instanceof Array;
}

export function isObject(x: any): x is Object {
    return typeof x === 'object';
}

export function isFunction(x: any): x is Function {
    return typeof x === 'function';
}

export interface ITypeDef {
    name: string,
    val: any,
    pred: (any) => boolean
};

export const tyBool: ITypeDef = { name: 'Boolean', val: false, pred: isBoolean };
export const tyNull: ITypeDef = { name: 'Null', val: null, pred: isNull };
export const tyUndefined: ITypeDef = { name: 'Undefined', val: undefined, pred: isUndefined };
export const tyNumber: ITypeDef = { name: 'Number', val: 0, pred: isNumber };
export const tyString: ITypeDef = { name: 'String', val: '', pred: isString };
export const tyDate: ITypeDef = { name: 'Object', val: function() { return Date.now(); }, pred: isDate };
export const tySymbol: ITypeDef = { name: 'Symbol', val: null, pred: isSymbol };
export const tyObject: ITypeDef = { name: 'Object', val: function() { return {}; }, pred: isObject };
export const tyArray: ITypeDef = { name: 'Array', val: function() { return []; }, pred: isArray };
export const tyFunction: ITypeDef = { name: 'Function', val: function() { }, pred: isFunction };

/**
 *  Predefined types and their properties.
 */
const preDefinedTypes: { [key: string]: ITypeDef } = {
    tyBool: tyBool,
    tyNull: tyNull,
    tyUndefined: tyUndefined,
    tyNumber: tyNumber,
    tyString: tyString,
    tyDate: tyDate,
    tySymbol: tySymbol,
    tyObject: tyObject,
    tyArray: tyArray,
    tyFunction: tyFunction
};
/**
 * Returns the default value for a given type.
 */
export function defaultValue(ty: ITypeDef): any {
    let val = ty.val;
    if (ty !== tyFunction && typeof val === 'function') {
        val = val();
    }
    return val;
}

/**
 * Type checks if a given value is type of the given ty
 */
export function ok(value: any, ty: ITypeDef): boolean {
    return ty.pred(value);
}

/**
 * Returns the type for the given value.
 */
export function getType(value: any): ITypeDef {
    for (let prop in preDefinedTypes) {
        if (ok(value, preDefinedTypes[prop])) {
            return preDefinedTypes[prop];
        }
    }
    return null;
}

export function assert(value: any, ty: ITypeDef): void {
    if (ok(value, ty)) {
        return;
    }
    throw new Error('type check error: exptected type is ' +
        ty + ' but given type is ' + typeof value);
}
