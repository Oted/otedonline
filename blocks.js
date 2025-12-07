import {shuffle, randomFromArray} from "./utils.js";

const mainButtonBlock = [
    [0.0,0.0,0.5,0.33], //left top
    [0.5,0.0,1,0.33], //right top
    [0.0,0.33,0.5,0.66], //left mid
    [0.5,0.33,1,0.66], //right mid
    [0.0,0.66,0.5,1], //left bot
    [0.5,0.6,1,1], //right bot
]

const otedO = [
    [0.12, 0.18, 0.24, 0.26], //top
    [0.10, 0.21, 0.15, 0.53], //left
    [0.12, 0.48, 0.24, 0.56], //bot
    [0.20, 0.21, 0.26, 0.53], //right
];

const otedT = [
    [0.10, 0.06, 0.50, 0.14], //top
    [0.29, 0.06, 0.34, 0.56], //pillar
];

const otedE = [
    [0.37, 0.18, 0.44, 0.56], //left
    [0.37, 0.18, 0.50, 0.26], //top
    [0.37, 0.33, 0.50, 0.41], //mid
    [0.37, 0.48, 0.50, 0.56], //bot
];

const otedD = [
    [0.53, 0.18, 0.57, 0.56], //left
    [0.52, 0.18, 0.67, 0.26], //top
    [0.52, 0.48, 0.67, 0.56], //bot
    [0.64, 0.25, 0.69, 0.51], //left
];

const onlineO = [
    [0.21, 0.60, 0.30, 0.65], //top
    [0.21, 0.63, 0.24, 0.80], //left
    [0.21, 0.77, 0.30, 0.82], //bot
    [0.27, 0.63, 0.30, 0.80], //right
];

const onlineN1 = [
    [0.33, 0.60, 0.36, 0.82], //left
    [0.36, 0.60, 0.38, 0.68], //diag top
    [0.38, 0.66, 0.40, 0.76], //diag mid
    [0.40, 0.74, 0.42, 0.82], //diag bottom
    [0.42, 0.60, 0.45, 0.82], //right
];

const onlineL = [
    [0.48, 0.60, 0.51, 0.82], //pillar
    [0.48, 0.77, 0.55, 0.82], //foot
];

const onlineI = [[0.57, 0.60, 0.61, 0.82]]; //pillar

const onlineN2 = [
    [0.63, 0.60, 0.66, 0.82], //left
    [0.66, 0.60, 0.68, 0.68], //diag top
    [0.68, 0.66, 0.70, 0.76], //diag mid
    [0.70, 0.74, 0.72, 0.82], //diag bottom
    [0.72, 0.60, 0.75, 0.82], //right
];

const onlineE = [
    [0.78, 0.60, 0.81, 0.82], //left
    [0.78, 0.60, 0.87, 0.65], //top
    [0.78, 0.68, 0.87, 0.73], //mid
    [0.78, 0.77, 0.87, 0.82], //bot
];

export class Blocks {
    constructor() {
        this.otedBlocks = otedO.concat(otedT, otedE, otedD);
        this.onlineBlocks = onlineO.concat(onlineN1, onlineL, onlineI, onlineN2, onlineE);
        this.buttonBlockActive = false;
    }

    getActiveBlocks() {
        if (this.buttonBlockActive) {
            return mainButtonBlock;
        } 

        return shuffle(this.otedBlocks.concat(this.onlineBlocks));
    }

    toggleButtonBlock() {
        this.buttonBlockActive = !this.buttonBlockActive;
    }

    getBlockFromEachSubBlock() {
        if (this.buttonBlockActive) {
            return mainButtonBlock;
        } 

        return [
            randomFromArray(otedO),
            randomFromArray(otedT),
            randomFromArray(otedE),
            randomFromArray(otedD),
            randomFromArray(onlineO),
            randomFromArray(onlineN1),
            randomFromArray(onlineL),
            randomFromArray(onlineI),
            randomFromArray(onlineN2),
            randomFromArray(onlineE),
        ];
    }
}