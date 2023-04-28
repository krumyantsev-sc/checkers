import {Request, Response} from 'express';
import User, {IUser} from "../models/User";
const multer = require('multer');
const path = require('path');
import * as fs from 'fs';
import Room, {IRoom} from "../models/Room";
const bcrypt = require("bcrypt")
const secret = require("../config/config")
const jwt = require("jsonwebtoken")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/avatar/');
    },
    filename: function (req, file, cb) {
        const token: string = req.cookies.jwt;
        const {id: userId} = jwt.verify(token, secret);
        const fileName = `${userId}${path.extname(file.originalname)}`;
        fs.readdirSync("static/avatar/").forEach(file => {
            const fileNameWithoutExt = path.parse(file).name;
            console.log(fileNameWithoutExt);
            if (fileNameWithoutExt.startsWith(userId)) {
                console.log("Совпадение найдено")
                fs.unlinkSync(path.join("static/avatar/", file));
                console.log(`Файл ${file} удален`);
            }
        });
        cb(null, fileName);
    }
});


class UserProfileController {
    upload = multer({ storage: storage });
    updateProfile = async (req: Request, res: Response) => {
        const username: string = req.body.username;
        const email: string = req.body.email;
        const password: string = req.body.password;
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const avatarFile = req.file;
        const token: string = req.cookies.jwt;
        const {id: userId} = jwt.verify(token, secret);
        try {
            const hashPassword: string = bcrypt.hashSync(password, 7);
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    email: email,
                    password: hashPassword,
                    firstName: firstName,
                    lastName: lastName,
                },
                { new: true }
            );
            if (avatarFile) {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        avatar: avatarFile.filename
                    },
                    { new: true }
                );
            }

            if (!updatedUser) {
                res.status(404).send({message: "User not found"});
            } else {
                res.send({ message: "Profile updated successfully", status: "success" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"An error occurred while updating the profile"});
        }
    };

    getProfileAvatar = async (req: Request, res: Response) => {
        try {
            const token: string = req.cookies.jwt;
            const { id: userId }: {id: string} = jwt.verify(token, secret) as { id: string };
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!user.avatar) {
                return res.status(404).json({ error: 'Avatar not found' });
            }
            console.log(user.avatar)
            return res.json({avatar: user.avatar});
        } catch (e) {
            console.log(e)
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    getProfileInfo = async (req: Request, res: Response) => {
        try {
            const token: string = req.cookies.jwt;
            const { id: userId }: {id: string} = jwt.verify(token, secret) as { id: string };
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                wins: user.statistics.wins,
                loses: user.statistics.loses
            });
        } catch (e) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    getMatchHistory = async (req: Request, res: Response) => {
        try {
            const token: string = req.cookies.jwt;
            const { id: userId }: {id: string} = jwt.verify(token, secret) as { id: string };
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const rooms = await Room.find({$or:[{'firstPlayer': user}, {'secondPlayer': user}]})
                .populate('firstPlayer' )
                .populate('secondPlayer')
                .populate('game')
                .exec();
            const transformedRooms = rooms.map(room => {
                return {
                    _id: room._id,
                    firstPlayer: room.firstPlayer ? room.firstPlayer.username : "no player",
                    secondPlayer: room.secondPlayer ? room.secondPlayer.username : "no player",
                    game: room.game.name,
                    winner: room.winner ? room.winner.username : "no winner"
                };
            });
            const page: number = Number(req.query.page) || 1;
            const limit: number = Number(req.query.limit) || 10;
            const startIndex: number = (page - 1) * limit;
            const endIndex: number = page * limit;

            const paginatedGames = transformedRooms.slice(startIndex, endIndex);
            const totalPages: number = Math.ceil(rooms.length / limit);

            return res.json({ games: paginatedGames, totalPages });
        } catch (e) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default new UserProfileController();