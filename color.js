const DEFAULT_STRENGTH = 0.7;
const NEGATIVE_STRENGTH_VARY = 0.1;
const DEFAULT_LIFESPAN = 750;
const LIFESPAN_VARY = 500;
const STRENGTH_DECAY_RATE = 0.99;
const NEGATIVE_STRENGTH_DECAY_RATE_VARY = 0.04;

const COLOR_PICK_ALTERNATIVES = [
    "#CA1B56",
    "#6C3258",
    "#38626B",
    "#EEEEF5",
    "#51618E",
    "#FFE266",
    "#C03351",
    //"#352A30",
    "#FE9A69"
]

class Color{
    constructor(
        value,
        strength,
        time
    ) {
        this.id = crypto.randomUUID();
        this.value = value;
        this.strength = strength ? strength : (DEFAULT_STRENGTH - ((Math.random() * NEGATIVE_STRENGTH_VARY)));
        this.lifespan = DEFAULT_LIFESPAN + ((Math.random() * LIFESPAN_VARY) - (LIFESPAN_VARY / 2));
        this.strengthDecayRate = STRENGTH_DECAY_RATE - ((Math.random() * NEGATIVE_STRENGTH_DECAY_RATE_VARY));
        this.createdAt = time || 0;
    }

    getEffectiveStrength(time) {
        const timeDiff = time - this.createdAt;
        if (timeDiff < this.lifespan) {
            return this.strength;
        }

        const effectiveStrength = this.strength * Math.pow(
            this.strengthDecayRate,
            timeDiff
        );

        return effectiveStrength;
    }
}

const randomColor = (time)  => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 90;
    const lightness = 40 + Math.random() * 10;
    return new Color(
        `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`, 
        null,
        time
    )
}

const pickedColor = (time, colorStrength) => {
    const pick = COLOR_PICK_ALTERNATIVES[Math.floor(Math.random() * COLOR_PICK_ALTERNATIVES.length)]
    return new Color(
        `${pick}`,
        colorStrength,
        time
    )
}

export {randomColor, Color, pickedColor}