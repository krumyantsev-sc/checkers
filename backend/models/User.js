"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StatisticsSchema = new mongoose_1.Schema({
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
});
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    statistics: { type: StatisticsSchema, default: { wins: 0, loses: 0 } },
    email: { type: String, required: true },
    avatar: { type: String, default: "profile-avatar-default.png" },
    role: [{ type: String, ref: 'Role' }]
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
//# sourceMappingURL=User.js.map