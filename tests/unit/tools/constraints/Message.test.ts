import { Message } from "@tools/Constraints";
import { MID } from "@tools/Types";
import positiveTestCases from "@unit:data/json/message-type-valid-mid-and-payload-pairs.json";
import { logWarnings } from "../../logWarnings";

describe('Message.isValid() constraint function', () => {
    describe('Positive test cases', () => {

        // That passess regardles of the payload paired with MID. Currently it is developer's responsibility to ensure the payload is correct.
        // I'm leaving it here as a general test if the isValid() responds appropriately for valid mid-payload pairs
        test.each(positiveTestCases)('Should return true when supplied with a message with $mid mid and payload: $payload.', ({ mid, payload }) => {
            if (mid.toLowerCase().includes('request') || [MID.Log.toString(), MID.ResponseGetScreenWidth.toString()].includes(mid)) {
                const message = {
                    mid,
                    payload,
                    _sender: 'foo',
                    _recipient: 'bar'
                };
                if (!Message.isValid(message)) { logWarnings(Message.isValid(message, undefined, true) as string[]); }
                expect(Message.isValid(message)).toBe(true);
            }
        });

        test.each(positiveTestCases)('Should return true when supplied with a response message with $mid, payload: $payload and externalResponseStatus indicating that the request was successfull.', ({ mid, payload }) => {
            if (mid.toLowerCase().includes('response') && mid !== MID.ResponseGetScreenWidth.toString()) {
                const message = {
                    mid,
                    payload,
                    externalResponseStatus: {
                        success: true,
                        statusCode: 200
                    },
                    _sender: 'foo',
                    _recipient: 'bar'
                };
                if (!Message.isValid(message)) { logWarnings(Message.isValid(message, undefined, true) as string[]); }
                expect(Message.isValid(message)).toBe(true);
            }
        });

        test.each(positiveTestCases)('Should return true when supplied with a response message with externalResponseStatus indicating unsuccesfull request and no payload provided.', ({ mid, payload }) => {
            if (mid.toLowerCase().includes('response') && mid !== MID.ResponseGetScreenWidth.toString()) {
                const message = {
                    mid,
                    payload: null,
                    externalResponseStatus: {
                        success: false,
                        statusCode: 404
                    },
                    _sender: 'foo',
                    _recipient: 'bar'
                };
                if (!Message.isValid(message)) { logWarnings(Message.isValid(message, undefined, true) as string[]); }
                expect(Message.isValid(message)).toBe(true);
            }
        });

    });

    describe('Negative test cases', () => {
        test.each(positiveTestCases)('Should return false when supplied with response message (except ResponseGetScreenWidth) and externalResponseStatus is missing. Given: %j', ({ mid, payload }) => {
            if (mid.toLowerCase().includes('response') && mid !== MID.ResponseGetScreenWidth.toString()) {
                const message = {
                    mid,
                    payload,
                    _sender: 'foo',
                    _recipient: 'bar'
                };
                expect(Message.isValid(message)).toBe(false);
            }
        });

        test.each(positiveTestCases)('Should return false when supplied with request or log message (mid: $mid) and externalResponseStatus is present.', ({ mid, payload }) => {
            if (mid.toLowerCase().includes('request') || mid === MID.Log.toString()) {
                const message = {
                    mid,
                    payload,
                    externalResponseStatus: {
                        success: true,
                        statusCode: 200
                    },
                    _sender: 'foo',
                    _recipient: 'bar'
                };
                expect(Message.isValid(message)).toBe(false);
            }
        })

        test('Should return false when mid is missing.', () => {
            const message = {
                payload: {
                    screenWidth: 834.86
                },
                _sender: 'foo',
                _recipient: 'bar'
            };
            expect(Message.isValid(message)).toBe(false);
        });

        test('Should return false when payload is missing.', () => {
            const message = {
                mid: MID.ResponseGetScreenWidth,
                _sender: 'foo',
                _recipient: 'bar'
            };
            expect(Message.isValid(message)).toBe(false);
        });

        test('Should return false when _sender is missing.', () => {
            const message = {
                mid: MID.ResponseGetScreenWidth,
                payload: {
                    screenWidth: 834.86
                },
                _recipient: 'bar'
            };
            expect(Message.isValid(message)).toBe(false);
        });

        test('Should return false when _recipient is missing.', () => {
            const message = {
                mid: MID.ResponseGetScreenWidth,
                payload: {
                    screenWidth: 834.86
                },
                _sender: 'foo',
            };
            expect(Message.isValid(message)).toBe(false);
        });

        test('Should return false when provided with an extra field.', () => {
            const message = {
                mid: MID.ResponseGetScreenWidth,
                payload: {
                    screenWidth: 834.86
                },
                _sender: 'foo',
                _recipient: 'bar',
                extraField: 'extra value'
            };
            expect(Message.isValid(message)).toBe(false);
        });

    });
});