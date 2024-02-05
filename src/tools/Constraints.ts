import { Constrainable, MID, Payload as PayloadTypes } from "@tools/Types";
import { IncorrectTypeWarning, UndefinedValueWarning, MissingRequiredKeys, NotPartOfSchemaWarning } from "@tools/Errors";

import SortBy = PayloadTypes.SortBy;

// export class ResponseStatus implements Constrainable<ResponseStatus> {

//     constructor(public warnings: string[]) { }

//     isValid(obj: { [key: string]: any; statusCode?: number; success?: boolean; }) {

//         if (obj.statusCode === undefined) { this.warnings.push(UndefinedWithinObjectWarning('statusCode', ['success', 'statusCode'], obj)); }
//         if (obj.success === undefined) { this.warnings.push(UndefinedWithinObjectWarning('success', ['success', 'statusCode'], obj)); }
//         if (typeof obj.statusCode !== 'number') { this.warnings.push(IncorrectTypeWarning(obj.statusCode, 'statusCode', ['number'])); }
//         if (typeof obj.success !== 'boolean') { this.warnings.push(IncorrectTypeWarning(obj.success, 'success', ['boolean'])); }

//         return this;
//     }

//     isPartiallyValid(obj: any, keys: any) {

//         throw new NotImplementedError;
//     }

//     getSchema() {
//         return {
//             success: 'boolean', statusCode: 'number'
//         };
//     }

//     onFail(action) {

//     }
// }

export const ResponseStatus: Constrainable = {
    isValid: (obj, keys, getWarnings) => {

        let warnings: string[] = [];

        if (obj.statusCode === undefined) { warnings.push(MissingRequiredKeys(Object.keys(obj), ['success', 'statusCode'])); }
        if (obj.success === undefined) { warnings.push(MissingRequiredKeys(Object.keys(obj), ['success', 'statusCode'])); }
        if (typeof obj.statusCode !== 'number') { warnings.push(IncorrectTypeWarning(obj.statusCode, 'statusCode', ['number'])); }
        if (typeof obj.success !== 'boolean') { warnings.push(IncorrectTypeWarning(obj.success, 'success', ['boolean'])); }

        return getWarnings ? warnings : warnings.length === 0;
    },

    eval: () => {
        return { success: 'boolean', statusCode: 'number' };
    }
}

