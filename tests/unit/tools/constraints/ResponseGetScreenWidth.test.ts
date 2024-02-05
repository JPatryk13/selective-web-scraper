import { Payload } from "@src/tools/Constraints";

describe("Payload.ResponseGetScreenWidth.isValid() constraint", () => {
    test("Returns false when screenWidth is 0", () => {
        expect(Payload.ResponseGetScreenWidth.isValid({ screenWidth: 0 })).toBe(false);
    });
});