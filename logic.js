//There are four statews in general: Empty  d - Draw  x/o - Win for that Player

class SBoard {
    constructor() {
        this.reset();
    }

    reset() {
        this.cells = ["", "", "", "", "", "", "", "", ""];
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
            if (three_in_a_row(this.cells[0 + i * 3], this.cells[1 + i * 3], this.cells[2 + i * 3])) {
                return this.cells[0 + i * 3];
            }
            if (three_in_a_row(this.cells[0 + i], this.cells[3 + i], this.cells[6 + i])) {
                return this.cells[0 + i];
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
    return (a == b && b == c && b != "")
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
        e.setAttribute("data-placeable", "true");
    }
    for (const e of document.getElementsByClassName("cell")) {
        e.setAttribute("data-content", "");
    }
    game_state = new BBoard();
    x_next = false;
    move_history.innerHTML = "";
}

let x_next = true;
let game_state = new BBoard();
let move_history = document.getElementById("move-history");

function next() {
    x_next = !x_next;
    return x_next ? "o" : "x";
}

function apply_move(b_index, c_index, target) {
    let player = next();
    game_state.boards[b_index].cells[c_index] = player;
    target.setAttribute("data-content", player);
    target.parentElement.parentElement.setAttribute("data-content", game_state.boards[b_index].update_state());
    let next_board_state = game_state.boards[c_index].state;
    let boards = document.getElementsByClassName("small-board");
    for (let i = 0; i < 9; i++) {
        let v = `${next_board_state == "" ? (i == c_index) : true}`;
        boards[i].setAttribute("data-placeable", v);
    }

    const isScrolledToBottom = move_history.scrollHeight - move_history.clientHeight <= move_history.scrollTop + 1;
    const move = document.createElement('p');
    move.textContent = `Move { x: ${3 * (b_index % 3) + c_index % 3}, y: ${3 * (Math.floor(b_index / 3)) + Math.floor(c_index / 3)} }`;
    move_history.appendChild(move);
    if (isScrolledToBottom) {
        move_history.scrollTop = move_history.scrollHeight;
    }

}

for (const element of document.getElementsByClassName("cell")) {
    element.addEventListener("click", (event) => {
        apply_move(event.target.parentElement.parentElement.id[1], event.target.classList[1][1], event.target);
    })
}

function engine_code() {
    let forced = -1;
    let board_elements = document.getElementsByClassName("small-board");
    let code = "Board {\n\tsub_boards: [\n"
    for (let index = 0; index < 9; index++) {
        const board = game_state.boards[index];
        code += `\t\tSubBoard {
        \t\tstate: State::${board.state == "" ? 'NotFinished' : (board.state == "d" ? 'Draw' : (board.state == "x" ? 'Win(Player::Guest)' : 'Win(Player::Host)'))},
        \t\tcells: [\n`;
        for (const cell of board.cells) {
            code += `\t\t\t\tCell::${cell == "" ? 'Empty' : cell.toUpperCase()},\n`;
        }
        code += `\t\t\t],\n\t\t},\n`;
        if (board_elements[index].dataset['placeable'] === 'true') {
            forced = forced == -1 ? index : -2;
        }
    }
    code += `\t],\n\tforced_sub_board: ${forced < 0 ? 'None' : `Some(${forced})`},\n\tnext: Player::${(x_next ? 'Guest' : 'Host')},\n}`;
    return code;
}
