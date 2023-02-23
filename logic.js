function reset() {
    for (const e of document.getElementsByClassName("small-board")) {
        e.setAttribute("data-content", "");
    }
    for (const e of document.getElementsByClassName("cell")) {
        e.setAttribute("data-content", "");
    }
}

let x_next = false;

function next() {
    x_next = !x_next;
    return x_next ? "x" : "o";
}

for (const e of document.getElementsByClassName("cell")) {
    e.addEventListener("click", (elem) => { elem.target.setAttribute("data-content", next()) })
} 