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
const User_1 = require("../pgModels/User");
const Room_1 = require("../pgModels/Room");
const util_1 = require("../util/util");
const Game_1 = require("../pgModels/Game");
const sequelize_1 = require("sequelize");
const Statistic_1 = require("../pgModels/Statistic");
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
class roomController {
    constructor() {
        this.connect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("!!!!");
                const token = req.cookies.jwt;
                const { id: userId } = jwt.verify(token, secret);
                const candidate = yield User_1.User.findByPk(userId);
                if (!candidate) {
                    throw new Error('User not found');
                }
                const activeRoom = yield Room_1.Room.findOne({
                    where: {
                        status: 'active',
                        [sequelize_1.Op.or]: [
                            { firstPlayerId: candidate.id },
                            { secondPlayerId: candidate.id }
                        ]
                    }
                });
                if (activeRoom && activeRoom.id !== req.body.roomId) {
                    return res.status(403).json({
                        message: 'You are already in an active room',
                        roomId: activeRoom.id
                    });
                }
                const roomId = req.body.roomId;
                const room = yield Room_1.Room.findByPk(roomId, {
                    include: [
                        { model: User_1.User, as: 'firstPlayer' },
                        { model: User_1.User, as: 'secondPlayer' }
                    ]
                });
                if (!room) {
                    throw new Error('Room not found');
                }
                if (room.firstPlayerId && room.secondPlayerId && room.firstPlayerId !== candidate.id && room.secondPlayerId !== candidate.id) {
                    return res.status(403).json({
                        message: 'Room is full',
                    });
                }
                if (!room.firstPlayerId) {
                    room.firstPlayer = candidate;
                    room.firstPlayerId = candidate.id;
                    yield room.save();
                }
                else if (!room.secondPlayerId && room.firstPlayerId !== candidate.id) {
                    room.secondPlayer = candidate;
                    room.secondPlayerId = candidate.id;
                    yield room.save();
                    console.log("roomfirstId", room.firstPlayerId);
                    (0, util_1.default)(req, [room.firstPlayerId], 'updateLobbyData', {});
                }
                return res.status(200).json({ status: 'connected' });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: 'An error occurred while connecting to the room' });
            }
        });
        this.leaveRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const roomId = req.body.roomId;
                const room = yield Room_1.Room.findByPk(roomId);
                if (!room) {
                    return res.status(404).json({ message: "Room not found." });
                }
                if (room.createdAt.toString() !== room.startedAt.toString()) {
                    return res.status(403).json({ message: "You cannot leave the room after the game has started." });
                }
                const token = req.cookies.jwt;
                const { id: userId } = jwt.verify(token, secret);
                if (room.firstPlayerId === userId) {
                    room.firstPlayerId = null;
                }
                if (room.secondPlayerId === userId) {
                    room.secondPlayerId = null;
                }
                yield room.save();
                return res.status(200).json({ message: "You have successfully left the room." });
            }
            catch (error) {
                console.error(error);
            }
        });
        this.createRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const gameName = req.params.gameName;
                const game = yield Game_1.Game.findOne({ where: { name: gameName } });
                if (!game) {
                    return res.status(404).json({ status: "Game not found" });
                }
                const room = yield Room_1.Room.create({
                    gameId: game.id,
                    status: "active",
                    createdAt: new Date(),
                    startedAt: new Date(),
                    finishedAt: null
                });
                return res.status(200).json({ status: "room created", room: room });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "An error occurred while creating the room" });
            }
        });
        this.createRoomWithBot = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // try {
            //     const gameName: string = req.params.gameName;
            //     const game: IGame = await Game.findOne({name: gameName});
            //     const room: HydratedDocument<IRoom> = new Room({game: game});
            //     const token: string = req.cookies.jwt;
            //     const {id: userId} = jwt.verify(token, secret);
            //     const candidate: IUser = await User.findById(userId);
            //     const bot = await User.findById("6474ead11d7ba9f21dbe2315");
            //     room.firstPlayer = candidate;
            //     room.secondPlayer = bot;
            //     await room.save();
            //     return res.status(200).json({id: room._id});
            // } catch (error) {
            //     console.log(error);
            // }
        });
        this.getRoomList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const gameName = req.params.gameName;
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const offset = (page - 1) * limit;
                const game = yield Game_1.Game.findOne({ where: { name: gameName } });
                if (!game) {
                    return res.status(404).json({ message: "Game not found!" });
                }
                const { count: totalRooms, rows: rawRooms } = yield Room_1.Room.findAndCountAll({
                    where: { gameId: game.id, status: "active" },
                    offset,
                    limit,
                    order: [['id', 'DESC']],
                });
                const totalPages = Math.ceil(totalRooms / limit);
                const rooms = rawRooms;
                const transformedRooms = yield Promise.all(rooms.map((room) => __awaiter(this, void 0, void 0, function* () {
                    const firstPlayer = yield User_1.User.findByPk(room.firstPlayerId);
                    const secondPlayer = yield User_1.User.findByPk(room.secondPlayerId);
                    return {
                        id: room.id,
                        firstPlayer: room.firstPlayerId ? firstPlayer.username : "no player",
                        secondPlayer: room.secondPlayerId ? secondPlayer.username : "no player"
                    };
                })));
                res.json({ transformedRooms, totalPages });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getLobbyInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let currentRoom = yield Room_1.Room.findOne({
                    where: { id: req.body.id },
                });
                const firstPlayer = yield User_1.User.findByPk(currentRoom.firstPlayerId);
                const secondPlayer = yield User_1.User.findByPk(currentRoom.secondPlayerId);
                const firstPlayerStats = yield Statistic_1.Statistic.findOne({ where: { userId: currentRoom.firstPlayerId } });
                const secondPlayerStats = yield Statistic_1.Statistic.findOne({ where: { userId: currentRoom.secondPlayerId } });
                const transformedRoom = {
                    roomId: currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.id,
                    firstPlayer: (currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.firstPlayerId)
                        ? {
                            username: firstPlayer.username,
                            firstName: firstPlayer.firstName,
                            lastName: firstPlayer.lastName,
                            statistics: firstPlayerStats,
                            avatar: firstPlayer.avatar,
                        }
                        : {},
                    secondPlayer: (currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.secondPlayerId)
                        ? {
                            username: secondPlayer.username,
                            firstName: secondPlayer.firstName,
                            lastName: secondPlayer.lastName,
                            statistics: secondPlayerStats,
                            avatar: secondPlayer.avatar,
                        }
                        : {},
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