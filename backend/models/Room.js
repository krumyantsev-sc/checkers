"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
    firstPlayerId: { type: String, default: "no player" },
    secondPlayerId: { type: String, default: "no player" },
    winner: { type: String, default: "no winner" }
});
const RoomModel = (0, mongoose_1.model)('Room', RoomSchema);
exports.default = RoomModel;
//# sourceMappingURL=Room.js.map