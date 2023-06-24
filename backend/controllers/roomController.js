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
const Game_1 = require("../pgModels/Game");
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
class roomController {
    constructor() {
        this.connect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // try {
            //     const token: string = req.cookies.jwt;
            //     const {id: userId} = jwt.verify(token, secret);
            //     const candidate: IUser = await User.findById(userId);
            //     const activeRoom: IRoom[] = await Room.find({$and: [{$or: [{firstPlayer: candidate._id}, {secondPlayer: candidate._id}]}, {status: "active"}]});
            //     if (activeRoom.length !== 0) {
            //         if (activeRoom[0]._id.toString() !== req.body.roomId) {
            //             return res.status(403).json({
            //                 message: "Вы уже являетесь участником активной комнаты.",
            //                 roomId: activeRoom[0]._id.toString()
            //             });
            //         }
            //     }
            //     const roomId: string = req.body.roomId;
            //     const room: IRoom = await Room.findById(roomId);
            //     if (room.firstPlayer && room.secondPlayer && (room.firstPlayer.toString() !== candidate._id.toString()) && (room.secondPlayer.toString() !== candidate._id.toString())) {
            //         return res.status(403).json({
            //             message: "Комната переполнена.",
            //         });
            //     }
            //     if (!room.firstPlayer) {
            //         room.firstPlayer = candidate;
            //         await room.save();
            //     } else if (!room.secondPlayer && room.firstPlayer.toString() !== candidate._id.toString()) {
            //         room.secondPlayer = candidate;
            //         await room.save();
            //         emitToPlayers(req, [room.firstPlayer.toString()], 'updateLobbyData', {});
            //     }
            //     return res.status(200).json({status: "connected"});
            // } catch (error) {
            //     console.log(error);
            // }
        });
        this.leaveRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // try {
            //     const roomId: string = req.body.roomId;
            //     const room: IRoom = await Room.findById(roomId);
            //     if (room.createdAt.toString() !== room.startedAt.toString()) {
            //         return res.status(403).json({message: "Комнату нельзя покинуть после начала игры."});
            //     }
            //     const token: string = req.cookies.jwt;
            //     const {id: userId} = jwt.verify(token, secret);
            //     if (room.firstPlayer?.toString() === userId) {
            //         room.firstPlayer = undefined;
            //     }
            //     if (room.secondPlayer?.toString() === userId) {
            //         room.secondPlayer = undefined;
            //     }
            //     await room.save();
            //     res.status(200).json({message: "Вы успешно покинули комнату."});
            // } catch (e) {
            //     console.error(e);
            // }
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
                    include: [
                        { model: User_1.User, as: 'firstPlayer', attributes: ['username'] },
                        { model: User_1.User, as: 'secondPlayer', attributes: ['username'] }
                    ],
                    offset,
                    limit,
                    order: [['id', 'DESC']],
                });
                const totalPages = Math.ceil(totalRooms / limit);
                const rooms = rawRooms;
                const transformedRooms = rooms.map(room => {
                    return {
                        id: room.id,
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
            // try {
            //     let currentRoom: IRoom = await Room.findOne({_id: req.body.id})
            //         .populate('firstPlayer')
            //         .populate('secondPlayer')
            //         .exec()
            //     const transformedRoom = {
            //         roomId: currentRoom._id,
            //         firstPlayer: currentRoom.firstPlayer ?
            //             {
            //                 username: currentRoom.firstPlayer.username,
            //                 firstName: currentRoom.firstPlayer.firstName,
            //                 lastName: currentRoom.firstPlayer.lastName,
            //                 statistics: currentRoom.firstPlayer.statistics,
            //                 avatar: currentRoom.firstPlayer.avatar
            //             } : {},
            //         secondPlayer: currentRoom.secondPlayer ?
            //             {
            //                 username: currentRoom.secondPlayer.username,
            //                 firstName: currentRoom.secondPlayer.firstName,
            //                 lastName: currentRoom.secondPlayer.lastName,
            //                 statistics: currentRoom.secondPlayer.statistics,
            //                 avatar: currentRoom.secondPlayer.avatar
            //             } : {}
            //     };
            //     res.send(transformedRoom);
            // } catch (error) {
            //     console.log(error);
            // }
        });
    }
}
exports.default = new roomController();
//# sourceMappingURL=roomController.js.map