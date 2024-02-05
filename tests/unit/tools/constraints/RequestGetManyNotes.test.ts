import { Payload } from "@tools/Constraints";
import { Payload as PayloadTypes } from "@tools/Types";
import { logWarnings } from "../../logWarnings";

describe('Payload.RequestGetManyNotes.isValid() constraint', () => {

    /**
    export enum SortBy {
        addedNewest = 'Added: Newest',
        addedOldest = 'Added: Oldest',
        mostRelevant = 'Most relevant'
    }

    export interface RequestGetManyNotes {
        count: number,
        sortBy: SortBy,
        searchPhrase?: { title: Note["title"] } | { body: Note["body"] } | { src: Note["src"] } | undefined
    }
     */
    describe('Positive test cases', () => {
        test.each`
        request
        ${{ count: 10, sortBy: PayloadTypes.SortBy.addedNewest }}
        ${{ count: 10, sortBy: PayloadTypes.SortBy.addedOldest }}
        `('Returns true when RequestGetManyNotes is $request.', ({ request }) => {
            expect(Payload.RequestGetManyNotes.isValid(request)).toBe(true);
        });

        test.each`
        searchPhrase                | request
        ${{ title: "some title" }}  | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { title: "some title" } }}
        ${{ body: "some body" }}    | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { body: "some body" } }}
        ${{ src: "some src" }}      | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { src: "some src" } }}
        `('Returns true when sortBy given as MostRelevant and searchPhrase supplied as $searchPhrase', ({ searchPhrase, request }) => {
            if (!Payload.RequestGetManyNotes.isValid(request)) { logWarnings(Payload.RequestGetManyNotes.isValid(request, undefined, true) as string[]); }
            expect(Payload.RequestGetManyNotes.isValid(request)).toBe(true)
        });
    });

    describe('Negative test cases', () => {
        test.each`
        missingFieldKey | request
        ${'count'}      | ${{ sortBy: PayloadTypes.SortBy.addedNewest }}
        ${'sortBy'}     | ${{ count: 10 }}
        `('Returns false when required $missingFieldKey is missing', ({ missingFieldKey, request }) => {
            expect(Payload.RequestGetManyNotes.isValid(request)).toBe(false);
        });

        test('Returns false when sortBy set to MostRelevant and search phrase is not given', () => {
            const request = { count: 5, sortBy: PayloadTypes.SortBy.mostRelevant };
            expect(Payload.RequestGetManyNotes.isValid(request)).toBe(false);
        });

        test.each`
        fieldName               | invalidType   | validType     | request
        ${'count'}              | ${'null'}     | ${'number'}   | ${{ count: null, sortBy: PayloadTypes.SortBy.addedNewest }}
        ${'count'}              | ${'string'}   | ${'number'}   | ${{ count: '10', sortBy: PayloadTypes.SortBy.addedNewest }}
        ${'count'}              | ${'boolean'}  | ${'number'}   | ${{ count: true, sortBy: PayloadTypes.SortBy.addedNewest }}
        ${'count'}              | ${'object'}   | ${'number'}   | ${{ count: { obj: 10 }, sortBy: PayloadTypes.SortBy.addedNewest }}
        ${'sortBy'}             | ${'null'}     | ${'string'}   | ${{ count: 10, sortBy: null }}
        ${'sortBy'}             | ${'number'}   | ${'string'}   | ${{ count: 10, sortBy: 1 }}
        ${'sortBy'}             | ${'boolean'}  | ${'string'}   | ${{ count: 10, sortBy: true }}
        ${'sortBy'}             | ${'object'}   | ${'string'}   | ${{ count: 10, sortBy: { obj: PayloadTypes.SortBy.addedNewest } }}
        ${'searchPhrase'}       | ${'null'}     | ${'object'}   | ${{ count: 10, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: null }}
        ${'searchPhrase'}       | ${'string'}   | ${'object'}   | ${{ count: 10, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: 'null' }}
        ${'searchPhrase'}       | ${'boolean'}  | ${'object'}   | ${{ count: 10, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: true }}
        ${'searchPhrase'}       | ${'number'}   | ${'object'}   | ${{ count: 10, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: 43 }}
        ${'searchPhrase.title'} | ${'number'}   | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { title: 54 } }}
        ${'searchPhrase.title'} | ${'boolean'}  | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { title: true } }}
        ${'searchPhrase.title'} | ${'object'}   | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { title: { obj: "some title" } } }}
        ${'searchPhrase.body'}  | ${'null'}     | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { body: null } }}
        ${'searchPhrase.body'}  | ${'number'}   | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { body: 54 } }}
        ${'searchPhrase.body'}  | ${'boolean'}  | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { body: true } }}
        ${'searchPhrase.body'}  | ${'object'}   | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { body: { obj: "some title" } } }}
        ${'searchPhrase.src'}   | ${'null'}     | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { src: null } }}
        ${'searchPhrase.src'}   | ${'number'}   | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { src: 54 } }}
        ${'searchPhrase.src'}   | ${'boolean'}  | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { src: true } }}
        ${'searchPhrase.src'}   | ${'object'}   | ${'string'}   | ${{ count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { src: { obj: "some title" } } }}
        `('Returns false when $fieldName has type $invalidType while it is supposed to be $validType', ({ fieldName, invalidType, validType, request }) => {
            expect(Payload.RequestGetManyNotes.isValid(request)).toBe(false);
        });

        test('Returns false when extra field given', () => {
            const request = { count: 5, sortBy: PayloadTypes.SortBy.addedNewest, extraField: "extraField" };
            expect(Payload.RequestGetManyNotes.isValid(request)).toBe(false);

        });

        test('Returns false when extra field given in search phrase', () => {
            const request = { count: 5, sortBy: PayloadTypes.SortBy.mostRelevant, searchPhrase: { title: "some title", extraField: "extraField" } };
            expect(Payload.RequestGetManyNotes.isValid(request)).toBe(false);
        });
    })
})
