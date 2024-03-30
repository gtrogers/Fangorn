import { Ents } from "../dist/ents.mjs";

describe("Ents ECS", () => {
  test("Example", () => {
    const ents = new Ents();

    const entity1 = ents.makeEntity();
    const entity2 = ents.makeEntity();
    const entity3 = ents.makeEntity();

    const Position = ents.makeComponent("position");
    const Velocity = ents.makeComponent("velocity");

    for (const entity of [entity1, entity3]) {
      ents.bindComponent(entity, Position, { x: 0, y: 0 });
      ents.bindComponent(entity, Velocity, { x: 1, y: 1 });
    }

    expect(ents.with([Position, Velocity])).toEqual([entity1, entity3]);

    const system = (ents) => {
      for (const entity of ents.with([Position, Velocity])) {
        const position = Position[entity];
        const velocity = Velocity[entity];
        position.x += velocity.x;
        position.y += velocity.y;
      }
    };

    system(ents);

    expect(Position[entity1]).toEqual({ x: 1, y: 1 });
    expect(Position[entity1]).toEqual({ x: 1, y: 1 });
  });
});
