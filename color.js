const DEFAULT_STRENGTH = 0.616;
const STRENGTH_VARY = 0.1;
const DEFAULT_LIFESPAN = 100;
const LIFESPAN_VARY = 100;

function Color(
    value,
    strength,
    time
) {
    this.value = value;
    this.strength = strength ? strength : DEFAULT_STRENGTH;
    this.lifespan = DEFAULT_LIFESPAN + ((Math.random() * LIFESPAN_VARY) - (LIFESPAN_VARY/ 2))
    this.createdAt = time;

    this.weaken = () => {
        this.strength = this.strength * 0.9999;
    }
}

function randomColor(time) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 100;
    const lightness = 40 + Math.random() * 20;
    return new Color(
        `hsl(${hue}, ${saturation}%, ${lightness}%)`, 
        DEFAULT_STRENGTH + ((Math.random() * STRENGTH_VARY) - (STRENGTH_VARY / 2)),
        time
    )
}

export {randomColor, Color, DEFAULT_STRENGTH}