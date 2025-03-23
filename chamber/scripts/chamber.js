document.addEventListener("DOMContentLoaded", () => {
    const gridButton = document.querySelector("#grid");
    const listButton = document.querySelector("#list");
    const display = document.querySelector("article");

    display.classList.add("grid");

    gridButton.addEventListener("click", () => {
        display.classList.add("grid");
        display.classList.remove("list");

        gridButton.classList.add("active");
        listButton.classList.remove("active");
    });

    listButton.addEventListener("click", () => {
        display.classList.add("list");
        display.classList.remove("grid");

        gridButton.classList.add("active");
        listButton.classList.remove("active");
    });
});