import {Tile, tileSize} from "./tile.js";
import {Color, randomColor} from "./color.js";
import {otedBlocks, onlineBlocks} from "./blocks.js";
const activeColorCount = 5;
const fillColor = new Color("rgba(0,0,0,0.85)");
const initialColor = new Color("rgba(0,0,0,2)");

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

    this.tiles = Array(Math.ceil(window.innerHeight / tileSize)).fill().map((_, y) => {
        return Array(Math.ceil(window.innerWidth / tileSize)).fill().map((_, x) => {
            return new Tile(
                x,
                y,
                x * tileSize,
                y * tileSize,
                this.canvas,
            );
        })
    })

    this.tilesX = this.tiles[0].length;
    this.tilesY = this.tiles.length;

    this.resize = () => {
        this.dirtyTileQueue = this.tiles.flat();
        this.time = 0;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    this.otedBlockTileCount = 0;
    this.onlineBlockColor = new Color("white");
    this.shouldRefreshOnlineColor = false;

    this.draw = () => {
        let dirtyTilesToProcess = this.dirtyTileQueue.splice(0, this.dirtyTileQueue.length);
        let colorCountObj = {};
        const refreshOnlineColor = this.shouldRefreshOnlineColor;
        this.shouldRefreshOnlineColor = false;

        while (dirtyTilesToProcess.length) {
            const t = dirtyTilesToProcess.shift();
            if (t.isInOtedBlock || this.isInOtedBlock(t.gridX, t.gridY)) {
                t.isInOtedBlock = true;
                if (this.time === 0) this.otedBlockTileCount++;
            }

            if (t.isInOnlineBlock || this.isInOnlineBlocks(t.gridX, t.gridY)) {
                t.isInOnlineBlock = true;
            }

            if (this.time === 0) {
                t.setColor(t.isInOnlineBlock ? this.onlineBlockColor : initialColor);
            } else if (refreshOnlineColor && t.isInOnlineBlock) {
                t.setColor(this.onlineBlockColor);
            } else if (!t.isInOtedBlock && !t.isInOnlineBlock) {
                t.setColor(fillColor);
            }

            t.draw(this.time);

            if (!t.isInOnlineBlock && t.color.value !== initialColor.value && t.color.value !== fillColor.value) {
                if (colorCountObj[t.color.value]) {
                    colorCountObj[t.color.value] = colorCountObj[t.color.value] + 1;
                } else {
                    colorCountObj[t.color.value] = 1;
                }
            }
        }

        const colorCount = Object.keys(colorCountObj).length;
        this.time++;

        if (colorCount < activeColorCount) {
            this.selectCandidate(colorCount);
        }
    }

    this.selectCandidate = (colorCount) => {
        const color = randomColor()
        const randomTile = colorCount % 2 === 0 ? this.randomTile() : this.randomTileInOtedBlock();
        const callRandomCenter = new CustomEvent("TileCall", {
            detail: {
                x: randomTile.gridX,
                y: randomTile.gridY,
                color: color,
                time: this.time,
                newSpawn : true
            }
        });

       this.canvas.dispatchEvent(callRandomCenter);
    }

    this.randomTile = () => {
        const randX = Math.floor(Math.random() * this.tilesX);
        const randY = Math.floor(Math.random() * this.tilesY);
        return this.tiles[randY][randX];
    }

    this.randomTileInOtedBlock = () => {
        while (true) {
            const randX = Math.floor(Math.random() * this.tilesX);
            const randY = Math.floor(Math.random() * this.tilesY);
            if (this.isInOtedBlock(randX, randY)) {
                return this.tiles[randY][randX];
            }
        }
    }

    this.isInOtedBlock = (tileX, tileY) => {
        const targetXPercent = tileX / this.tilesX;
        const targetYPercent = tileY / this.tilesY;
        for (let i = 0; i < otedBlocks.length; i++) {
            const startX = otedBlocks[i][0];
            const endX = otedBlocks[i][2];
            const startY = otedBlocks[i][1];
            const endY = otedBlocks[i][3];
            if (targetXPercent >= startX && targetXPercent <= endX &&
                targetYPercent >= startY && targetYPercent <= endY) {
                return true;
            }
        }

        return false;
    }

    this.isInOnlineBlocks = (tileX, tileY) => {
        const targetXPercent = tileX / this.tilesX;
        const targetYPercent = tileY / this.tilesY;
        for (let i = 0; i < onlineBlocks.length; i++) {
            const startX = onlineBlocks[i][0];
            const endX = onlineBlocks[i][2];
            const startY = onlineBlocks[i][1];
            const endY = onlineBlocks[i][3];
            if (targetXPercent >= startX && targetXPercent <= endX &&
                targetYPercent >= startY && targetYPercent <= endY) {
                return true;
            }
        }

        return false;
    }
}

export {Grid};
