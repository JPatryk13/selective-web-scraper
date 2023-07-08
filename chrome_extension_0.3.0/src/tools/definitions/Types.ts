enum MID {
    createNote = "createNote", // payload: { title: ..., body: ..., src: ... }
    updateNote = "updateNote", // payload: { uuid: ...,  [title/body/src]: ..., [title/body/src]: ..., ... }
    deleteNote = "deleteNote", // payload: { uuid: ... }
}

type InternalMessageMap = {
    mid?: MID,
    payload?: { [key: string]: string } | null
}

type NoteMap = {
    title?: string | null,
    body?: string,
    src?: string,
    uuid?: string,
    createdAt?: number,
    lastUpdatedAt?: number
}

export { MID, InternalMessageMap, NoteMap };