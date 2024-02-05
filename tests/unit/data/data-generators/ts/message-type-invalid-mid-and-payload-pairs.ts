import { Payload, MID } from "../../../../../src/tools/Types";
import { testCases as positiveTestCases } from "./message-type-valid-mid-and-payload-pairs";
import fs from 'fs';

export function getTestCases(): ({ [key: string]: any })[] {
    let negativeTestCases: ({ [key: string]: any })[] = [];
    let excludeMids: MID[] = [];

    for (const startingTestCase of positiveTestCases) {

        // handle edge cases:
        // MID.ResponseCreateNote = MID.ResponseGetSingleNote
        // MID.RequestDeleteNote = MID.RequestGetSingleNote
        if ([MID.ResponseCreateNote, MID.ResponseGetSingleNote].includes(startingTestCase.mid)) {
            excludeMids = [MID.ResponseCreateNote, MID.ResponseGetSingleNote];
        } else if ([MID.RequestDeleteNote, MID.RequestGetSingleNote].includes(startingTestCase.mid)) {
            excludeMids = [MID.RequestDeleteNote, MID.RequestGetSingleNote];
        } else {
            excludeMids = [startingTestCase.mid];
        }

        for (const otherTestCase of positiveTestCases) {

            if (!excludeMids.includes(otherTestCase.mid)) {
                negativeTestCases.push({
                    mid: startingTestCase.mid,
                    invalidPayloadAssociatedMid: otherTestCase.mid,
                    invalidPayload: otherTestCase.payload
                });
            }
        }

    }

    return [...new Set(negativeTestCases)];
}

if (require.main === module)
    fs.writeFile('../../json/message-type-invalid-mid-and-payload-pairs.json', JSON.stringify(getTestCases()), 'utf8', () => { });
