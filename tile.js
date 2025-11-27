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

const DEFAULT_OTED_BLOCK_AMPLIFIER = 2.2;

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
    this.isInOtedBlock = false;
    this.isInOnlineBlock = false;
    this.otedBlockAmplifier = DEFAULT_OTED_BLOCK_AMPLIFIER;

    this.draw = (time) => {
        if (this.callMessage && this.callMessage.time === time) {
            this.setColor(this.callMessage.color);
            this.handleDrawPropagation(time, this.callMessage.newSpawn);
            this.callMessage = null;
        }

        if (this.prevColor != this.color) {
            this.dispatchDirtyTile();
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

        if (newSpawn) {
            events.forEach(e => {
                this.canvas.dispatchEvent(e);
            })
        } else if (this.isInOtedBlock) {
            const thresh = this.color.strength * this.otedBlockAmplifier;
            events.forEach(e => {
                Math.random() < thresh ? this.canvas.dispatchEvent(e) : null;
            })
        } else {
            events.forEach(e => {
                Math.random() < this.color.strength ? this.canvas.dispatchEvent(e) : null;
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

    this.answerCall = (e) => {
        this.dispatchDirtyTile();
        this.callMessage = e.detail;
    }

    this.fill = () => {
        this.context.fillStyle = this.color.value;
        this.context.fillRect(this.canvasX, this.canvasY, TILE_SIZE, TILE_SIZE);
    }

    this.drawBorder = () => {
       this.context.strokeStyle = "rgba(0,0,0,.7)";
       this.context.strokeRect(this.canvasX - 1, this.canvasY - 1, TILE_SIZE + 1, TILE_SIZE + 1);
    }

    this.setColor = (color) => {
        this.prevColor = this.color;
        this.color = color;
    }
}

export {Tile, TILE_SIZE};
