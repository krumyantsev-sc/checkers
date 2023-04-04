const express = require("express");
const app = express();
const server = require('http').Server(app);
import SocketService from "./io";
const mongoose = require('mongoose');
const cors = require('cors');
import authRouter from './authRouter'
import checkersRouter from "./checkersRouter";
import roomRouter from './roomRouter.js';

app.use(express.json());
app.set("socketService", new SocketService(server));
app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/checkers", checkersRouter);
app.use(cors({
    origin: ['http://localhost:63342']
}));

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
