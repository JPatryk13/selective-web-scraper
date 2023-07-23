export class NotImplementedError extends Error {
    constructor(message = "Not implemented.") {
        super(message);
        this.name = "NotImplementedError";
    }
}

export const IncorrectTypeWarning = (paramValue: any, paramName: string, typeExpressionArray: string[]) => `Given ${paramName} is expected to be type ${typeExpressionArray}, got ${typeof paramValue} instead.`

export const UndefinedValueWarning = (paramName: string) => `Given ${paramName} is undefined.`

export const UndefinedWithinObjectWarning = (key: string, givenKeys: string[], obj: { [key: string]: any }) => `${key} is undefined. Given keys: ${givenKeys}, while the object has ${Object.keys(obj)}.`

export const NotInSchemaWarning = (paramName: string) => `Found field ${paramName} that is not defined within the schema.`

export const NotMemberWarning = (paramName: string, paramValue: string, className: string) => `${paramName} with value ${paramValue} is not a member of ${className}.`