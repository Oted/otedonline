const DEFAULT_STRENGTH = 0.28;

function Color(
    value,
    strength
) {
    this.value = value;
    this.strength = strength ? strength : DEFAULT_STRENGTH;
}

function randomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 100;
    const lightness = 40 + Math.random() * 20;
    return new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
}

export {randomColor, Color, DEFAULT_STRENGTH}