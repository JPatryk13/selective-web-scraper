import { NoteMap } from "@tools/definitions/types/Note"
import { PositiveInteger, PositiveNumber, BrandedType, Constrainable, getValidGeneric } from "@tools/definitions/types/UtilTypes"

export namespace Payload {

    export namespace Request {

        export namespace CreateNote {
            export type NoBrandType = {
                title: NoteMap.Type["title"],
                body: NoteMap.Type["body"],
                src: NoteMap.Type["src"]
            }

            /**
             * ```
             * export type NoBrandType = {
             *     title: NoteMap.Type["title"],
             *     body: NoteMap.Type["body"],
             *     src: NoteMap.Type["src"]
             * }
             * ```
             */
            export type Type = BrandedType<NoBrandType, "Payload.Request.CreateNote.Type">

            export const constraint: Constrainable<NoBrandType, Type> = {
                isValid: (arg) => {
                    // add extra definition for validation of each particular entry
                    return (arg.title !== undefined && arg.body !== undefined && arg.src !== undefined);
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(arg, constraint.isValid)
            }
        }

        export namespace UpdateNote {
            export type NoBrandType = {
                uuid: NoteMap.Type["uuid"],
                title?: NoteMap.Type["title"],
                body?: NoteMap.Type["body"],
                src?: NoteMap.Type["src"]
            }

            /**
             * ```
             * export type NoBrandType = {
             *     uuid: BaseNoteMap["uuid"],
             *     title?: BaseNoteMap["title"],
             *     body?: BaseNoteMap["body"],
             *     src?: BaseNoteMap["src"]
             * }
             * ```
             */
            export type Type = BrandedType<NoBrandType, "Payload.Request.UpdateNote.Type">;

            // RequestUpdateNotePayload type constraint - check if at least one of the optional parameters is present
            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => {
                    return [arg.body, arg.title, arg.src].some(arg => arg !== undefined);
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )

            }
        }

        export namespace DeleteNote {

            export type NoBrandType = {
                uuid: NoteMap.Type["uuid"]
            }

            /**
             * ```
             * export type NoBrandType = {
             *     uuid: NoteMap.Type["uuid"]
             * }
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Request.DeleteNote.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {
                isValid: (arg) => {
                    return NoteMap.isValidEntry('uuid', arg.uuid);
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )
            }

        }

        export namespace GetNote {

            export type NoBrandType = {
                uuid: NoteMap.Type["uuid"]
            }

            /**
             * ```
             * export type NoBrandType = {
             *     uuid: NoteMap.Type["uuid"]
             * }
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Request.GetNote.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {
                isValid: (arg) => {
                    return NoteMap.isValidEntry('uuid', arg.uuid);
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )
            }
        }

        export namespace GetManyNotes {
            export enum SortBy {
                addedNewest = 'Added: Newest',
                addedOldest = 'Added: Oldest',
                mostRelevant = 'Most relevant'
            }

            export type NoBrandType = {
                count: PositiveInteger.Type,
                sortBy: SortBy,
                searchPhrase?: { title: NoteMap.Type["title"] } | { body: NoteMap.Type["body"] } | { src: NoteMap.Type["src"] } | undefined
            }

            /**
             * ```
             * export type NoBrandType = {
             *     count: PositiveInteger.Type,
             *     sortBy: 'Added: Newest' | 'Added: Oldest' | 'Most relevant',
             *     searchPhrase?: { title: NoteMap.Type["title"] } | { body: NoteMap.Type["body"] } | { src: NoteMap.Type["src"] } | undefined
             * }
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Request.GetManyNotes.Type'>;

            // RequestGetManyNotesPayload type constraint - check if the searchPhrase is specified if the sortBy is set to 'Most relevant'
            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => {
                    return (arg.sortBy === 'Most relevant' && arg.searchPhrase !== undefined) || arg.sortBy !== 'Most relevant';
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )

            }

        }

        export namespace GetScreenWidth {

            export type NoBrandType = null;

            /**
             * ```
             * type Type = null & { __brand: 'Payload.Request.GetScreenWidth.Type' }
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Request.GetScreenWidth.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => arg === null,

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )
            }

        }

        export namespace UserRedirect {

            export type NoBrandType = {
                url: string;
            };

            /**
             * ```
             * export type NoBrandType = {
             *     url: string;
             * };
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Request.UserRedirect.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => typeof arg === 'string',

                getValid: (arg) => getValidGeneric(
                    arg,
                    constraint.isValid
                )

            }
        }

        export namespace Log {

            export type RunnerLog = {
                worker?: string,
                class?: string,
                function?: string
            }

            export type NoBrandType = {
                timestamp: number,
                type: string,
                runner?: RunnerLog,
                logMessage?: string,
                kwargs?: { [key: string]: any }
            }

            /**
             * ```
             * type NoBrandType = {
             *     runner?: {
             *         worker?: string,
             *         class?: string,
             *         function?: string
             *     },
             *     logMessage?: string,
             *     kwargs?: {[key: string]: any}
             *     timestamp: number,
             *     type: string,
             * }
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Request.Log.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => true,

                getValid: (arg) => getValidGeneric(
                    arg,
                    constraint.isValid
                )

            }
        }

    }

    export namespace Response {

        export namespace CreateNote {

            export type NoBrandType = {
                uuid: NoteMap.Type['uuid'],
                createdAt: NoteMap.Type['createdAt'],
                lastUpdatedAt: NoteMap.Type['lastUpdatedAt']
            };

            /**
             * ```
             * export type NoBrandType = {
             *     uuid: NoteMap.Type['uuid'],
             *     createdAt: NoteMap.Type['createdAt'],
             *     lastUpdatedAt: NoteMap.Type['lastUpdatedAt']
             * };
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Response.CreateNote.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => {
                    return NoteMap.isValidEntry('uuid', arg.uuid) && NoteMap.isValidEntry('createdAt', arg.createdAt) && NoteMap.isValidEntry('lastUpdatedAt', arg.lastUpdatedAt);
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )
            }
        }

        export namespace UpdateNote {
            export type NoBrandType = {
                lastUpdatedAt: NoteMap.Type['lastUpdatedAt']
            };

            /**
             * ```
             * export type NoBrandType = {
             *     lastUpdatedAt: NoteMap.Type['lastUpdatedAt']
             * };
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Response.UpdateNote.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => {
                    return NoteMap.isValidEntry('lastUpdatedAt', arg.lastUpdatedAt);
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )
            }
        }

        export namespace DeleteNote {

            export type NoBrandType = {
                success: boolean
            };

            /**
             * ```
             * export type NoBrandType = {
             *     success: boolean
             * };
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Response.DeleteNote.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => {
                    return typeof arg.success === 'boolean';
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )
            }
        }

        export namespace GetNote {

            export type NoBrandType = NoteMap.Type;

            /**
             * ```
             * export type NoBrandType = NoteMap.Type;
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Response.GetNote.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => NoteMap.isValidAllEntries(arg, false),

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )
            }

        }

        export namespace GetManyNotes {

            export type NoBrandType = {
                notes: NoteMap.Type[]
            };

            /**
             * ```
             * export type NoBrandType = {
             *     notes: NoteMap.Type[]
             * }
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Response.GetManyNotes.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => {
                    if (arg.notes !== undefined) {
                        if (Array.isArray(arg.notes)) {
                            return arg.notes.every((note: any) => NoteMap.isValidAllEntries(note, false));
                        }
                    }

                    return false;
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )
            };

        }

        export namespace GetScreenWidth {

            export type NoBrandType = {
                screenWidth: PositiveNumber.Type;
            };

            /**
             * ```
             * export type NoBrandType = {
             *     screenWidth: PositiveNumber.Type;
             * };
             * ```
             */
            export type Type = BrandedType<NoBrandType, 'Payload.Response.GetScreenWidth.Type'>;

