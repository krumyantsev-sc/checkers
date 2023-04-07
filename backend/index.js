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
const express = require("express");
const app = express();
const server = require('http').Server(app);
const io_1 = require("./util/io");
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter_1 = require("./routers/authRouter");
const checkersRouter_1 = require("./routers/checkersRouter");
const roomRouter_1 = require("./routers/roomRouter");
app.use(express.json());
app.use("/auth", authRouter_1.default);
app.use("/room", roomRouter_1.default);
app.use("/checkers", checkersRouter_1.default);
app.use(cors({
    origin: '*'
}));
app.set("socketService", new io_1.default(server));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(`mongodb+srv://rumik:13372281@cluster0.orq3t9o.mongodb.net/?retryWrites=true&w=majority`);
        server.listen(3001, function () {
            console.log("listening on *:3001");
        });
    }
    catch (e) {
        console.log(e);
    }
});
start();
//# sourceMappingURL=index.js.map