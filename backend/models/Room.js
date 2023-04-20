"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const statusEnum = ['active', 'finished'];
const RoomSchema = new mongoose_1.Schema({
    firstPlayer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    secondPlayer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    winner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: statusEnum,
        default: 'active',
    },
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Game',
    }
});
const RoomModel = (0, mongoose_1.model)('Room', RoomSchema);
exports.default = RoomModel;
//# sourceMappingURL=Room.js.map