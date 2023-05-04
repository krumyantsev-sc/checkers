"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = void 0;
const mongoose_1 = require("mongoose");
const Message_1 = require("./Message");
const statusEnum = ['active', 'finished'];
const RoomSchema = new mongoose_1.Schema({
    firstPlayer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    secondPlayer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    winner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: statusEnum,
        default: 'active',
    },
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Game',
    },
    chat: {
        type: [Message_1.MessageModel.schema],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    finishedAt: {
        type: Date,
        default: Date.now,
    },
});
exports.RoomModel = (0, mongoose_1.model)('Room', RoomSchema);
exports.default = exports.RoomModel;
//# sourceMappingURL=Room.js.map