import {Grid} from "./grid.js";
import {Controller} from "./controller.js";
import {Blocks} from "./blocks.js";

let grid;

const tickRateMs = 10;
let ticks = 0;

const tick = () => {
    ticks++;
    if (ticks < 4000) {

    grid.draw();
    }
    setTimeout(() => {
        requestAnimationFrame(tick)
    }, tickRateMs)
}

const init = () => {
    const canvas = document.getElementById("canvas");

    const blocks = new Blocks();
    grid = new Grid(canvas, blocks);
    new Controller(blocks, grid);

    grid.init();
    tick();
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});

window.addEventListener("resize", () => {
    grid.init();
}, true);