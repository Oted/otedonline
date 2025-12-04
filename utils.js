const MIN_WIDTH_DESKTOP_IDENTIFICATION = 768;

const shuffle = (list) => {
    let i = list.length;
    while (i) {
        const j = Math.floor(Math.random() * i);
        const t = list[--i];
        list[i] = list[j];
        list[j] = t;
    }
    return list;
}

const randomFromArray = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const isMobile = () => {
    return window.innerWidth < MIN_WIDTH_DESKTOP_IDENTIFICATION || 
        screen.width < MIN_WIDTH_DESKTOP_IDENTIFICATION;
}

export {shuffle, randomFromArray, isMobile};