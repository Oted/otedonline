import {shuffle} from "./utils.js";

const TILE_SIZE =  (() => {
    //some mobile thing
    if (window.innerWidth < window.innerHeight) {
        if (window.innerHeight <= 1920) {
            return 5;
        }

        if (window.innerHeight <= 2400) {
            return 8;
        }

        return 15;
    }

    if (window.innerWidth <= 1600) {
        return 5;
    }

    if (window.innerWidth <= 2100) {
        return 10;
    }

    return 15;
})();

const DEFAULT_BLOCK_AMPLIFIER = 2.2;
const MIN_EFFECTIVE_STRENGTH = 0.02;
const STRENGTH_DECAY_WINDOW = 400;

function Tile(
    gridX,
    gridY,
    canvasX,
    canvasY,
    canvas,
) {
    this.prevColor = null;
    this.gridX = gridX;
    this.gridY = gridY;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.color = null;
    this.waitingCall = null;
    this.isInBlock = false;
    this.coloredAt = 0;
    this.id = `${gridX}-${gridY}`;

    this.draw = (time) => {
        if (this.waitingCall && this.waitingCall.time === time) {
            if (this.shouldChange(time)) {
                this.setColor(this.waitingCall.color, time);
            }

            this.handleDrawPropagation(time, this.waitingCall.newSpawn);
            this.waitingCall = null;
        }

        if (this.prevColor?.value !== this.color?.value) {
            this.drawBorder();
            this.fill();
        }
    }

    this.handleDrawPropagation = (time, newSpawn) => {
        const eventNorth = new CustomEvent("TileCall", {
            detail: {
                x: this.gridX,
                y: this.gridY - 1,
                color: this.color,
                time: time + 1
            }
        });
        const eventSouth = new CustomEvent("TileCall", {
            detail: {
                x: this.gridX,
                y: this.gridY + 1,
                color: this.color,
                time: time + 1
            }
        });
        const eventEast = new CustomEvent("TileCall", {
            detail: {
                x: this.gridX + 1,
                y: this.gridY,
                color: this.color,
                time: time + 1
            }
        });
        const eventWest = new CustomEvent("TileCall", {
            detail: {
                x: this.gridX - 1,
                y: this.gridY,
                color: this.color,
                time: time + 1
            }
        });

        const events = shuffle([eventEast, eventWest, eventNorth, eventSouth]);
        const effectiveStrength = this.getEffectiveStrength(time);

        if (newSpawn) {
            events.forEach(e => {
                this.canvas.dispatchEvent(e);
            })
        } else if (this.isInBlock) {
            const thresh = Math.min(1, effectiveStrength * DEFAULT_BLOCK_AMPLIFIER);
            events.forEach(e => {
                Math.random() < thresh ? this.canvas.dispatchEvent(e) : null;
            })
        } 
    }

    this.dispatchDirtyTile = () => {
        this.canvas.dispatchEvent(new CustomEvent("DirtyTile", {
            detail: {
                x: this.gridX,
                y: this.gridY
            }
        }));
   }

    this.getEffectiveStrength = (time) => {
        const age = Math.max(0, time - this.coloredAt);
        const decay = Math.max(MIN_EFFECTIVE_STRENGTH, 1 - (age / STRENGTH_DECAY_WINDOW));

        return this.color.strength * decay;
    }

    this.shouldChange = (time) => {
        const currentStrength = this.getEffectiveStrength(time);

        const shouldChange = this.waitingCall.color.value !== this.color.value ||
            this.waitingCall.color.strength > currentStrength;

        return shouldChange;

    }

    this.pushCallToQueue = (e) => {
        this.waitingCall = e.detail;

        if (this.shouldChange(e.detail.time)) {
            this.dispatchDirtyTile();
        }
    }

    this.fill = () => {
        this.context.fillStyle = this.color.value;
        this.context.fillRect(this.canvasX, this.canvasY, TILE_SIZE, TILE_SIZE);
    }

    this.drawBorder = () => {
       this.context.strokeStyle = "rgba(0,0,0,.7)";
       //this.context.strokeRect(this.canvasX - 1, this.canvasY - 1, TILE_SIZE + 1, TILE_SIZE + 1);
    }

    this.setColor = (color, time) => {
        this.prevColor = this.color;
        this.color = color;
        this.coloredAt = time;
    }
}

export {Tile, TILE_SIZE};
