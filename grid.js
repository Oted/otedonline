import {Tile} from "./tile.js";
import {Color, randomColor, pickedColor} from "./color.js";
import {randomFromArray, isMobile} from "./utils.js";

const BG_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
const FILL_COLOR = new Color(`${BG_COLOR}`);

const TILE_SIZE = isMobile() ? 3 : 4;

const DEFAULT_SETTINGS = {
    maxActiveColors: 12,
    colorStrength: null,
}

export class Grid {
    constructor(canvas, blocks, eventBus) {
        this.canvas = canvas;
        this.blocks = blocks;
        this.dirtyTileSet = {};
        this.blockPointer = 0;
        this.targetBlocks = [];
        this.eventBus = eventBus;
        this.time = 0;

        this.eventBus.subscribeDirtyTile((data) => {
            const t = this.tiles[data.y][data.x];
            this.dirtyTileSet[t.id] = t;
        });
    }

    init(settings) {
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

        //unsub all prev subscribers
        this.eventBus.unsubscribeAllTileCall()
        
        this.tiles = Array(Math.ceil(this.canvas.height / TILE_SIZE)).fill().map((_, y) => {
            return Array(Math.ceil(this.canvas.width / TILE_SIZE)).fill().map((_, x) => {
                const canvasX = x * TILE_SIZE;
                const canvasY = y * TILE_SIZE;

                return new Tile(
                    this.eventBus,
                    x,
                    y,
                    canvasX,
                    canvasY,
                    this.canvas,
                    FILL_COLOR,
                    TILE_SIZE,
                );
            })
        })

        this.tilesX = this.tiles[0].length;
        this.tilesY = this.tiles.length;
    }

    draw() {
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

            if (t.color.id !== FILL_COLOR.id) {
                if (colorCountObj[t.color.id]) {
                    colorCountObj[t.color.id] = colorCountObj[t.color.id] + 1;
                } else {
                    colorCountObj[t.color.id] = 1;
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

    selectCandidate() {
        const color = pickedColor(this.time, this.settings.colorStrength);

        const randomTile = this.randomTileInBlock();
        const eventData = {
            x: randomTile.gridX,
            y: randomTile.gridY,
            color: color,
            time: this.time,
            newSpawn: true
        };

        this.eventBus.publishTileCall(`${eventData.x}-${eventData.y}`, eventData);
    }

    selectNextBlockTarget() {
        if (this.blockPointer >= this.targetBlocks.length) {
            this.blockPointer = 0;
            this.targetBlocks = this.blocks.getBlockFromEachSubBlock();
        }
        
        const block = this.targetBlocks[this.blockPointer];
        this.blockPointer++;
        return block;
    }

    randomTileInBlock() {
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

    isInBlock(tileX, tileY) {
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