class NotImplementedError extends Error {
    constructor(message: string = "Not implemented.") {
        super(message);
        this.name = "NotImplementedError";
    }
}

export { NotImplementedError };