import {shuffle} from "./utils.js";

export class Tile{
    constructor(
        eventBus,
        gridX,
        gridY,
        canvasX,
        canvasY,
        canvas,
        color,
        tileSize,
    ) {
        this.eventBus = eventBus;
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
        this.tileSize = tileSize;

        this.eventBus.subscribeTileCall(this.id, (data) => {
            this.pushCallToQueue(data);
        });
    }

    draw(time) {
        if (this.waitingCall && this.waitingCall.time === time) {
            this.answerCall(time);
        }

        if (this.prevColor?.id !== this.color?.id) {
            this.fill();
        }
    }

    answerCall(time) {
        if (this.shouldChange(time)) {
            this.setColor(this.waitingCall.color);
        }

        this.handleCallPropagation(time, this.waitingCall.newSpawn);
        this.waitingCall = null;
    }

    handleCallPropagation(time, newSpawn) {
        const eventNorth = {
            x: this.gridX,
            y: this.gridY - 1,
            color: this.color,
            time: time + 1
        }
        const eventSouth = {
            x: this.gridX,
            y: this.gridY + 1,
            color: this.color,
            time: time + 1
        };
        const eventEast = {
            x: this.gridX + 1,
            y: this.gridY,
            color: this.color,
            time: time + 1
        };
        const eventWest = {
            x: this.gridX - 1,
            y: this.gridY,
            color: this.color,
            time: time + 1
        };

        const events = shuffle([eventEast, eventWest, eventNorth, eventSouth]);
        const effectiveStrength = this.color.getEffectiveStrength(time);

        if (newSpawn) {
            events.forEach(e => {
                const address = `${e.x}-${e.y}`;
                this.eventBus.publishTileCall(address, e)
            })
        } else if (this.isInBlock) {
            const thresh = Math.min(1, effectiveStrength);
            events.forEach(e => {
                const address = `${e.x}-${e.y}`;
                if (Math.random() < thresh) {
                   this.eventBus.publishTileCall(address, e)
                } else if (this.prevColor.id !== this.color.id) {
                    //end borders on no spread

                    this.context.strokeStyle = "rgba(0,0,0,.4)";
                    //north
                    if (e.x === this.gridX && e.y < this.gridY) {
                        this.context.strokeRect(this.canvasX, this.canvasY, this.tileSize, 1);
                    }

                    //south
                    if (e.x === this.gridX && e.y > this.gridY) {
                        this.context.strokeRect(this.canvasX, this.canvasY + this.tileSize - 1, this.tileSize, 1);
                    }

                    //west
                    if (e.x < this.gridX && e.y === this.gridY) {
                        this.context.strokeRect(this.canvasX, this.canvasY, 1, this.tileSize);
                    }

                    //east
                    if (e.x > this.gridX && e.y === this.gridY) {
                        this.context.strokeRect(this.canvasX + this.tileSize - 1, this.canvasY, 1, this.tileSize);
                    }
                }
            })
        } 
    }

    shouldChange(time) {
        const currentStrength = this.color.getEffectiveStrength(time);

        let shouldChange = this.waitingCall.color.id !== this.color.id ||
            this.waitingCall.color.strength > currentStrength;

        return shouldChange;
    }

    pushCallToQueue(event) {
        this.waitingCall = event;

        if (this.shouldChange(event.time)) {
            this.eventBus.publishDirtyTile({
                x: this.gridX,
                y: this.gridY,
            })
        }
    }

    fill() {
        this.context.fillStyle = this.color.value;
        this.context.fillRect(this.canvasX, this.canvasY, this.tileSize, this.tileSize);
    }

    setColor(color) {
        this.prevColor = this.color;
        this.color = color;
    }
}