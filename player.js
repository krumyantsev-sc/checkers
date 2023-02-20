export default class Player {
    score = 0;

    moveChecker(checker, board, from, to) {
        console.log(from,to);
        checker.move(board,from,to);
    }

}
