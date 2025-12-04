
function Controller(
    blocks,
    grid
) {
    this.aboutButton = document.getElementById("nav-about-button");
    this.contactButton = document.getElementById("nav-contact-button");
    this.hereButton  = document.getElementById("nav-here-button");
    this.grid = grid;
    this.blocks = blocks;

    //this.aboutButton.addEventListener("click", () => {
        //this.blocks.toggleButtonBlock();
        //this.grid.init();
    //})
}

export {Controller};