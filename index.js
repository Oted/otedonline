import {Grid} from "./grid.js";

let grid;
const tickRateMs = 10;

const tick = () => {
    grid.draw();
    setTimeout(() => {
        requestAnimationFrame(tick)
    }, tickRateMs)
}

const init = () => {
    grid = new Grid(document.getElementById("canvas"));
    grid.resize();

    tick();
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});

document.addEventListener("resize", () => {
    init();
});
