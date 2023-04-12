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

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/checkers", checkersRouter);
app.use(cors({
    origin: '*'
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

