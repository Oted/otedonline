import {Grid} from "./grid.js";
import {Controller} from "./controller.js";
import {Blocks} from "./blocks.js";
import {EventBus} from "./eventbus.js";

class App {
    constructor() {
        this.tickRateMs = 10;
        this.ticks = 0;

        this.canvas = document.getElementById("canvas");
        this.blocks = new Blocks();
        this.eventBus = new EventBus();
        this.grid = new Grid(this.canvas, this.blocks, this.eventBus);
        this.controller = new Controller(this.blocks, this.grid, this.eventBus);
    }

    start() {
        this.grid.init();
        requestAnimationFrame(this.tick.bind(this));
    }

    tick() {
        this.ticks++;

        const startMs = (new Date()).valueOf();
        this.grid.draw();
        const endMs = (new Date()).valueOf();

        const sleepTime = Math.max(0, this.tickRateMs - (endMs - startMs));
    
        setTimeout(() => {
            requestAnimationFrame(this.tick.bind(this))
        }, sleepTime);
    }
}

const app = new App();

document.addEventListener("DOMContentLoaded", () => {
    app.start();
});

window.addEventListener("resize", () => {
    app.grid.init();
}, true);