export const Message: Constrainable = {
    isValid: (obj, keys, getWarnings) => {

        const objectKeys = Object.keys(obj); // keys within the object
        const givenKeys = keys; // keys specified as an input
        let schema = Object.keys(Message.eval()); // all keys within the schema
        const requiredKeys = schema.filter((key) => !key.includes('?'));
        const optionalKeys = schema.filter((key) => key.includes('?'));
        let warnings: string[] = [];

        schema = schema.map((key) => key.replace('?', ''));

        function isValidField(keyToCheck: string): string[] {
            switch (keyToCheck) {
                case ('mid'): {
                    if (!Object.values(MID).includes(obj.mid)) {
                        return [IncorrectTypeWarning(obj.mid, 'mid', ['MID'])];
                    }
                    break;
                }
                case ('payload'): { break; }
                case ('externalResponseStatus'): {
                    // first check if mid exists and is ok, this field depends on the value of mid
                    if (obj.mid && isValidField('mid').length === 0) {
                        // mid exists and has a valid format
                        if (obj.mid.toLowerCase().includes('response') && obj.mid !== MID.ResponseGetScreenWidth) {
                            // it is response-like message
                            if (obj.externalResponseStatus) {
                                // it has externalResponseStatus - verify if it is valid
                                return ResponseStatus.isValid(obj.externalResponseStatus, undefined, true) as string[];
                            } else {
                                return ["Found response-like 'mid' but 'externalResponseStatus' is missing."];
                            }
                        } else {
                            // it is not response-like
                            if (obj.externalResponseStatus) {
                                // but it has externalResponseStatus
                                return ["Found 'externalResponseStatus' but the message is not response-like or doesn't come from an external source."];
                            }
                        }
                    } else {
                        // mid is not valid / doesn't exist
                        return [...isValidField('mid'), "'externalResponseStatus' requires 'mid' toexist and have a valid format."]
                    }

                    break;
                }
                case ('_sender'): {
                    if (typeof obj._sender !== 'string') {
                        return [IncorrectTypeWarning(obj._sender, '_sender', ['string'])];
                    }
                    break;
                }
                case ('_recipient'): {
                    if (typeof obj._recipient !== 'string') {
                        return [IncorrectTypeWarning(obj._recipient, '_recipient', ['string'])];
                    }
                    break;
                }
                default: { return [NotPartOfSchemaWarning([keyToCheck], requiredKeys, optionalKeys)]; } // when given key doesn't exist within the obj and it should not exist
            }

            return [];
        }


        if (givenKeys) {
            // check if given keys (provided as an input) are part of the schema
            if (!givenKeys.every((k) => [...requiredKeys, ...optionalKeys].includes(k))) {
                warnings.push(
                    NotPartOfSchemaWarning(
                        givenKeys.filter((k) => ![...requiredKeys, ...optionalKeys].includes(k)),
                        requiredKeys,
                        optionalKeys
                    )
                );

                return getWarnings ? warnings : false;
            } else {
                /* I need to first check if the object has all the keys given as an input,
                then I can just iterate over the provided keys and check if they're the right type.
                Doesn't work forspecifying optional inputs. If optional field, 'externalResponseStatus',
                is given, will be treated as required */
                if (objectKeys === givenKeys) {
                    for (const key of givenKeys) {
                        warnings.push(...isValidField(key))
                    }
                } else {
                    warnings.push(`Object doesn't fit provided parameters. Object keys: ${objectKeys}, provided parameters: ${givenKeys}, schema: ${schema}`);
                }
            }
        } else {
            /* No keys given as an input, all schema parameters are subject to checking.
            Firstly, verify if the keys exist as per required fields. Optional field, here
            'externalResponseStatus', is conditional - value of mid will dictate its presence. */

            if (requiredKeys.every((key) => objectKeys.includes(key))) {
                const schemaAndObjectKeys = new Set([...schema, ...objectKeys]); // for that one should separate warning
                for (const key of schemaAndObjectKeys) {
                    warnings.push(...isValidField(key));
                }
            } else {
                warnings.push(MissingRequiredKeys(objectKeys, requiredKeys));
            }
        }

        /* Currently it is developer's responsibility to ensure the mid and payload have valid formats */
        // if (warnings.length === 0) {
        //     // no other errors present, check if the message has appropriate payload considering MID and externalResponseStatus.success if present
        //     let checkPayloadAndMid = true;
        //     if (obj.externalResponseStatus !== undefined) {
        //         if (!obj.externalResponseStatus.success) {
        //             if (obj.payload !== null) {
        //                 warnings.push("externalResponseStatus indicates unsuccessful response, however payload is present.");
        //                 checkPayloadAndMid = false;
        //             } // else (defined externalResponseStatus, .success = false and payload is null) -> all good
        //         } // else (defined externalResponseStatus, .success = true) -> (it is response-like) need to check payload type and mid value
        //     } // else (undefined externalResponseStatus) -> (it is request-like, Log or ResponseGetScreenWidth) need to check payload type and mid value

        //     if (checkPayloadAndMid) {
        //         switch (obj.mid) {
        //             case (MID.RequestCreateNote): {
        //                 warnings.push(...(Payload.RequestCreateNote.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.ResponseCreateNote): {
        //                 warnings.push(...(Payload.ResponseCreateNote.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.RequestUpdateNote): {
        //                 warnings.push(...(Payload.RequestUpdateNote.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.ResponseUpdateNote): {
        //                 warnings.push(...(Payload.ResponseUpdateNote.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.RequestDeleteNote): {
        //                 warnings.push(...(Payload.RequestDeleteNote.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.ResponseDeleteNote): {
        //                 warnings.push(...(Payload.ResponseDeleteNote.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.RequestGetSingleNote): {
        //                 warnings.push(...(Payload.RequestGetSingleNote.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.ResponseGetSingleNote): {
        //                 warnings.push(...(Payload.ResponseGetSingleNote.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.RequestGetManyNotes): {
        //                 warnings.push(...(Payload.RequestGetManyNotes.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.ResponseGetManyNotes): {
        //                 warnings.push(...(Payload.ResponseGetManyNotes.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.RequestGetScreenWidth): {
        //                 warnings.push(...(Payload.RequestGetScreenWidth.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.ResponseGetScreenWidth): {
        //                 warnings.push(...(Payload.ResponseGetScreenWidth.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.UserRedirect): {
        //                 warnings.push(...(Payload.UserRedirect.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //             case (MID.Log): {
        //                 warnings.push(...(Payload.Log.isValid(obj.payload, undefined, true) as string[]));
        //                 break;
        //             }
        //         }
        //     }
        // }

        return getWarnings ? warnings : warnings.length === 0;

    },

    eval: () => {
        return {
            mid: 'MID', payload: 'any', 'externalResponseStatus?': 'ResponseStatus', _sender: 'string', _recipient: 'string'
        };
    }
}

