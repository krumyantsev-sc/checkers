import {Request, Response} from 'express';
import User, {IUser} from "../models/User";
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcrypt")
const secret = require("../config/config")
const jwt = require("jsonwebtoken")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/avatar/');
    },
    filename: function (req, file, cb) {
        console.log(file);
        console.log(path.extname("data/file.jpg"))
        const token: string = req.cookies.jwt;
        const {id: userId} = jwt.verify(token, secret);
        const fileName = `${userId}${path.extname(file.originalname)}`;
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
            console.log(filePath)
            if (fs.existsSync(avatarFile)) {
                // Если файл существует, удаляем его
                fs.unlinkSync(filePath);
            }
            const hashPassword: string = bcrypt.hashSync(password, 7);
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    email: email,
                    password: hashPassword,
                    firstName: firstName,
                    lastName: lastName,
                    avatar: avatarFile.filename
                },
                { new: true } // This option returns the updated document
            );

            if (!updatedUser) {
                res.status(404).send("User not found");
            } else {
                res.send({ message: "Profile updated successfully", user: updatedUser });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while updating the profile");
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

}

export default new UserProfileController();