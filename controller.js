export class Controller {
    constructor(blocks, grid, eventBus) {
        this.hamburgerButton = document.getElementById("nav-burger");
        this.closeButton = document.getElementById("close-box-icon");
        this.openButton = document.getElementById("open-box-icon");

        this.aboutButton = document.getElementById("about-button");
        this.journeyButton = document.getElementById("journey-button");
        this.projectsButton = document.getElementById("projects-button");
        this.contactButton = document.getElementById("contact-button");
        this.contactTriggerButton = document.getElementById("contact-trigger");
    
        this.box = document.getElementById("box");
        this.boxContent = document.getElementById("box-content-container");
        this.boxNav = document.getElementById("box-nav");
        this.showBox = false;

        this.eventBus = eventBus;
        this.grid = grid;
        this.blocks = blocks;

        this.allNavButtons = this.boxNav.querySelectorAll('[data-tab]');
        this.allBoxContent = this.boxContent.querySelectorAll('[data-tab]');

        this.aboutButton.addEventListener("click", this.boxTabButtonClick.bind(this));
        this.contactButton.addEventListener("click", this.boxTabButtonClick.bind(this));
        this.journeyButton.addEventListener("click", this.boxTabButtonClick.bind(this));
        this.projectsButton.addEventListener("click", this.boxTabButtonClick.bind(this));

        this.contactTriggerButton.addEventListener("click", (e) => {
            window.open("mailto:contact@oted.online");
        });

        this.hamburgerButton.addEventListener("click", (e) => {
            this.hamburgerClick();
        });
    }

    boxTabButtonClick(e) {
        const target = e.currentTarget.getAttribute("data-tab");
        e.currentTarget.classList.add("active");

        this.allNavButtons.forEach(el => {
            if (el.getAttribute("data-tab") === target) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        })

        this.allBoxContent.forEach(el => {
            if (el.getAttribute("data-tab") === target) {
                el.classList.remove("no-show");
            } else {
                el.classList.add("no-show");
            }
        })
    }

    hamburgerClick() {
        this.showBox = !this.showBox;
        if (this.showBox) {
            this.openButton.classList.add("no-show");
            this.closeButton.classList.remove("no-show");
            this.box.className = "box"
            this.grid.init({colorStrength: 0.5, maxActiveColors: 10});
            this.blocks.toggleButtonBlock();
        } else {
            this.openButton.classList.remove("no-show");
            this.closeButton.classList.add("no-show");
            this.box.className = "box hidden"
            //this.grid.init();
        }
    }
}