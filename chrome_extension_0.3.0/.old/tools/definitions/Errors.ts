export class NotImplementedError extends Error {
    constructor(message = "Not implemented.") {
        super(message);
        this.name = "NotImplementedError";
    }
}

export class MissingRequiredValuesError extends Error {
    constructor(message = "Missing required value(s).") {
        super(message);
        this.name = "MissingRequiredValuesError";
    }
}

export class InvalidTypeError extends Error {
    constructor(message = "Invalid datatype.") {
        super(message);
        this.name = "InvalidType";
    }
}