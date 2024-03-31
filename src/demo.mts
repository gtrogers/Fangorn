import { Ents, TaggedArray } from "./fangorn.mjs";

type Vector2 = { x: number; y: number };

const WIDTH = 480;
const HEIGHT = 320;

let Position: TaggedArray<Vector2>;
let Velocity: TaggedArray<Vector2>;
let Color: TaggedArray<string>;

const anotherDemo = () => {
  const ents = new Ents();
  const PARTICLES = 10000;
  const WIDTH = 480;
  const HEIGHT = 320;
  const CTX = (document.getElementById("canvas") as HTMLCanvasElement)?.getContext("2d");

  if (!CTX) {
    throw new Error("Could not get 2d context");
  }

  type Vec2 = { x: number; y: number };
  const vec2 = (x: number, y: number) => ({ x, y });
  const randVec2 = () => vec2(Math.random() * 2 - 1, Math.random() * 2 - 1);

  const Position = ents.makeComponent<Vec2>("position");
  const Velocity = ents.makeComponent<Vec2>("velocity");
  const Heavy = ents.makeComponent<boolean>("heavy");

  for (let i = 0; i < PARTICLES; i++) {
    const entity = ents.makeEntity();
    ents.bindComponent(entity, Position, vec2(WIDTH / 2, HEIGHT / 2));
    ents.bindComponent(entity, Velocity, randVec2());

    if (Math.random() >= 0.5) {
      ents.bindComponent(entity, Heavy, true);
    }
  }

  const renderSystem = (ents: Ents) => {
    CTX.clearRect(0, 0, WIDTH, HEIGHT);
    for (const entity of ents.with([Position])) {
      const pos = Position[entity];
      CTX.fillRect(pos.x, pos.y, 1, 1);
    }
  };

  const physicsSystem = (ents: Ents) => {
    for (const entity of ents.with([Position, Velocity])) {
      const pos = Position[entity];
      const vel = Velocity[entity];
      pos.x += vel.x;
      pos.y += vel.y;
      if (pos.x < 0 || pos.x >= WIDTH) {
        vel.x = -vel.x;
      }
      if (pos.y < 0 || pos.y >= HEIGHT) {
        vel.y = -vel.y;
      }
    }
  };

  const gravitySystem = (ents: Ents) => {
    for (const entity of ents.with<any>([Velocity, Heavy, Position])) {
      if (Velocity[entity].y < 1) {
        Velocity[entity].y += 0.01;
      }
      if (Position[entity].y > HEIGHT - 1) {
        Velocity[entity].y = -Math.abs(Velocity[entity].y) * 0.6;
      }
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.setInterval(() => {
      physicsSystem(ents);
      gravitySystem(ents);
      renderSystem(ents);
    }, 16);
  });
};

const newDemo = (ents: Ents) => {
  Position = ents.makeComponent<Vector2>("position");
  Velocity = ents.makeComponent<Vector2>("velocity");
  Color = ents.makeComponent<string>("color");
  for (var i = 0; i < 500; i++) {
    const entity = ents.makeEntity();
    ents.bindComponent(entity, Position, {
      x: WIDTH * Math.random(),
      y: HEIGHT * Math.random(),
    });
    ents.bindComponent(entity, Velocity, {
      x: -1 + Math.random() * 2,
      y: -1 + Math.random() * 2,
    });
    ents.bindComponent(entity, Color, Math.random() > 0.5 ? "red" : "blue");
  }

  const main = document.getElementById("game");
  const button = document.createElement("button");
  button.textContent = "Add 1000 more entities";
  button.addEventListener("click", () => {
    for (var i = 0; i < 1000; i++) {
      const entity = ents.makeEntity();
      ents.bindComponent(entity, Position, {
        x: WIDTH / 2,
        y: HEIGHT / 3,
      });
      ents.bindComponent(entity, Velocity, {
        x: -1 + Math.random() * 2,
        y: -1 + Math.random() * 2,
      });
      ents.bindComponent(entity, Color, Math.random() > 0.5 ? "red" : "blue");
    }
  });
  main?.appendChild(button);
};

const physicsSystem = (ents: Ents) => {
  for (const entity of ents.with([Position, Velocity])) {
    const position = Position[entity];
    const velocity = Velocity[entity];
    position.x += velocity.x;
    position.y += velocity.y;
    velocity.x *= 0.99;
    velocity.y *= 0.99;
    if (
      position.x < 0 ||
      position.x >= WIDTH ||
      position.y < 0 ||
      position.y >= HEIGHT
    ) {
      velocity.x = -velocity.x;
      velocity.y = -velocity.y;
    }
  }
};

const renderSystem = (ents: Ents) => {
  const canvas = document.getElementById("canvas");
  const ctx = (canvas as HTMLCanvasElement).getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (const entity of ents.with<Vector2 | string>([Position, Color])) {
    const position = Position[entity];
    ctx.strokeStyle = Color[entity];
    ctx.strokeText("hello", position.x, position.y);
  }
};

const redIsHeavySystem = (ents: Ents) => {
  for (const entity of ents.with<any>([Color, Velocity, Position])) {
    if (Color[entity] === "red") {
      Velocity[entity].y += 0.1;
      const pos = Position[entity];
      if (pos.y > HEIGHT - 1) {
        Velocity[entity].y = -Math.abs(Velocity[entity].y) * 0.6;
      }
    }
  }
};

const cleanUpSystem = (ents: Ents) => {
  for (const entity of ents.with<any>([Velocity])) {
    if (Math.abs(Velocity[entity].x) < 0.001) {
      ents.destroyEntity(entity);
    }
  }
};

export {
  newDemo,
  renderSystem,
  physicsSystem,
  redIsHeavySystem,
  cleanUpSystem,
  anotherDemo,
};
