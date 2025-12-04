
function Controller(
    blocks,
    grid
) {
    this.hamburgerButton = document.getElementById("nav-burger");
    this.box = document.getElementById("box");
    this.showBox = false;

    this.grid = grid;
    this.blocks = blocks;

    this.hamburgerButton.addEventListener("click", () => {this.hamburgerClick()})
    
    this.hamburgerClick = () => {
        this.showBox = !this.showBox;
        if (this.showBox) {
            this.box.className = "box"
        } else {
            this.box.className = "box hidden"
        }
        this.blocks.toggleButtonBlock();
        this.grid.init();
    }
}

export {Controller};