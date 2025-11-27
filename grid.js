import {Tile, TILE_SIZE} from "./tile.js";
import {Color, randomColor} from "./color.js";
import {getActiveBlocks} from "./blocks.js";

const FILL_COLOR = new Color("rgba(0,0,0,0.85)");
const INITIAL_COLOR = new Color("rgba(0,0,0,2)");

function Grid(
    canvas,
) {
    this.canvas = canvas;
    this.dirtyTileQueue = [];

    this.canvas.addEventListener("DirtyTile", (e) => {
        this.dirtyTileQueue.push(this.tiles[e.detail.y][e.detail.x]);
    }, false)

    this.canvas.addEventListener("TileCall", (e) => {
        try {
            this.tiles[e.detail.y][e.detail.x].answerCall(e);
        } catch (err) {
        }
    }, false)

    this.tiles = Array(Math.ceil(window.innerHeight / TILE_SIZE)).fill().map((_, y) => {
        return Array(Math.ceil(window.innerWidth / TILE_SIZE)).fill().map((_, x) => {
            return new Tile(
                x,
                y,
                x * TILE_SIZE,
                y * TILE_SIZE,
                this.canvas,
            );
        })
    })

    this.tilesX = this.tiles[0].length;
    this.tilesY = this.tiles.length;

    this.resize = () => {
        this.dirtyTileQueue = this.tiles.flat();
        this.dirtyTileQueue.forEach((tile) => {
            tile.isDirty = true;
        });
        this.time = 0;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    this.blockColor = new Color("white");

    this.draw = () => {
        let dirtyTilesToProcess = this.dirtyTileQueue.splice(0, this.dirtyTileQueue.length);
        let colorCountObj = {};

        while (dirtyTilesToProcess.length) {
            const t = dirtyTilesToProcess.shift();
            if (t.isInBlock || this.isInBlock(t.gridX, t.gridY)) {
                t.isInBlock = true;
            }

            if (this.time === 0) {
                t.setColor(t.isInBlock ? INITIAL_COLOR : FILL_COLOR, this.time);
            }

            t.draw(this.time);

            if (t.color.value !== INITIAL_COLOR.value && t.color.value !== FILL_COLOR.value) {
                if (colorCountObj[t.color.value]) {
                    colorCountObj[t.color.value] = colorCountObj[t.color.value] + 1;
                } else {
                    colorCountObj[t.color.value] = 1;
                }
            }
        }

        const colorCount = Object.keys(colorCountObj).length;
        this.time++;

        this.selectCandidate(colorCount);
    }

    this.selectCandidate = () => {
        const color = randomColor()
        const randomTile = this.randomTileInBlock();
        const callRandomCenter = new CustomEvent("TileCall", {
            detail: {
                x: randomTile.gridX,
                y: randomTile.gridY,
                color: color,
                time: this.time,
                newSpawn: true
            }
        });

       this.canvas.dispatchEvent(callRandomCenter);
    }

    this.randomTile = () => {
        const randX = Math.floor(Math.random() * this.tilesX);
        const randY = Math.floor(Math.random() * this.tilesY);
        return this.tiles[randY][randX];
    }

    this.randomTileInBlock = () => {
        while (true) {
            const randX = Math.floor(Math.random() * this.tilesX);
            const randY = Math.floor(Math.random() * this.tilesY);
            if (this.isInBlock(randX, randY)) {
                return this.tiles[randY][randX];
            }
        }
    }

    this.isInBlock = (tileX, tileY) => {
        const blocks = getActiveBlocks();
        const targetXPercent = tileX / this.tilesX;
        const targetYPercent = tileY / this.tilesY;
        for (let i = 0; i < blocks.length; i++) {
            const startX = blocks[i][0];
            const endX = blocks[i][2];
            const startY = blocks[i][1];
            const endY = blocks[i][3];
            if (targetXPercent >= startX && targetXPercent <= endX &&
                targetYPercent >= startY && targetYPercent <= endY) {
                return true;
            }
        }

        return false;
    }
}

export {Grid};
