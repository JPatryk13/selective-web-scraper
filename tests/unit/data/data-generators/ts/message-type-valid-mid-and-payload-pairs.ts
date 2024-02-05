import { Payload, MID } from "../../../../../src/tools/Types";
import fs from 'fs';

export const testCases = [
    {
        mid: MID.RequestCreateNote,
        payload: { title: "Some title", body: "ule provides helpful calendar-related functions. The utc.now function", src: "https://some.web/address/goes/here" }
    },
    {
        mid: MID.ResponseCreateNote,
        payload: { title: "Some title", body: "ule provides helpful calendar-related functions. The utc.now function", src: "https://some.web/address/goes/here", uuid: "54e0b508-cfa8-48ec-a29f-cd8502a47362", createdAt: 1689957914403.387, lastUpdatedAt: 1689957914403.387 }
    },
    {
        mid: MID.RequestUpdateNote,
        payload: { uuid: "54e0b508-cfa8-48ec-a29f-cd8502a47362", title: "Some title" }
    },
    {
        mid: MID.RequestUpdateNote,
        payload: { uuid: "54e0b508-cfa8-48ec-a29f-cd8502a47362", body: "ule provides helpful calendar-related functions. The utc.now function" }
    },
    {
        mid: MID.RequestUpdateNote,
        payload: { uuid: "54e0b508-cfa8-48ec-a29f-cd8502a47362", src: "https://some.web/address/goes/here" }
    },
    {
        mid: MID.ResponseUpdateNote,
        payload: { lastUpdatedAt: 1689957914403.387 }
    },
    {
        mid: MID.RequestDeleteNote,
        payload: { uuid: "54e0b508-cfa8-48ec-a29f-cd8502a47362" }
    },
    {
        mid: MID.ResponseDeleteNote,
        payload: { success: false }
    },
    {
        mid: MID.RequestGetSingleNote,
        payload: { uuid: "54e0b508-cfa8-48ec-a29f-cd8502a47362" }
    },
    {
        mid: MID.ResponseGetSingleNote,
        payload: { title: "Some title", body: "ule provides helpful calendar-related functions. The utc.now function", src: "https://some.web/address/goes/here", uuid: "54e0b508-cfa8-48ec-a29f-cd8502a47362", createdAt: 1689957914403.387, lastUpdatedAt: 1689957914403.387 }
    },
    {
        mid: MID.RequestGetManyNotes,
        payload: { count: 10, sortBy: Payload.SortBy.addedNewest }
    },
    {
        mid: MID.RequestGetManyNotes,
        payload: { count: 10, sortBy: Payload.SortBy.addedOldest }
    },
    {
        mid: MID.RequestGetManyNotes,
        payload: { count: 10, sortBy: Payload.SortBy.mostRelevant, searchPhrase: { title: "Some title" } }
    },
    {
        mid: MID.RequestGetManyNotes,
        payload: { count: 10, sortBy: Payload.SortBy.mostRelevant, searchPhrase: { body: "ule provides helpful calendar-related functions. The utc.now function" } }
    },
    {
        mid: MID.RequestGetManyNotes,
        payload: { count: 10, sortBy: Payload.SortBy.mostRelevant, searchPhrase: { src: "https://some.web/address/goes/here" } }
    },
    {
        mid: MID.ResponseGetManyNotes,
        payload: { notes: [{ title: "Some title", body: "ule provides helpful calendar-related functions. The utc.now function", src: "https://some.web/address/goes/here", uuid: "54e0b508-cfa8-48ec-a29f-cd8502a47362", createdAt: 1689957914403.387, lastUpdatedAt: 1689957914403.387 }] }
    },
    {
        mid: MID.RequestGetScreenWidth,
        payload: null
    },
    {
        mid: MID.ResponseGetScreenWidth,
        payload: { screenWidth: 843.6 }
    },
    {
        mid: MID.UserRedirect,
        payload: { url: "http://some.url/goes/here" }
    },
    {
        mid: MID.Log,
        payload: { level: "debug", module: "moduleName", location: "className.moduleName", group: { args: ["Some optional arguments"] }, message: "That's debug message", }
    },
];


if (require.main === module)
    fs.writeFile('../../json/message-type-valid-mid-and-payload-pairs.json', JSON.stringify(testCases), 'utf8', () => { });