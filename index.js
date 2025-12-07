import {Grid} from "./grid.js";
import {Controller} from "./controller.js";
import {Blocks} from "./blocks.js";
import { EventBus } from "./eventbus.js";

let grid;

const tickRateMs = 15;
let ticks = 0;

const tick = () => {
    ticks++;

    grid.draw();
    setTimeout(() => {
        requestAnimationFrame(tick)
    }, tickRateMs)
}

const init = () => {
    const canvas = document.getElementById("canvas");

    const blocks = new Blocks();
    const eventBus = new EventBus();

    grid = new Grid(canvas, blocks, eventBus);
    new Controller(blocks, grid, eventBus);

    grid.init();
    tick();
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});

window.addEventListener("resize", () => {
    grid.init();
}, true);