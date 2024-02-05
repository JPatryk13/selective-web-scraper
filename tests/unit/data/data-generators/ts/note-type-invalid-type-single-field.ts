import fs from 'fs';

export const validNote: { [key: string]: any } = {
    title: "Some title.",
    body: "ule provides helpful calendar- related functions.The utc.now function",
    src: "https://some.web/address/goes/here",
    uuid: "54e0b508 - cfa8 - 48ec - a29f - cd8502a47362",
    createdAt: 1689957914403.387,
    lastUpdatedAt: 1689957914403.387
};

export const validTypes: { [key: string]: string[] } = {
    title: ['string', 'null'],
    body: ['string'],
    src: ['string'],
    uuid: ['string'],
    createdAt: ['number'],
    lastUpdatedAt: ['number']
}

export const invalidTypes: { [key: string]: string[] } = {
    title: ['number', 'boolean', 'object'],
    body: ['null', 'number', 'boolean', 'object'],
    src: ['null', 'number', 'boolean', 'object'],
    uuid: ['null', 'number', 'boolean', 'object'],
    createdAt: ['null', 'string', 'boolean', 'object'],
    lastUpdatedAt: ['null', 'string', 'boolean', 'object']
}

export const invalidTypeData: { [key: string]: any[] } = {
    title: [42, true, { key: 'value' }],
    body: [null, 42, true, { key: 'value' }],
    src: [null, 42, true, { key: 'value' }],
    uuid: [null, 42, true, { key: 'value' }],
    createdAt: [null, 'string', true, { key: 'value' }],
    lastUpdatedAt: [null, 'string', true, { key: 'value' }]
}

export interface DataPoint {
    key: string,
    invalidType: string,
    validType: string[],
    note: { [key: string]: any }
}

export function getInvalidTypeNotes() {
    let data: ({ [key: string]: any })[] = [];

    for (const key of Object.keys(invalidTypes)) {
        for (let i = 0; i < invalidTypes[key].length; i++) {

            let invalidNote: { [key: string]: any } = {};
            for (const k in validNote) {
                invalidNote[k] = k === key ? invalidTypeData[key][i] : validNote[k]
            }

            let dataPoint: DataPoint = {
                key,
                invalidType: invalidTypes[key][i],
                validType: validTypes[key],
                note: invalidNote
            }

            data.push(dataPoint);
        }
    }

    return data;

}

if (require.main === module)
    fs.writeFile('json/note-type-invalid-type-single-field.json', JSON.stringify(getInvalidTypeNotes()), 'utf8', () => { });