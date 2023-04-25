import * as path from "path";

const express = require("express");
const app = express();
const server = require('http').Server(app);
import SocketService from "./util/io";
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
import authRouter from './routers/authRouter'
import checkersRouter from "./routers/checkersRouter";
import roomRouter from './routers/roomRouter';
import gamesRouter from "./routers/gamesRouter";
import profileRouter from "./routers/profileRouter";

app.use(express.json());
app.use(cookieParser());
app.use("/games", gamesRouter);
app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/checkers", checkersRouter);
app.use("/profile", profileRouter)
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.set("socketService", new SocketService(server));
const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://rumik:13372281@cluster0.orq3t9o.mongodb.net/?retryWrites=true&w=majority`);
        server.listen(3001, function() {
            console.log("listening on *:3001");
        });
    } catch (e) {
        console.log(e);
    }
}

start();

