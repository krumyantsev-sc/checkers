const moveService = require("../services/MoveService")

const getPositionsForHighlighting = (i,j) => {
    return moveService.getSimpleMoveVariants(i,j);
}

module.exports = {getPositionsForHighlighting};