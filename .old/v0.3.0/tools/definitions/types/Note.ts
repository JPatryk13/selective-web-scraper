import { BrandedType, Constrainable, getValidGeneric } from "@tools/definitions/types/UtilTypes"

export namespace NoteMap {

    type NoBrandType = {
        title: string | null,
        body: string,
        src: string,
        uuid: string,
        createdAt: number,
        lastUpdatedAt: number
    }

    export type Type = BrandedType<NoBrandType, 'Note.Type'>;

    export const constraint: Constrainable<NoBrandType, Type> = {

        isValid: (arg) => isValidAllEntries(arg, false),

        getValid: (arg) => getValidGeneric<NoBrandType, Type>(
            arg,
            constraint.isValid
        )

    }

    export function isValidAllEntries(arg: any, allowUndefined: boolean) {
        const keys = Object.keys({} as NoBrandType) as (keyof NoBrandType)[];
        for (const key of keys) {
            if (!isValidEntry(key, arg[key])) {
                // may evaluate to true if the value is undefined; if allowUndefined set to true check if that's the case
                if (!(allowUndefined && arg[key] === undefined)) {
                    return false;
                }
            }
        }

        return true;
    }

    export function isValidEntry(entry: keyof Type, value: any): boolean {
        switch (entry) {
            case "title":
                return typeof value === "string" || value === null;
            case "body":
            case "src":
            case "uuid":
                return typeof value === "string";
            case "createdAt":
            case "lastUpdatedAt":
                return typeof value === "number";
            default:
                return false; // Invalid entry
        }
    }
}