export const Note: Constrainable = {
    isValid: (obj, keys, getWarnings) => {

        // if no keys given iterate over the key-val pairs from the obj
        const definedKeys: string[] = keys ? keys : Object.keys(Note.eval());
        let warnings: string[] = [];

        if (Object.keys(obj).every((key) => definedKeys.includes(key))) {
            for (const key of definedKeys) {
                // when given key doesn't exist on the object and probably should
                if (!(key in obj)) {
                    warnings.push(MissingRequiredKeys(Object.keys(obj), definedKeys));
                } else {
                    switch (key) {
                        case ('title'): {
                            if (!(typeof obj.title === 'string' || obj.title === null)) {
                                warnings.push(IncorrectTypeWarning(obj.title, 'title', ['string', 'null']));
                            }
                            break;
                        }
                        case ('body'): {
                            if (typeof obj.body !== 'string') {
                                warnings.push(IncorrectTypeWarning(obj.body, 'body', ['string']));
                            }
                            break;
                        }
                        case ('src'): {
                            if (typeof obj.src !== 'string') {
                                warnings.push(IncorrectTypeWarning(obj.src, 'src', ['string']));
                            }
                            break;
                        }
                        case ('uuid'): {
                            if (typeof obj.uuid !== 'string') {
                                warnings.push(IncorrectTypeWarning(obj.uuid, 'uuid', ['string']));
                            }
                            break;
                        }
                        case ('createdAt'): {
                            if (typeof obj.createdAt !== 'number') {
                                warnings.push(IncorrectTypeWarning(obj.createdAt, 'createdAt', ['number']));
                            }
                            break;
                        }
                        case ('lastUpdatedAt'): {
                            if (typeof obj.lastUpdatedAt !== 'number') {
                                warnings.push(IncorrectTypeWarning(obj.lastUpdatedAt, 'lastUpdatedAt', ['number']));
                            }
                            break;
                        }
                        default: { warnings.push(NotPartOfSchemaWarning([key], definedKeys, [])); }
                    } // switch
                } // else
            } // for
        } else {
            warnings.push(NotPartOfSchemaWarning(["I dont know what keys, okay? There are some extra ones. Just check the code."], definedKeys, []));
        }

        return getWarnings ? warnings : (warnings.length === 0);
    },

    eval: () => {
        return {
            title: 'string | null', body: 'string', src: 'string', uuid: 'string', createdAt: 'number', lastUpdatedAt: 'number'
        };
    }
}

