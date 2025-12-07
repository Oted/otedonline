
export class Controller {
    constructor(blocks, grid) {
        this.hamburgerButton = document.getElementById("nav-burger");
        this.box = document.getElementById("box");
        this.showBox = false;
        this.aboutButton = document.getElementById("")

        this.grid = grid;
        this.blocks = blocks;

        this.hamburgerButton.addEventListener("click", () => {
            this.hamburgerClick()
        })
    }

    hamburgerClick = () => {
        this.showBox = !this.showBox;
        if (this.showBox) {
            this.box.className = "box"
            this.grid.init({colorStrength: 0.48});
        } else {
            this.box.className = "box hidden"
            this.grid.init();
        }

        this.blocks.toggleButtonBlock();
    }
}