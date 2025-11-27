import {Grid} from "./grid.js";

console.log("deployed");

let grid;
const tickRateMs = 30;

const tick = () => {
    grid.clear();
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
