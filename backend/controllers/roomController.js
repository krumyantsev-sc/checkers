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
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
class roomController {
    constructor() {
        this.connect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.jwt;
                const { id: userId } = jwt.verify(token, secret);
                const candidate = yield User_1.default.findById(userId);
                const roomId = req.body.roomId;
                const room = yield Room_1.default.findById(roomId);
                if (!room.firstPlayer && room.secondPlayer !== candidate) {
                    room.firstPlayer = candidate;
                    yield room.save();
                }
                else if (!room.secondPlayer && room.firstPlayer !== candidate) {
                    room.secondPlayer = candidate;
                    yield room.save();
                }
                res.sendStatus(200).json({ status: "connected" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.createRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const room = new Room_1.default();
                yield room.save();
                res.sendStatus(200).json({ status: "room created" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getRoomList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield Room_1.default.find()
                    .populate('firstPlayer')
                    .populate('secondPlayer')
                    .exec();
                const transformedRooms = rooms.map(room => {
                    return {
                        _id: room._id,
                        firstPlayer: room.firstPlayer ? room.firstPlayer.username : "no player",
                        secondPlayer: room.secondPlayer ? room.secondPlayer.username : "no player"
                    };
                });
                res.json(transformedRooms);
            }
            catch (error) {
                console.log(error);
            }
        });
        // public getRoomId = async (req: Request, res: Response): Promise<any> => {
        //     try {
        //         const token: string = req.cookies.jwt;
        //         const {id: userId} = jwt.verify(token, secret);
        //         let currentRoom: IRoom = await Room.findOne({$or:[{'firstPlayerId': userId}, {'secondPlayerId': userId}]});
        //         res.send({roomId:currentRoom._id});
        //     }
        //     catch (error) {
        //         console.log(error);
        //     }
        // }
        this.getLobbyInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let firstPlayerId;
                let secondPlayerId;
                const token = req.cookies.jwt;
                console.log(req.body.id);
                const { id: userId } = jwt.verify(token, secret);
                console.log(req.body);
                let currentRoom = yield Room_1.default.findOne({ _id: req.body.id })
                    .populate('firstPlayer')
                    .populate('secondPlayer')
                    .exec();
                if (currentRoom.firstPlayer) {
                    firstPlayerId = currentRoom.firstPlayer._id.toString();
                }
                if (currentRoom.secondPlayer) {
                    secondPlayerId = currentRoom.secondPlayer._id.toString();
                }
                //{$or:[{'firstPlayer._id': new mongoose.Types.ObjectId(userId)}, {'secondPlayer._id':  new mongoose.Types.ObjectId(userId)}]});
                const transformedRoom = {
                    roomId: currentRoom._id,
                    firstPlayer: currentRoom.firstPlayer ? currentRoom.firstPlayer.username : "no player",
                    secondPlayer: currentRoom.secondPlayer ? currentRoom.secondPlayer.username : "no player"
                };
                res.send(transformedRoom);
                if (currentRoom.firstPlayer && currentRoom.secondPlayer) {
                    (0, util_1.default)(req, [firstPlayerId], 'updateLobbyData', transformedRoom);
                    (0, util_1.default)(req, [firstPlayerId, secondPlayerId], 'makeBtnActive', {});
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