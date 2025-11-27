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

export {shuffle, randomFromArray};