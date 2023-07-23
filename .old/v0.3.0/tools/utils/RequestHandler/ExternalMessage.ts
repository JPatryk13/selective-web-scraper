import { BrandedType, Constrainable, getValidGeneric } from "@tools/definitions/types/UtilTypes"
import { Payload } from "@tools/definitions/types/Payload";

export namespace RequestBody {

    export namespace PostNote {

        export type NoBrandType = Payload.Request.CreateNote.NoBrandType

        /**
         * ```
         * export type NoBrandType = {
         *     title: NoteMap.Type["title"],
         *     body: NoteMap.Type["body"],
         *     src: NoteMap.Type["src"]
         * }
         * ```
         */
        export type Type = BrandedType<NoBrandType, "ExternalMessage.RequestBody.PostNote.Type">;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Request.CreateNote.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export namespace PatchNote {

        type NoBrandType = Payload.Request.UpdateNote.NoBrandType;

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
        export type Type = BrandedType<NoBrandType, 'ExternalMessage.RequestBody.PatchNote.Type'>;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Request.UpdateNote.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export namespace GetNote {

        type NoBrandType = Payload.Request.GetNote.NoBrandType;

        /**
         * ```
         * export type NoBrandType = {
         *     uuid: NoteMap.Type["uuid"]
         * }
         * ```
         */
        export type Type = BrandedType<NoBrandType, 'ExternalMessage.RequestBody.GetNote.Type'>;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Request.GetNote.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export namespace GetManyNotes {

        type NoBrandType = Payload.Request.GetManyNotes.NoBrandType;

        /**
         * ```
         * export type NoBrandType = {
         *     count: PositiveInteger.Type,
         *     sortBy: 'Added: Newest' | 'Added: Oldest' | 'Most relevant',
         *     searchPhrase?: { title: NoteMap.Type["title"] } | { body: NoteMap.Type["body"] } | { src: NoteMap.Type["src"] } | undefined
         * }
         * ```
         */
        export type Type = BrandedType<NoBrandType, 'ExternalMessage.RequestBody.GetManyNotes.Type'>;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Request.GetManyNotes.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export namespace DeleteNote {

        type NoBrandType = Payload.Request.DeleteNote.NoBrandType;

        /**
         * ```
         * export type NoBrandType = {
         *     uuid: NoteMap.Type["uuid"]
         * }
         * ```
         */
        export type Type = BrandedType<NoBrandType, 'ExternalMessage.RequestBody.DeleteNote.Type'>;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Request.DeleteNote.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

}

export namespace ResponseBody {

    export namespace PostNote {

        type NoBrandType = Payload.Response.CreateNote.NoBrandType;

        /**
         * ```
         * export type NoBrandType = {
         *     uuid: NoteMap.Type['uuid'],
         *     createdAt: NoteMap.Type['createdAt'],
         *     lastUpdatedAt: NoteMap.Type['lastUpdatedAt']
         * };
         * ```
         */
        export type Type = BrandedType<NoBrandType, "ExternalMessage.ResponseBody.PostNote.Type">;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Response.CreateNote.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export namespace PatchNote {

        type NoBrandType = Payload.Response.UpdateNote.NoBrandType;

        /**
         * ```
         * export type NoBrandType = {
         *     lastUpdatedAt: NoteMap.Type['lastUpdatedAt']
         * };
         * ```
         */
        export type Type = BrandedType<NoBrandType, 'ExternalMessage.ResponseBody.PatchNote.Type'>;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Response.UpdateNote.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export namespace GetNote {

        type NoBrandType = Payload.Response.GetNote.NoBrandType;

        /**
         * ```
         * export type NoBrandType = NoteMap.Type;
         * ```
         */
        export type Type = BrandedType<NoBrandType, 'ExternalMessage.RequestBody.GetNote.Type'>;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Response.GetNote.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export namespace GetManyNotes {

        type NoBrandType = Payload.Response.GetManyNotes.NoBrandType;

        /**
         * ```
         * export type NoBrandType = {
         *     notes: NoteMap.Type[]
         * }
         * ```
         */
        export type Type = BrandedType<NoBrandType, 'ExternalMessage.RequestBody.GetManyNotes.Type'>;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Response.GetManyNotes.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export namespace DeleteNote {

        type NoBrandType = Payload.Response.DeleteNote.NoBrandType;

        /**
         * ```
         * export type NoBrandType = {
         *     success: boolean
         * };
         * ```
         */
        export type Type = BrandedType<NoBrandType, 'ExternalMessage.ResponseBody.DeleteNote.Type'>;

        export const constraint: Constrainable<NoBrandType, Type> = {

            isValid: (arg) => Payload.Response.DeleteNote.constraint.isValid(arg),

            getValid: (arg) => getValidGeneric<NoBrandType, Type>(
                arg,
                constraint.isValid
            )

        }

    }

    export type Resp<T> = {
        responsCode: number,
        responsePayload: T
    }

}