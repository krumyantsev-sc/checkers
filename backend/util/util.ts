function emitToPlayers(req: any, players: string[], eventName: string, data: any) {
    for (let player of players) {
        req.app.get("socketService").emiter(eventName, player, data);
    }
}

export default emitToPlayers;