export namespace Payload {
    export const RequestCreateNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, ['title', 'body', 'src'], getWarnings),
        eval: () => {
            return {
                title: 'Note["title"]', body: 'Note["body"]', src: 'Note["src"]'
            };
        }
    }

    export const RequestUpdateNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            const isValid: boolean = (Note.isValid(obj, ['uuid', 'title']) || Note.isValid(obj, ['uuid', 'body']) || Note.isValid(obj, ['uuid', 'src'])) as boolean;
            if (getWarnings && !isValid) {
                return [
                    ...(Note.isValid(obj, ['uuid', 'title'], true) as string[]),
                    ...(Note.isValid(obj, ['uuid', 'body'], true) as string[]),
                    ...(Note.isValid(obj, ['uuid', 'src'], true) as string[])
                ]
            } else {
                return getWarnings ? [] : isValid;
            }
        },
        eval: () => {
            return {
                uuid: 'Note["uuid"]', 'title?': '?Note["title"]', 'body?': '?Note["body"]', 'src?': '?Note["src"]'
            };
        }
    }

    export const RequestDeleteNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, ['uuid'], getWarnings),
        eval: () => { return { uuid: 'Note["uuid"]' }; }
    }

    export const RequestGetSingleNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, ['uuid'], getWarnings),
        eval: () => { return { uuid: 'Note["uuid"]' }; }
    }

    export const RequestGetManyNotes: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            let countValid, sortByValid, searchPhraseValid, noExtraFields: boolean;
            const requiredKeys = Object.keys(RequestGetManyNotes.eval()).filter((key) => !key.includes('?'));
            const optionalKeys = Object.keys(RequestGetManyNotes.eval()).filter((key) => key.includes('?')).map((key) => key.replace('?', ''));
            let warnings: string[] = [];

            // Check the obj.count value
            if (typeof obj.count === "number") {
                countValid = obj.count > 0 && Number.isInteger(obj.count); // expecting positive integer
            } else {
                countValid = false;
                warnings.push("'count' is not a positive integer.");
            }

            // Check the obj.sortBy and obj.searchPhrase values
            if (Object.values(SortBy).includes(obj.sortBy)) { // expecting a member of SortBy

                sortByValid = true;

                if (obj.sortBy === SortBy.mostRelevant) {
                    // expecting searchPhrase to be set
                    if (obj.searchPhrase) {
                        if (typeof obj.searchPhrase === 'object') {
                            searchPhraseValid = (Note.isValid(obj.searchPhrase, ['title']) || Note.isValid(obj.searchPhrase, ['body']) || Note.isValid(obj.searchPhrase, ['src'])) as boolean;
                            if (!searchPhraseValid) { warnings.push("'searchPhrase' has invalid format."); }
                        } else {
                            searchPhraseValid = false;
                            warnings.push(IncorrectTypeWarning(obj.searchPhrase, 'searchPhrase', ['object']));
                        }
                    } else {
                        searchPhraseValid = false;
                        warnings.push("'searchPhrase' is not defined while 'sortBy' is set to 'SortBy.mostRelevant'.");
                    }
                } else {
                    searchPhraseValid = true;
                }
            } else {
                sortByValid = false;
                searchPhraseValid = true;
                warnings.push("'sortBy' is not a member of 'SortBy'.");
            }

            // check if there are any extra fields given
            if (obj.searchPhrase) {
                if (Object.keys(obj).every((key) => [...requiredKeys, ...optionalKeys].includes(key))) {
                    if (Object.keys(obj.searchPhrase).length === 1) {
                        noExtraFields = true;
                    } else {
                        noExtraFields = false;
                        warnings.push('Found an extra field in obj.searchPhrase.');
                    }
                } else {
                    noExtraFields = false;
                    warnings.push('Found an extra field in the object.');
                }
            } else {
                if (Object.keys(obj).every((key) => requiredKeys.includes(key))) {
                    noExtraFields = true;
                } else {
                    noExtraFields = false;
                    warnings.push('Found an extra field in the object.')
                }
            }

            return getWarnings ? warnings : countValid && sortByValid && searchPhraseValid && noExtraFields;
        },

        eval: () => {
            return {
                count: 'number',
                sortBy: 'SortBy',
                'searchPhrase?': { 'title|body|src': 'Note["title|body|src"]' }
            };
        }
    }

    export const RequestGetScreenWidth: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            if (obj === null) {
                return getWarnings ? [] : true;
            } else {
                return getWarnings ? [IncorrectTypeWarning(obj, 'payload', ['null'])] : false;
            }
        },
        eval: () => 'null'
    }

    export const UserRedirect: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            let warnings: string[] = [];
            if (obj.url) {
                if (typeof obj.url !== 'string') {
                    warnings.push(IncorrectTypeWarning(obj.url, 'url', ['string']));
                }
            } else {
                warnings.push(MissingRequiredKeys(Object.keys(obj), ['url']));
            }

            return getWarnings ? warnings : warnings.length === 0;

        },
        eval: () => {
            return {
                url: 'string'
            };
        }
    }

    export const ResponseCreateNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, undefined, getWarnings),
        eval: () => Note.eval()
    }

    export const ResponseUpdateNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, ['lastUpdatedAt'], getWarnings),
        eval: () => {
            return {
                lastUpdatedAt: 'Note["lastUpdatedAt"]'
            };
        }
    }

    export const ResponseDeleteNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            let warnings: string[] = [];
            if (obj.success) {
                if (typeof obj.success !== 'boolean') {
                    warnings.push(IncorrectTypeWarning(obj.success, 'success', ['boolean']));
                }
            } else {
                warnings.push(MissingRequiredKeys(Object.keys(obj), ['success']));
            }

            return getWarnings ? warnings : warnings.length === 0;

        },
        eval: () => {
            return {
                success: 'boolean'
            };
        }
    }

    export const ResponseGetSingleNote: Constrainable = {
        isValid: (obj) => Note.isValid(obj),
        eval: () => Note.eval()
    }

    export const ResponseGetManyNotes: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {

            if (obj.notes) {
                if (Array.isArray(obj.notes)) {
                    for (const note of obj.notes) {
                        if (!Note.isValid(note)) {
                            return Note.isValid(note, _keys, getWarnings);
                        }
                    }
                    return getWarnings ? [] : true;
                } else {
                    return getWarnings ? ["'notes' is not an array"] : false;
                }
            } else {
                return getWarnings ? ["'notes' is not defined."] : false;
            }
        },

        eval: () => {
            return {
                notes: 'Note[]'
            };
        }
    }

    export const ResponseGetScreenWidth: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            let warnings: string[] = [];
            if (obj.screenWidth) {
                if (typeof obj.screenWidth !== 'number') {
                    warnings.push(IncorrectTypeWarning(obj.screenWidth, 'screenWidth', ['number']));
                } else if (!(obj.screenWidth > 0)) {
                    warnings.push(`'screenWidth' is not a positive number. Got ${obj.screenWidth}`);
                }
            } else {
                warnings.push(MissingRequiredKeys(Object.keys(obj), ['screenWidth']));
            }

            return getWarnings ? warnings : warnings.length === 0;

        },

        eval: () => {
            return {
                screenWidth: 'number'
            };
        }
    }
}
