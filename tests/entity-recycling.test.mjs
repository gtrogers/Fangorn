import { Ents } from "../dist/fangorn.mjs";

describe("Entity recycling", () => {
    test("Entity ids are recycled", () => {
        const ents = new Ents();

        const entity1 = ents.makeEntity();
        const entity2 = ents.makeEntity();
        const entity3 = ents.makeEntity();

        ents.destroyEntity(entity2);

        const entity4 = ents.makeEntity();

        expect(entity4).toBe(entity2);
    });

    test("Previous components are removed when entity is recycled", () => {
        const ents = new Ents();

        const entity = ents.makeEntity();

        const Position = ents.makeComponent("position");
        const Velocity = ents.makeComponent("velocity");

        ents.bindComponent(entity, Position, { x: 0, y: 0 });
        ents.bindComponent(entity, Velocity, { x: 1, y: 1 });

        ents.destroyEntity(entity);

        const newEntity = ents.makeEntity();

        expect(newEntity).toBe(entity); // Check id is indeed recycled
        expect(Position[newEntity]).toBeUndefined();
        expect(Velocity[newEntity]).toBeUndefined();
    });
});