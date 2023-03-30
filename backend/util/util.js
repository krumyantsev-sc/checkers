function emitToPlayers(req, players, eventName, data) {
    for (let player of players) {
        req.app.get("socketService").emiter(eventName, player, data);
    }
}

module.exports = emitToPlayers;