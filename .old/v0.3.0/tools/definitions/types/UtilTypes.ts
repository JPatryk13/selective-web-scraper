/**
 * @type This adds a brand or/and constraint to the type `T`
 */
export type BrandedType<T, name extends string> = T & {
    __brand: name;
};

/**
 * Validates if the given `arg` is of the type `T` provided the type `T` has a brand (i.e. 
 * `type T = someTypeDefinition & { __brand: 'T'}`) and `NoBrandT` is defined as `type 
 * NoBrandT = someTypeDefinition`. Returns the variable given as argument if it matches
 * the input/output type `NoBrandT`/`T` definition, else it throws an error.
 * 
 * @param {NoBrandT} arg Input to be verified. 
 * @param {(arg: any) => boolean} isValid function to use for validation.
 * @param {string} errorMessage error message if the `arg` isn't appropriate.
 * @returns {T} Variable of the same value as `arg` converted to the type `T`.
 */
export function getValidGeneric<NoBrandT, T extends NoBrandT>(
    arg: NoBrandT,
    isValid: (arg: NoBrandT) => boolean,
    errorMessage = "Invalid type."
): T {

    if (isValid(arg)) {
        return arg as T;
    } else {
        throw new Error(errorMessage);
    }

}

export interface Constrainable<NoBrandT, T extends NoBrandT> {

    /**
     * Validates if the given `arg` is of the type `T` provided the type `T` has a brand (i.e. 
     * `type T = someTypeDefinition & { __brand: 'T'}`) and `NoBrandT` is defined as `type 
     * NoBrandT = someTypeDefinition`. Returns true | false
     * 
     * @template NoBrandT Same definition as type `T` lacking the custom part with `__brand` argument.
     * @param {any} arg Input to be verified.
     * @returns {boolean} `true` if the `arg` is of type `T`, else `false`.
     */
    isValid(arg: any): boolean;

    /**
     * @template T Desired type the input should be checked against.
     * @template NoBrandT Same definition as type `T` lacking the custom part with `__brand` argument.
     * @param {NoBrandT} arg Input to be verified.
     * @returns {T} Variable of the same value as `arg` converted to the type `T`.
     * @see getValidGeneric
     */
    getValid(arg: NoBrandT): T;
}

export namespace PositiveNumber {
    type NoBrandT = number;

    export type Type = BrandedType<NoBrandT, "PositiveNumber">;

    export const constraint: Constrainable<NoBrandT, Type> = {

        isValid: (arg) => {
            return (arg as number > 0);
        },

        getValid: (arg) => getValidGeneric<NoBrandT, Type>(arg, constraint.isValid, `${arg} must be a positive number.`)

    };
}

export namespace PositiveInteger {
    type NoBrandT = number;

    export type Type = BrandedType<NoBrandT, "PositiveInteger">;

    export const constraint: Constrainable<NoBrandT, Type> = {

        isValid: (arg) => {
            return (arg as number > 0 && Number.isInteger(arg));
        },

        getValid: (arg) => getValidGeneric<NoBrandT, Type>(arg, constraint.isValid, `${arg} must be a positive integer.`)

    }
}

