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
})()

const DEFAULT_BLOCK_AMPLIFIER = 2.2;
const MIN_EFFECTIVE_STRENGTH = 0.05;
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
    this.callMessage = null;
    this.isInBlock = false;
    this.isDirty = false;
    this.coloredAt = 0;

    this.draw = (time) => {
        if (this.callMessage && this.callMessage.time === time) {
            const incomingColor = this.callMessage.color;
            const incomingStrength = incomingColor?.strength ?? 0;
            const currentStrength = this.getEffectiveStrength(time);
            const colorChanged = !this.color ||
                incomingColor.value !== this.color.value ||
                incomingStrength > currentStrength;

            if (colorChanged) {
                this.setColor(incomingColor, time);
            }

            this.handleDrawPropagation(time, this.callMessage.newSpawn);
            this.callMessage = null;
        }

        if (this.prevColor?.value !== this.color?.value) {
            this.drawBorder();
            this.fill();
        }

        this.isDirty = false;
    }

    this.handleDrawPropagation = (time, newSpawn) => {
        if (!this.color) {
            return;
        }

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
        } else {
            events.forEach(e => {
                Math.random() < effectiveStrength ? this.canvas.dispatchEvent(e) : null;
            })
        }
    }

    this.dispatchDirtyTile = () => {
        if (this.isDirty) {
            return;
        }
        this.isDirty = true;
        this.canvas.dispatchEvent(new CustomEvent("DirtyTile", {
            detail: {
                x: this.gridX,
                y: this.gridY
            }
        }));
    }

    this.getEffectiveStrength = (time) => {
        if (!this.color) {
            return 0;
        }

        if (typeof time !== "number") {
            return this.color.strength;
        }

        const age = Math.max(0, time - this.coloredAt);
        const decay = Math.max(MIN_EFFECTIVE_STRENGTH, 1 - (age / STRENGTH_DECAY_WINDOW));
        return this.color.strength * decay;
    }

    this.answerCall = (e) => {
        this.callMessage = e.detail;
        this.dispatchDirtyTile();
    }

    this.fill = () => {
        this.context.fillStyle = this.color.value;
        this.context.fillRect(this.canvasX, this.canvasY, TILE_SIZE, TILE_SIZE);
    }

    this.drawBorder = () => {
       this.context.strokeStyle = "rgba(0,0,0,.7)";
       this.context.strokeRect(this.canvasX - 1, this.canvasY - 1, TILE_SIZE + 1, TILE_SIZE + 1);
    }

    this.setColor = (color, time) => {
        this.prevColor = this.color;
        this.color = color;
        if (typeof time === "number") {
            this.coloredAt = time;
        }
    }
}

export {Tile, TILE_SIZE};
