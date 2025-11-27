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
    [0.24, 0.60, 0.33, 0.65], //top
    [0.24, 0.63, 0.27, 0.80], //left
    [0.24, 0.77, 0.33, 0.82], //bot
    [0.30, 0.63, 0.33, 0.80], //right
];

const onlineN1 = [
    [0.35, 0.60, 0.38, 0.82], //left
    [0.38, 0.60, 0.40, 0.68], //diag top
    [0.40, 0.66, 0.42, 0.76], //diag mid
    [0.42, 0.74, 0.44, 0.82], //diag bottom
    [0.44, 0.60, 0.47, 0.82], //right
];

const onlineL = [
    [0.49, 0.60, 0.52, 0.82], //pillar
    [0.49, 0.77, 0.56, 0.82], //foot
];

const onlineI = [[0.57, 0.60, 0.61, 0.82]]; //pillar

const onlineN2 = [
    [0.62, 0.60, 0.65, 0.82], //left
    [0.65, 0.60, 0.67, 0.66], //diag top
    [0.67, 0.66, 0.69, 0.76], //diag mid
    [0.69, 0.76, 0.71, 0.82], //diag bottom
    [0.71, 0.60, 0.74, 0.82], //right
];

const onlineE = [
    [0.76, 0.60, 0.79, 0.82], //left
    [0.76, 0.60, 0.85, 0.65], //top
    [0.76, 0.68, 0.85, 0.73], //mid
    [0.76, 0.77, 0.85, 0.82], //bot
];

const otedBlocks = otedO.concat(otedT, otedE, otedD);
const onlineBlocks = onlineO.concat(onlineN1, onlineL, onlineI, onlineN2, onlineE);

const getActiveBlocks = () => {
    return otedBlocks.concat(onlineBlocks);

}
export {otedBlocks, onlineBlocks, getActiveBlocks};