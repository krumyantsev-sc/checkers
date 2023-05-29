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
const util_1 = require("../util/util");
const Game_1 = require("../models/Game");
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
class roomController {
    constructor() {
        this.connect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.jwt;
                const { id: userId } = jwt.verify(token, secret);
                const candidate = yield User_1.default.findById(userId);
                const activeRoom = yield Room_1.default.find({ $and: [{ $or: [{ firstPlayer: candidate._id }, { secondPlayer: candidate._id }] }, { status: "active" }] });
                if (activeRoom.length !== 0) {
                    if (activeRoom[0]._id.toString() !== req.body.roomId) {
                        return res.status(403).json({
                            message: "Вы уже являетесь участником активной комнаты.",
                            roomId: activeRoom[0]._id.toString()
                        });
                    }
                }
                const roomId = req.body.roomId;
                const room = yield Room_1.default.findById(roomId);
                if (room.firstPlayer && room.secondPlayer && (room.firstPlayer.toString() !== candidate._id.toString()) && (room.secondPlayer.toString() !== candidate._id.toString())) {
                    return res.status(403).json({
                        message: "Комната переполнена.",
                    });
                }
                if (!room.firstPlayer) {
                    room.firstPlayer = candidate;
                    yield room.save();
                }
                else if (!room.secondPlayer && room.firstPlayer.toString() !== candidate._id.toString()) {
                    room.secondPlayer = candidate;
                    yield room.save();
                    (0, util_1.default)(req, [room.firstPlayer.toString()], 'updateLobbyData', {});
                }
                return res.status(200).json({ status: "connected" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.leaveRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const roomId = req.body.roomId;
                const room = yield Room_1.default.findById(roomId);
                if (room.createdAt.toString() !== room.startedAt.toString()) {
                    return res.status(403).json({ message: "Комнату нельзя покинуть после начала игры." });
                }
                const token = req.cookies.jwt;
                const { id: userId } = jwt.verify(token, secret);
                if (((_a = room.firstPlayer) === null || _a === void 0 ? void 0 : _a.toString()) === userId) {
                    room.firstPlayer = undefined;
                }
                if (((_b = room.secondPlayer) === null || _b === void 0 ? void 0 : _b.toString()) === userId) {
                    room.secondPlayer = undefined;
                }
                yield room.save();
                res.status(200).json({ message: "Вы успешно покинули комнату." });
            }
            catch (e) {
                console.error(e);
            }
        });
        this.createRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const gameName = req.params.gameName;
                const game = yield Game_1.default.findOne({ name: gameName });
                const room = new Room_1.default({ game: game });
                yield room.save();
                return res.status(200).json({ status: "room created" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.createRoomWithBot = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const gameName = req.params.gameName;
                const game = yield Game_1.default.findOne({ name: gameName });
                const room = new Room_1.default({ game: game });
                const token = req.cookies.jwt;
                const { id: userId } = jwt.verify(token, secret);
                const candidate = yield User_1.default.findById(userId);
                const bot = yield User_1.default.findById("6474ead11d7ba9f21dbe2315");
                room.firstPlayer = candidate;
                room.secondPlayer = bot;
                yield room.save();
                return res.status(200).json({ id: room._id });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getRoomList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const gameName = req.params.gameName;
                const game = yield Game_1.default.findOne({ name: gameName });
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const skip = (page - 1) * limit;
                if (!game) {
                    return res.status(404).json({ message: "Game not found!" });
                }
                const allRooms = yield Room_1.default.find({ game: game._id, status: "active" });
                const rooms = yield Room_1.default.find({ game: game._id, status: "active" })
                    .skip(skip)
                    .limit(limit)
                    .sort({ _id: -1 })
                    .populate('firstPlayer')
                    .populate('secondPlayer')
                    .exec();
                const totalRooms = allRooms.length;
                const totalPages = Math.ceil(totalRooms / limit);
                const transformedRooms = rooms.map(room => {
                    return {
                        _id: room._id,
                        firstPlayer: room.firstPlayer ? room.firstPlayer.username : "no player",
                        secondPlayer: room.secondPlayer ? room.secondPlayer.username : "no player"
                    };
                });
                res.json({ transformedRooms, totalPages });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getLobbyInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let currentRoom = yield Room_1.default.findOne({ _id: req.body.id })
                    .populate('firstPlayer')
                    .populate('secondPlayer')
                    .exec();
                const transformedRoom = {
                    roomId: currentRoom._id,
                    firstPlayer: currentRoom.firstPlayer ?
                        {
                            username: currentRoom.firstPlayer.username,
                            firstName: currentRoom.firstPlayer.firstName,
                            lastName: currentRoom.firstPlayer.lastName,
                            statistics: currentRoom.firstPlayer.statistics,
                            avatar: currentRoom.firstPlayer.avatar
                        } : {},
                    secondPlayer: currentRoom.secondPlayer ?
                        {
                            username: currentRoom.secondPlayer.username,
                            firstName: currentRoom.secondPlayer.firstName,
                            lastName: currentRoom.secondPlayer.lastName,
                            statistics: currentRoom.secondPlayer.statistics,
                            avatar: currentRoom.secondPlayer.avatar
                        } : {}
                };
                res.send(transformedRoom);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new roomController();
//# sourceMappingURL=roomController.js.map