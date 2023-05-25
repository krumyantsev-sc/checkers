import {Request, Response} from 'express';
import Game, {IGame} from "../models/Game"
const multer = require('multer');
const path = require('path');
import * as fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/games/');
    },
    filename: function (req, file, cb) {
        const name: string = req.body.name;
        const fileName = `${name}${path.extname(file.originalname)}`;
        fs.readdirSync("static/games/").forEach(file => {
            const fileNameWithoutExt = path.parse(file).name;
            if (fileNameWithoutExt.startsWith(name)) {
                fs.unlinkSync(path.join("static/games/", file));
            }
        });
        cb(null, fileName);
    }
});

class gameController {
    upload = multer({storage: storage});
    createGame = async (req: Request, res: Response): Promise<any> => {
        const name: string = req.body.name;
        const description: string = req.body.description;
        const logoFile = req.file;
        try {
            const newGame = new Game({name: name, description: description});
            if (logoFile) {
                newGame.logo = logoFile.filename;
            }
            await newGame.save();
            res.send({message: "game created successfully", status: "success"});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "An error occurred while creating the game"});
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

    public editGame = async (req: Request, res: Response) => {
        const name: string = req.body.name;
        const description: string = req.body.description;
        const logoFile = req.file;
        const id: string = req.body.id;
        try {
            const updatedGame = await Game.findByIdAndUpdate(
                id,
                {
                    name: name,
                    description: description,
                },
                {new: true}
            );

            if (logoFile) {
                const updatedGame = await Game.findByIdAndUpdate(
                    id,
                    {
                        logo: logoFile.filename
                    },
                    {new: true}
                );
            }
            if (!updatedGame) {
                res.status(404).send({message: "Game not found"});
            } else {
                res.send({message: "game updated successfully", status: "success"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "An error occurred while updating the game"});
        }
    }

    deleteGame = async (req, res) => {
        try {
            const gameId = req.params.id;
            const deletedGame = await Game.findByIdAndDelete(gameId);

            if (!deletedGame) {
                return res.status(404).json({message: 'Game not found'});
            }

            res.status(200).json({message: 'Game deleted successfully'});
        } catch (error) {
            res.status(500).json({message: 'Error deleting game'});
        }
    };
}

export default new gameController();