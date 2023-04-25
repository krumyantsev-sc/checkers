import {Request, Response} from 'express';
import User, {IUser} from "../models/User";

const secret = require("../config/config")
const jwt = require("jsonwebtoken")

class UserProfileController {
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