import { Payload } from "@tools/Constraints";

describe('Payload.RequestDeleteNote.isValid() constraint function', () => {
    test('Returns true when the uuid field is provided and has correct type', () => {
        const request: { [key: string]: any } = { uuid: "54e0b508 - cfa8 - 48ec - a29f - cd8502a47362" };
        expect(Payload.RequestDeleteNote.isValid(request)).toBe(true)
    });

    test('Returns false when the uuid field is missing', () => {
        const request: { [key: string]: any } = {};
        expect(Payload.RequestDeleteNote.isValid(request)).toBe(false)
    });

    test('Returns false when the uuid field is provided but has invalid type', () => {
        const request: { [key: string]: any } = { uuid: 648234.57 };
        expect(Payload.RequestDeleteNote.isValid(request)).toBe(false)
    });

    test('Returns false when an extra field is provided', () => {
        const request: { [key: string]: any } = { uuid: "54e0b508 - cfa8 - 48ec - a29f - cd8502a47362", extraField: "extraField" };
        expect(Payload.RequestDeleteNote.isValid(request)).toBe(false)
    });

})
