import {
    anotherDemo,
  cleanUpSystem,
  newDemo,
  physicsSystem,
  redIsHeavySystem,
  renderSystem,
} from "./demo.mjs";
import { Ents } from "./fangorn.mjs";

declare global {
    interface Window {
        ecs: Ents;
    }
}

anotherDemo();

// document.addEventListener("DOMContentLoaded", () => {
//   const ecs = new Ents();
//   newDemo(ecs);

//   window.ecs = ecs;

//   window.setInterval(() => {
//     physicsSystem(ecs);
//     cleanUpSystem(ecs);
//     redIsHeavySystem(ecs);
//     renderSystem(ecs);
//   }, 16);
// });
