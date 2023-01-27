class Square {
    constructor(color) {
        this.color = color;
        this.isMoveable = (this.color === "Brown");
    }
}

class checker {
    constructor(color) {
        this.color = color;
    }
    move() {

    }
    beat() {

    }
}

class lady extends checker {
    moveForward() {

    }

    beatForward() {

    }
}

class board {
    checkers = []
}

