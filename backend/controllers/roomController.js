"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const Room_1 = require("../models/Room");
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
const emitToPlayers = require("../util/util");
class roomController {
    constructor() {
        this.firstPlayer = null;
        this.secondPlayer = null;
        this.connect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const { id: userId } = jwt.verify(token, secret);
                const candidate = yield User_1.default.findById(userId);
                const roomId = req.body.roomId;
                const room = yield Room_1.default.findById(roomId);
                if (room.firstPlayerId === "no player") {
                    room.firstPlayerId = candidate._id;
                    yield room.save();
                }
                else if (room.secondPlayerId === "no player") {
                    room.secondPlayerId = candidate._id;
                    yield room.save();
                }
                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.createRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const room = new Room_1.default();
                yield room.save();
                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getRoomList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield Room_1.default.find();
                res.json(rooms);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getRoomId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const { id: userId } = jwt.verify(token, secret);
                let currentRoom = yield Room_1.default.findOne({ $or: [{ 'firstPlayerId': userId }, { 'secondPlayerId': userId }] });
                res.send({ roomId: currentRoom._id });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getLobbyInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const { id: userId } = jwt.verify(token, secret);
                let currentRoom = yield Room_1.default.findOne({ $or: [{ 'firstPlayerId': userId }, { 'secondPlayerId': userId }] });
                let firstPlayer = "no player";
                let secondPlayer = "no player";
                if (currentRoom.firstPlayerId !== "no player") {
                    firstPlayer = yield User_1.default.findById(currentRoom.firstPlayerId);
                    firstPlayer = firstPlayer.username;
                }
                if (currentRoom.secondPlayerId !== "no player") {
                    secondPlayer = yield User_1.default.findById(currentRoom.secondPlayerId);
                    secondPlayer = secondPlayer.username;
                }
                res.send({ roomId: currentRoom._id, firstPlayer: firstPlayer, secondPlayer: secondPlayer });
                if (currentRoom.firstPlayerId !== "no player" && currentRoom.secondPlayerId !== "no player") {
                    emitToPlayers(req, [currentRoom.firstPlayerId], 'updateLobbyData', { roomId: currentRoom._id, firstPlayer: firstPlayer, secondPlayer: secondPlayer });
                    emitToPlayers(req, [currentRoom.firstPlayerId, currentRoom.secondPlayerId], 'makeBtnActive', {});
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new roomController();
//# sourceMappingURL=roomController.js.map