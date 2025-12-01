import {Grid} from "./grid.js";

let grid;
const tickRateMs = 7;

const tick = () => {
    grid.draw();
    setTimeout(() => {
        requestAnimationFrame(tick)
    }, tickRateMs)
}

const init = () => {
    const canvas = document.getElementById("canvas");
    grid = new Grid(canvas);
    grid.reset();

    tick();
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});

window.addEventListener("resize", () => {
    grid.reset();
}, true);