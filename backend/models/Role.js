"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoleSchema = new mongoose_1.Schema({
    value: { type: String, unique: true, default: 'USER' },
});
const RoleModel = (0, mongoose_1.model)('Role', RoleSchema);
exports.default = RoleModel;
//# sourceMappingURL=Role.js.map