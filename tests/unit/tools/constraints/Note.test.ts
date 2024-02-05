import { Note } from "@tools/Constraints";
import invalidTypeTestCaases from "../../data/json/note-type-invalid-type-single-field.json"
import { logWarnings } from "../../logWarnings";


describe('Note.isValid() constraint function', () => {

    let validNote: { [key: string]: any } = {
        title: "Some title.",
        body: "ule provides helpful calendar- related functions.The utc.now function",
        src: "https://some.web/address/goes/here",
        uuid: "54e0b508 - cfa8 - 48ec - a29f - cd8502a47362",
        createdAt: 1689957914403.387,
        lastUpdatedAt: 1689957914403.387
    };

    describe('Positive test cases', () => {

        test('Acceps a message with all values given and title set to null.', () => {
            validNote.title = null;
            if (!Note.isValid(validNote)) { logWarnings(Note.isValid(validNote, undefined, true) as string[]); }
            expect(Note.isValid(validNote)).toBe(true);
        });

        test('Acceps a message with all values given.', () => {
            if (!Note.isValid(validNote)) { logWarnings(Note.isValid(validNote, undefined, true) as string[]); }
            expect(Note.isValid(validNote)).toBe(true);
        });
    });

    describe('Negative test cases', () => {

        test.each`
        missingField        | note
        ${'title'}          | ${{ body: validNote.body, src: validNote.src, uuid: validNote.uuid, createdAt: validNote.createdAt, lastUpdatedAt: validNote.lastUpdatedAt }}
        ${'body'}           | ${{ title: validNote.title, src: validNote.src, uuid: validNote.uuid, createdAt: validNote.createdAt, lastUpdatedAt: validNote.lastUpdatedAt }}
        ${'src'}            | ${{ title: validNote.title, body: validNote.body, uuid: validNote.uuid, createdAt: validNote.createdAt, lastUpdatedAt: validNote.lastUpdatedAt }}
        ${'uuid'}           | ${{ title: validNote.title, body: validNote.body, src: validNote.src, createdAt: validNote.createdAt, lastUpdatedAt: validNote.lastUpdatedAt }}
        ${'createdAt'}      | ${{ title: validNote.title, body: validNote.body, src: validNote.src, uuid: validNote.uuid, lastUpdatedAt: validNote.lastUpdatedAt }}
        ${'lastUpdatedAt'}  | ${{ title: validNote.title, body: validNote.body, src: validNote.src, uuid: validNote.uuid, createdAt: validNote.createdAt }}
        `('Returns false when $missingField is undefined', ({ missingField, note }) => {
            expect(Note.isValid(note)).toBe(false);
        });

        test.each(invalidTypeTestCaases)('Returns false when given $invalidType value for $key field, when the correct type is $validType', ({ key, invalidType, validType, note }) => {
            expect(Note.isValid(note)).toBe(false);
        });

        test('Should return false when provided with an extra field.', () => {
            validNote["extraField"] = "extra value";
            expect(Note.isValid(validNote)).toBe(false);
        });
    });
});