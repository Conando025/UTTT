//There are four statews in general: Empty  d - Draw  x/o - Win for that Player

class SBoard {
    constructor() {
        this.reset();
    }

    reset() {
        this.cells = ["", "", "", "", "" ,"", "", "" ,""];
        this.state = ""
    }

    get_state() {
        return this.state;
    }

    update_state() {
        this.state = this.update_state_internal();
        return this.state;
    }

    update_state_internal() {
        if (three_in_a_row(this.cells[0], this.cells[4], this.cells[8]) || three_in_a_row(this.cells[2], this.cells[4], this.cells[6])) {
            return this.cells[4];
        }
        for (let i = 0; i < 3; i++) {
            if (three_in_a_row(this.cells[0+i*3], this.cells[1+i*3], this.cells[2+i*3])) {
                return this.cells[0+i*3];
            }
            if (three_in_a_row(this.cells[0+i], this.cells[3+i], this.cells[6+i])) {
                return this.cells[0+i];
            }
        }
        for (const cell of this.cells) {
            if (cell == "") {
                return "";
            }
        }
        return "d";
    }
}

function three_in_a_row(a, b, c) {
    return (a == b && b == c && b!="")
}

class BBoard {
    constructor() {
        this.reset();
    }

    reset() {
        this.boards = [new SBoard(), new SBoard(), new SBoard(), new SBoard(), new SBoard(), new SBoard(), new SBoard(), new SBoard(), new SBoard()];
    }
}

function reset() {
    for (const e of document.getElementsByClassName("small-board")) {
        e.setAttribute("data-content", "");
    }
    for (const e of document.getElementsByClassName("cell")) {
        e.setAttribute("data-content", "");
    }
    game_state = new BBoard();
    x_next = false;
}

let x_next = false;
let game_state = new BBoard();

function next() {
    x_next = !x_next;
    return x_next ? "x" : "o";
}

function apply_move(b_index, c_index, target) {
    let player = next();
    game_state.boards[b_index].cells[c_index] = player;
    target.setAttribute("data-content", player);
    target.parentElement.parentElement.setAttribute("data-content", game_state.boards[b_index].update_state());
    let next_board_state = game_state.boards[c_index].state;
    let boards = document.getElementsByClassName("small-board");
    for (let i = 0; i < 8; i++) {
        let v = `${next_board_state == "" ? (i == c_index) : true}`;
        boards[i].setAttribute("data-placeable", v);
    }
}

for (const element of document.getElementsByClassName("cell")) {
    element.addEventListener("click", (event) => { 
        apply_move(event.target.parentElement.parentElement.id[1], event.target.classList[1][1], event.target);
     })
}
