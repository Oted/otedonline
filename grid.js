import {Tile, TILE_SIZE} from "./tile.js";
import {Color, randomColor, pickedColor} from "./color.js";
import {randomFromArray} from "./utils.js";

const BG_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
const FILL_COLOR = new Color(`${BG_COLOR}`);

const DEFAULT_SETTINGS = {
    maxActiveColors: 11,
    colorStrength: null,
}

function Grid(
    canvas,
    blocks
) {
    this.canvas = canvas;
    this.blocks = blocks;
    this.dirtyTileSet = {};
    this.blockPointer = 0;
    this.targetBlocks = [];
    this.time = 0;

    this.canvas.addEventListener("DirtyTile", (e) => {
        const t = this.tiles[e.detail.y][e.detail.x];
        this.dirtyTileSet[t.id] = t;
    }, false)

    this.canvas.addEventListener("TileCall", (e) => {
        //tiles can call outside blocks and canvas
        try {
            this.tiles[e.detail.y][e.detail.x].pushCallToQueue(e);
        } catch {}
    }, false)

    this.init = (settings) => {
        this.canvas.width = this.canvas.parentNode.clientWidth;
        this.canvas.height = this.canvas.parentNode.clientHeight;
        this.time = 0;
        this.dirtyTileSet = {};
        this.blockPointer = 0;
        this.targetBlocks = [];
        this.settings = Object.assign(
            {}, 
            DEFAULT_SETTINGS,
            settings || {}
        )
        
        this.tiles = Array(Math.ceil(this.canvas.height / TILE_SIZE)).fill().map((_, y) => {
            return Array(Math.ceil(this.canvas.width / TILE_SIZE)).fill().map((_, x) => {
                return new Tile(
                    x,
                    y,
                    x * TILE_SIZE,
                    y * TILE_SIZE,
                    this.canvas,
                    FILL_COLOR
                );
            })
        })

        this.tilesX = this.tiles[0].length;
        this.tilesY = this.tiles.length;
    }

    this.draw = () => {
        let colorCountObj = {};

        for (const tileId in this.dirtyTileSet) {
            const t = this.dirtyTileSet[tileId];
            if (t.isInBlock || this.isInBlock(t.gridX, t.gridY)) {
                t.isInBlock = true;
            }

            if (this.time === 0) {
                t.setColor(FILL_COLOR, this.time);
            }

            t.draw(this.time);

            if (t.color.value !== FILL_COLOR.value) {
                if (colorCountObj[t.color.value]) {
                    colorCountObj[t.color.value] = colorCountObj[t.color.value] + 1;
                } else {
                    colorCountObj[t.color.value] = 1;
                }
            }

            delete this.dirtyTileSet[tileId];
        }

        const colorCount = Object.keys(colorCountObj).length;
        this.time++;

        const maxActive = Math.min(
            this.settings.maxActiveColors, 
            Math.ceil(this.time / 200)
        );

        if (colorCount < maxActive) {
            this.selectCandidate();
        }
    }

    this.selectCandidate = () => {
        const color = pickedColor(this.time, this.settings.colorStrength);

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

    this.selectNextBlockTarget = () => {
        if (this.blockPointer >= this.targetBlocks.length) {
            this.blockPointer = 0;
            this.targetBlocks = this.blocks.getBlockFromEachSubBlock();
        }
        
        const block = this.targetBlocks[this.blockPointer];
        this.blockPointer++;
        return block;
    }

    this.randomTileInBlock = () => {
        const selectedBlock = this.selectNextBlockTarget();

        const startXPercent = selectedBlock[0];
        const endXPercent = selectedBlock[2];
        const startYPercent = selectedBlock[1];
        const endYPercent = selectedBlock[3];

        const randomTileXPercent = startXPercent + (Math.random() * (endXPercent - startXPercent));
        const randomTileYPercent = startYPercent + (Math.random() * (endYPercent - startYPercent));

        const targetTileX = Math.floor(randomTileXPercent * this.tilesX);
        const targetTileY = Math.floor(randomTileYPercent * this.tilesY);
        return this.tiles[targetTileY][targetTileX];
    }

    this.isInBlock = (tileX, tileY) => {
        const blocks = this.blocks.getActiveBlocks();

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