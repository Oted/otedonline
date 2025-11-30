const DEFAULT_STRENGTH = 0.635;
const NEGATIVE_STRENGTH_VARY = 0.1;
const DEFAULT_LIFESPAN = 750;
const LIFESPAN_VARY = 500;

function Color(
    value,
    strength,
    time
) {
    this.value = value;
    this.strength = strength ? strength : DEFAULT_STRENGTH;
    this.lifespan = DEFAULT_LIFESPAN + ((Math.random() * LIFESPAN_VARY) - (LIFESPAN_VARY/ 2))
    this.createdAt = time;

    this.getEffectiveStrength = (time) => {
        const timeDiff = time - this.createdAt;
        if (timeDiff < this.lifespan) {
            return this.strength;
        }

        const effectiveStrength = this.strength * Math.pow(0.975, timeDiff);

        return Math.max(0, effectiveStrength);
    }
}

function randomColor(time) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 90;
    const lightness = 40 + Math.random() * 10;
    return new Color(
        `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`, 
        DEFAULT_STRENGTH - ((Math.random() * NEGATIVE_STRENGTH_VARY)),
        time
    )
}

export {randomColor, Color, DEFAULT_STRENGTH}