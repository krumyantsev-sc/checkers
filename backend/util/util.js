"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function emitToPlayers(req, players, eventName, data) {
    for (let player of players) {
        req.app.get("socketService").emiter(eventName, player, data);
    }
}
exports.default = emitToPlayers;
//# sourceMappingURL=util.js.map