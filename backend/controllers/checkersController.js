const moveService = require("../services/MoveService")

const getPositionsForHighlighting = (i,j) => {
    return moveService.checkMoveVariants(i,j);
}

module.exports = {getPositionsForHighlighting};