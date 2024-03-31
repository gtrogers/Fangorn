import { Ents } from "../dist/fangorn.mjs";

describe("Components", () => {
    test("Binding component to entity", () => {
        const ents = new Ents();

        const Position = ents.makeComponent("position");
        const entity = ents.makeEntity();

        const data = { x: 7, y: 7 };
        ents.bindComponent(entity, Position, data);

        expect(Position[entity]).toBe(data);
        expect(ents.with([Position])).toEqual([entity]);
    });

    test("Unbinding component from entity", () => {
        const ents = new Ents();

        const Position = ents.makeComponent("position");
        const entity = ents.makeEntity();

        const data = { x: 7, y: 7 };

        ents.bindComponent(entity, Position, data);
        expect(Position[entity]).toBe(data);
        expect(ents.with([Position])).toEqual([entity]);

        ents.unbindComponent(entity, Position);
        expect(Position[entity]).toBeUndefined();
        expect(ents.with([Position])).toEqual([]);
    });
});