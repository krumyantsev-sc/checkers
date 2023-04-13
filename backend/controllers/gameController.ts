import { Request, Response } from 'express';
import Game, {IGame} from "../models/Game"
import User, {IUser} from "../models/User";
import {HydratedDocument} from "mongoose";

class gameController {
    createGame = async (req: Request, res: Response): Promise<any> => {
        try {
            const {name, description, logo} = req.body;
            let game: HydratedDocument<IGame> = new Game({name: name, description: description, logo: logo});
            await game.save();
            return res.json({message: "Игра успешно создана"});
        } catch {
            return res.status(400).json({message: 'Ошибка создания игры'});
        }
    }

    public getGames = async (req: Request, res: Response): Promise<any> => {
        try {
            const games: IGame[] = await Game.find();
            res.json(games);
        } catch (e) {
            console.log(e);
        }
    }
}

export default new gameController();