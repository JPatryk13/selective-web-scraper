import { Payload } from "@tools/Constraints";

describe('RequestCreateNote.isValid() constraint function', () => {
    describe('Positive test cases', () => {
        test.each`
        titleType   | request
        ${'string'} | ${{ title: "title", body: "body", src: "src" }}
        ${'null'}   | ${{ title: null, body: "body", src: "src" }}
        `('Return true when all fields are specified and are correct type, given title is $titleType', ({ titleType, request }) => {
            expect(Payload.RequestCreateNote.isValid(request)).toBe(true)
        });
    })
    describe('Negative test cases', () => {
        test.each`
        missingField    | request
        ${'title'}      | ${{ body: "body", src: "src" }}
        ${'body'}       | ${{ title: "title", src: "src" }}
        ${'src'}        | ${{ title: "title", body: "body" }}
        `('Return false when $missingField is missing', ({ missingField, request }) => {
            expect(Payload.RequestCreateNote.isValid(request)).toBe(false)
        });

        test.each`
        fieldName   | incorrectType | request
        ${'title'}  | ${'number'}   | ${{ title: 5, body: "body", src: "src" }}
        ${'title'}  | ${'boolean'}  | ${{ title: true, body: "body", src: "src" }}
        ${'title'}  | ${'object'}   | ${{ title: { obj: "title" }, body: "body", src: "src" }}
        ${'body'}   | ${'null'}     | ${{ title: "title", body: null, src: "src" }}
        ${'body'}   | ${'number'}   | ${{ title: "title", body: 5, src: "src" }}
        ${'body'}   | ${'boolean'}  | ${{ title: "title", body: true, src: "src" }}
        ${'body'}   | ${'object'}   | ${{ title: "title", body: { obj: "body" }, src: "src" }}
        ${'src'}    | ${'null'}     | ${{ title: "title", body: "body", src: null }}
        ${'src'}    | ${'number'}   | ${{ title: "title", body: "body", src: 5 }}
        ${'src'}    | ${'boolean'}  | ${{ title: "title", body: "body", src: true }}
        ${'src'}    | ${'object'}   | ${{ title: "title", body: "body", src: { obj: "src" } }}
        `('Return false when $fieldName is $incorrectType', ({ fieldName, incorrectType, request }) => {
            expect(Payload.RequestCreateNote.isValid(request)).toBe(false)
        });

        test('Should return false when provided with an extra field.', () => {
            const request = { title: "title", body: "body", src: "src", extraField: "extraField" };
            expect(Payload.RequestCreateNote.isValid(request)).toBe(false);
        });
    });
})
