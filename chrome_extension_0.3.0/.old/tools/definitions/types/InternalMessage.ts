import { Payload } from "@tools/definitions/types/Payload"
import { BrandedType, Constrainable, getValidGeneric } from "@tools/definitions/types/UtilTypes"

export namespace MID {
    export enum Request {
        CreateNote = "Request.CreateNote", // payload: { title: ..., body: ..., src: ... }
        UpdateNote = "Request.UpdateNote", // payload: { uuid: ...,  [title | body | src]: ..., [title | body | src]: ..., ... }
        DeleteNote = "Request.DeleteNote", // payload: { uuid: ... }
        GetNote = "Request.GetNote", // payload: { uuid: ... }
        GetManyNotes = "Request.GetManyNotes", // payload: { count: ..., sortBy: 'Added: Newest' | 'Added: Oldest' | 'Most relevant (require search phrase)', searchPhrase?: { [title | body | src]: ... } } 

        GetScreenWidth = "Request.GetScreenWidth", // payload: null
        UserRedirect = "Request.UserRedirect", // payload: { url: ... }

        Log = "Log", // payload: { runner: { worker: <service-worker/content-scripts/popup>, class: <class>, function: <function> }, logMessage: ..., kwargs: ... }
    }

    export enum Response {
        CreateNote = "Response.CreateNote", // payload: { uuid: ..., createdAt: ..., lastUpdatedAt: ... }
        UpdateNote = "Response.UpdateNote", // payload: { lastUpdatedAt: ... }
        DeleteNote = "Response.DeleteNote", // payload: { success: true | false }
        GetNote = "Response.GetNote", // payload: BaseNoteMap
        GetManyNotes = "Response.GetManyNotes", // payload: { notes: BaseNoteMap[] }

        GetScreenWidth = "Response.GetScreenWidth", // payload: { screenWidth: ... }
    }
}

export namespace InternalMessageMap {

    type NoBrandType = {
        mid: MID.Request | MID.Response,
        payload: Payload.Any
    }

    /**
     * ```
     * type NoBrandType = {
     *     mid: MID.Request | MID.Response,
     *     payload: Payload.Any
     * }
     * ```
     */
    export type Type = BrandedType<NoBrandType, 'InternalMessage.Type'>;

    export const constraint: Constrainable<NoBrandType, Type> = {

        isValid: (arg) => {

            const isValid = Payload.getByName(arg.mid)?.constraint.isValid(arg.payload) ?? false;
            return !!isValid;

        },

        getValid: (arg) => getValidGeneric<NoBrandType, Type>(
            arg,
            constraint.isValid
        )
    }

}