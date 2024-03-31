import { Ents } from "../dist/fangorn.mjs";

describe("Entities", () => {
    test("Entities are incrementing ids", () => {
        const ents = new Ents();

        const entity1 = ents.makeEntity();
        const entity2 = ents.makeEntity();
        const entity3 = ents.makeEntity();

        expect(entity1).toBe(0);
        expect(entity2).toBe(1);
        expect(entity3).toBe(2);
    });
});