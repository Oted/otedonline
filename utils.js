function shuffle(list) {
    let i = list.length;
    while (i) {
        const j = Math.floor(Math.random() * i);
        const t = list[--i];
        list[i] = list[j];
        list[j] = t;
    }
    return list;
}

export {shuffle};

