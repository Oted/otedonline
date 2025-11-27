import {Tile, tileSize} from "./tile.js";
import {Color, randomColor} from "./color.js";
import {otedBlocks, onlineBlocks} from "./blocks.js";
;
const activeColorCount = 5;
const fillColor = new Color("rgba(0,0,0,0.85)");
const initialColor = new Color("rgba(0,0,0,2)");

function Grid(
    canvas,
) {
    this.canvas = canvas;
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
        this.dirtyTiles = this.tiles.flat();
        this.time = 0;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    this.otedBlockTileCount = 0;
    this.onlineBlockColor = new Color("white");
    this.shouldRefreshOnlineColor = false;
    this.dirtyTiles = [];

    this.newDraw = () => {
        let colorCountObj = {};
        const refreshOnlineColor = this.shouldRefreshOnlineColor;
        this.shouldRefreshOnlineColor = false;

        this.dirtyTiles.forEach(t => {
            if (t.isInOtedBlock || this.isInOtedBlock(x, y)) {
                t.isInOtedBlock = true;
                if (this.time === 0) this.otedBlockTileCount++;
            }

            if (t.isInOnlineBlock || this.isInOnlineBlocks(x, y)) {
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

            const colorCount = Object.keys(colorCountObj).length;
            this.time++;

            if (colorCount < activeColorCount) {
                this.selectCandidate(colorCount);
            }
        })
    }

    this.draw = () => {
        let colorCountObj = {};
        const refreshOnlineColor = this.shouldRefreshOnlineColor;
        this.shouldRefreshOnlineColor = false;

        for (let y = 0; y < this.tilesY; y++) {
            const col = this.tiles[y];
            for (let x = 0; x < this.tilesX; x++) {
                const t = col[x];

                if (t.isInOtedBlock || this.isInOtedBlock(x, y)) {
                    t.isInOtedBlock = true;
                    if (this.time === 0) this.otedBlockTileCount++;
                }

                if (t.isInOnlineBlock || this.isInOnlineBlocks(x, y)) {
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
                chosen: true
            }
        });
        const callRandomWest = new CustomEvent("TileCall", {
            detail: {
                x: randomTile.gridX - 1,
                y: randomTile.gridY,
                color: color,
                time: this.time,
                chosen: true
            }
        });
        const callRandomEast = new CustomEvent("TileCall", {
            detail: {
                x: randomTile.gridX + 1,
                y: randomTile.gridY,
                color: color,
                time: this.time,
                chosen: true
            }
        });
        const callRandomNorth = new CustomEvent("TileCall", {
            detail: {
                x: randomTile.gridX,
                y: randomTile.gridY - 1,
                color: color,
                time: this.time,
                chosen: true
            }
        });
        const callRandomSouth = new CustomEvent("TileCall", {
            detail: {
                x: randomTile.gridX,
                y: randomTile.gridY + 1,
                color: color,
                time: this.time,
                chosen: true
            }
        });
        this.canvas.dispatchEvent(callRandomWest);
        this.canvas.dispatchEvent(callRandomEast);
        this.canvas.dispatchEvent(callRandomNorth);
        this.canvas.dispatchEvent(callRandomCenter);
        this.canvas.dispatchEvent(callRandomSouth);
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

    this.clear = () => {
        this.canvas.getContext("2d").clearRect(0, 0, this.width, this.height);
    }
}

export {Grid};
