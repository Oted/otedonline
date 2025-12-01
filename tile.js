import {shuffle} from "./utils.js";

const TILE_SIZE = 3;

function Tile(
    gridX,
    gridY,
    canvasX,
    canvasY,
    canvas,
    color
) {
    this.prevColor = null;
    this.gridX = gridX;
    this.gridY = gridY;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.color = color;
    this.waitingCall = null;
    this.isInBlock = false;
    this.id = `${gridX}-${gridY}`;

    this.draw = (time) => {
        if (this.waitingCall && this.waitingCall.time === time) {
            this.answerCall(time);
        }

        if (this.prevColor?.value !== this.color?.value) {
            this.drawBorder();
            this.fill();
        }
    }

    this.answerCall = (time) => {
        if (this.shouldChange(time)) {
            this.setColor(this.waitingCall.color, time);
        }

        this.handleCallPropagation(time, this.waitingCall.newSpawn);
        this.waitingCall = null;
    }

    this.handleCallPropagation = (time, newSpawn) => {
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
        const effectiveStrength = this.color.getEffectiveStrength(time);

        if (newSpawn) {
            events.forEach(e => {
                this.canvas.dispatchEvent(e);
            })
        } else if (this.isInBlock) {
            const thresh = Math.min(1, effectiveStrength);
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

    this.shouldChange = (time) => {
        const currentStrength = this.color.getEffectiveStrength(time);

        let shouldChange = this.waitingCall.color.value !== this.color.value ||
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
       this.context.strokeStyle = "rgba(0,0,0,.55)";
       this.context.strokeRect(this.canvasX - 1, this.canvasY - 1, TILE_SIZE + 1, TILE_SIZE + 1);
    }

    this.setColor = (color, time) => {
        this.prevColor = this.color;
        this.color = color;
    }
}

export {Tile, TILE_SIZE};
