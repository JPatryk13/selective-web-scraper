export class NotImplementedError extends Error {
    constructor(message = "Not implemented.") {
        super(message);
        this.name = "NotImplementedError";
    }
}

export const IncorrectTypeWarning = (paramValue: any, paramName: string, typeExpressionArray: string[]) => `Given ${paramName} is expected to be type ${typeExpressionArray}, got ${typeof paramValue} instead.`

export const UndefinedValueWarning = (paramName: string) => `Given ${paramName} is undefined.`

export const MissingRequiredKeys = (objectKeys: string[], requiredKeys: string[]) => `Missing required keys: ${requiredKeys.map((reqKey) => !objectKeys.includes(reqKey))}. Object has keys: ${objectKeys}, while required keys are ${requiredKeys}.`

export const NotPartOfSchemaWarning = (extraKeys: string[], requiredKeys: string[], optionalKeys: string[]) => `Found field(s) ${extraKeys} that is/are not defined within the schema with required keys: ${requiredKeys} and optional keys: ${optionalKeys}`