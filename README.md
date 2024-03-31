# Fangorn

A _simple_, one-file entity component system for Typescript and
Javascript in about 100 lines of code (it's where your 'ents live)

The goal of Fangorn (other than satisfying my curiosity) is to be fast enough with remaining simple, easy to use and fun to hack on.

## Installation

### Copy the file
The only file you need is in `src/ents.mts`

### NPM and CDN
Coming soon

## Example

```Typescript
import { Ents } from "fangorn.mjs";
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

// Create our component storage
const Position = ents.makeComponent<Vec2>("position");
const Velocity = ents.makeComponent<Vec2>("velocity");
const Heavy = ents.makeComponent<boolean>("heavy");

for (let i = 0; i < PARTICLES; i++) {
  // Create our entities and bind component values to them
  const entity = ents.makeEntity();
  ents.bindComponent(entity, Position, vec2(WIDTH / 2, HEIGHT / 2));
  ents.bindComponent(entity, Velocity, randVec2());

  // Make half of the entities heavy
  if (Math.random() >= 0.5) {
    ents.bindComponent(entity, Heavy, true);
  }
}

const renderSystem = (ents: Ents) => {
  CTX.clearRect(0, 0, WIDTH, HEIGHT);
  // Get all entities that have a position and draw them
  for (const entity of ents.with([Position])) {
    const pos = Position[entity];
    CTX.fillRect(pos.x, pos.y, 1, 1);
  }
};

const physicsSystem = (ents: Ents) => {
  // Update the entity positions using the velocity
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
  // Make heavy entities fall and bounce
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
```

## Tests
Because testing Typescript is still a nightmare (especially with JS modules) the tests are
run against the compiled Javascript in the `./dist` folder. Make
sure you run `npx tsc` or `npm run build` before running `npm test`.

## TODO List

- [x] Entity recycling: re-use ids from deleted entities
- [ ] Interactive demo
- [ ] NPM package and/or CDN delivery
- [ ] Query caching: no need to re-compute the list of entity ids for a set of components if nothing has changed
- [x] More tests: e.g. test recycled entities don't have their old components (they don't)
- [ ] Perf tests and remove any obvious bottlenecks