import {Request, Response} from 'express';
import {User} from "../pgModels/User";

const multer = require('multer');
const path = require('path');
import * as fs from 'fs';
import Room, {IRoom} from "../models/Room";
import {Op} from "sequelize";
import {Statistic} from "../pgModels/Statistic";

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
            if (fileNameWithoutExt.startsWith(userId)) {
                fs.unlinkSync(path.join("static/avatar/", file));
            }
        });
        cb(null, fileName);
    }
});


class UserProfileController {
    upload = multer({storage: storage});
    updateProfile = async (req: Request, res: Response) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const avatarFile = req.file;
        const token: string = req.cookies.jwt;
        const { id: userId } = jwt.verify(token, secret) as any;

        try {
            const hashPassword: string = bcrypt.hashSync(password, 7);

            const updatedUserData: any = {
                email: email,
                password: hashPassword,
                firstName: firstName,
                lastName: lastName,
            };

            if (avatarFile) {
                updatedUserData.avatar = avatarFile.filename;
            }

            const updatedUser = await User.update(updatedUserData, {
                where: { id: userId },
                returning: true,
            });

            if (updatedUser[0] === 0) {
                res.status(404).send({ message: "User not found" });
            } else {
                res.send({
                    message: "Profile updated successfully",
                    status: "success",
                });
            }
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the profile" });
        }
    };

    getProfileAvatar = async (req: Request, res: Response) => {
        try {
            const token: string = req.cookies.jwt;
            const {id: userId}: { id: string } = jwt.verify(token, secret) as { id: string };
            const user = await User.findOne({
                where: {
                    id: userId
                }
            });
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            if (!user.avatar) {
                return res.status(404).json({error: 'Avatar not found'});
            }
            return res.json({avatar: user.avatar});
        } catch (e) {
            console.log(e)
            return res.status(500).json({error: 'Internal server error'});
        }
    }

    getProfileInfo = async (req: Request, res: Response) => {
        try {
            console.log("!!!!!!!!!!!!!")
            const token: string = req.cookies.jwt;
            console.log(token)
            const {id: userId}: { id: string } = jwt.verify(token, secret) as { id: string };
            console.log(userId);
            const user = await User.findOne({
                where: {
                    id: userId
                }
            });
            const statistics = await Statistic.findOne({
                where: {
                    userId: userId
                }
            });
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            return res.json({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                wins: statistics.wins,
                loses: statistics.loses
            });
        } catch (e) {
            return res.status(500).json({error: 'Internal server error'});
        }
    }

    getMatchHistory = async (req: Request, res: Response) => {
        // try {
        //     const token: string = req.cookies.jwt;
        //     const {id: userId}: { id: string } = jwt.verify(token, secret) as { id: string };
        //     const user = await User.findById(userId);
        //     if (!user) {
        //         return res.status(404).json({error: 'User not found'});
        //     }
        //     const rooms = await Room.find({
        //         $or: [{'firstPlayer': user}, {'secondPlayer': user}], $and: [
        //             {'status': 'finished'}
        //         ]
        //     })
        //         .populate('firstPlayer')
        //         .populate('secondPlayer')
        //         .populate('game')
        //         .populate('winner')
        //         .exec();
        //     const transformedRooms = rooms.map(room => {
        //         return {
        //             _id: room._id,
        //             firstPlayer: room.firstPlayer ? room.firstPlayer.username : "no player",
        //             secondPlayer: room.secondPlayer ? room.secondPlayer.username : "no player",
        //             game: room.game.name,
        //             winner: room.winner ? room.winner.username : "no winner",
        //             createdAt: room.createdAt,
        //             duration: Math.floor(Math.abs(room.finishedAt.getTime() - room.startedAt.getTime()) / (1000 * 60))
        //         };
        //     });
        //     const page: number = Number(req.query.page) || 1;
        //     const limit: number = Number(req.query.limit) || 10;
        //     const startIndex: number = (page - 1) * limit;
        //     const endIndex: number = page * limit;
        //
        //     const paginatedGames = transformedRooms.slice(startIndex, endIndex);
        //     const totalPages: number = Math.ceil(rooms.length / limit);
        //
        //     return res.json({games: paginatedGames, totalPages});
        // } catch (e) {
        //     return res.status(500).json({error: 'Internal server error'});
        // }
    }

    getInfoById = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const user = await User.findOne({
                where: {
                    id: userId
                }
            });
            const statistics = await Statistic.findOne({
                where: {
                    userId: userId
                }
            });
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            return res.json({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                wins: statistics.wins,
                loses: statistics.loses,
                avatar: user.avatar
            });
        } catch (e) {
            return res.status(500).json({error: 'Internal server error'});
        }
    }
}

export default new UserProfileController();