            export const constraint: Constrainable<NoBrandType, Type> = {

                isValid: (arg) => {
                    return PositiveNumber.constraint.isValid(arg);
                },

                getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                    arg,
                    constraint.isValid
                )

            }
        }
    }

    export type Any =
        Payload.Response.CreateNote.Type
        | Payload.Response.UpdateNote.Type
        | Payload.Response.DeleteNote.Type
        | Payload.Response.GetNote.Type
        | Payload.Response.GetManyNotes.Type
        | Payload.Response.GetScreenWidth.Type
        | Payload.Request.CreateNote.Type
        | Payload.Request.UpdateNote.Type
        | Payload.Request.DeleteNote.Type
        | Payload.Request.GetNote.Type
        | Payload.Request.GetManyNotes.Type
        | Payload.Request.GetScreenWidth.Type
        | Payload.Request.UserRedirect.Type
        | Payload.Request.Log.Type;

    export function getByName(mid: string) {
        let accessPoint = mid.split('.');
        switch (accessPoint[0]) {
            case ('Response'): {
                switch (accessPoint[1]) {
                    case ('CreateNote'):
                        return Payload.Response.CreateNote;
                    case ('UpdateNote'):
                        return Payload.Response.UpdateNote;
                    case ('DeleteNote'):
                        return Payload.Response.DeleteNote;
                    case ('GetNote'):
                        return Payload.Response.GetNote;
                    case ('GetManyNotes'):
                        return Payload.Response.GetManyNotes;
                    case ('GetScreenWidth'):
                        return Payload.Response.GetScreenWidth;
                }

                break;
            }
            case ('Request'): {
                switch (accessPoint[1]) {
                    case ('CreateNote'):
                        return Payload.Request.CreateNote
                    case ('UpdateNote'):
                        return Payload.Request.UpdateNote;
                    case ('DeleteNote'):
                        return Payload.Request.DeleteNote;
                    case ('GetNote'):
                        return Payload.Request.GetNote;
                    case ('GetManyNotes'):
                        return Payload.Request.GetManyNotes;
                    case ('GetScreenWidth'):
                        return Payload.Request.GetScreenWidth;
                    case ('UserRedirect'):
                        return Payload.Request.UserRedirect;
                    case ('Log'):
                        return Payload.Request.Log;
                }

                break;
            }
        }
    }
}