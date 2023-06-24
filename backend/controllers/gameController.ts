import {Request, Response} from 'express';
import {Game} from "../pgModels/Game"
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
            const newGame = await Game.create({
                name: name,
                description: description
            });
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
            const games = await Game.findAll();
            res.json(games);
        } catch (e) {
            console.log(e);
        }
    }

    editGame = async (req: Request, res: Response) => {
        const name: string = req.body.name;
        const description: string = req.body.description;
        const logoFile = req.file;
        const id: string = req.body.id;

        try {
            const updatedGameData: any = {
                name: name,
                description: description,
            };

            if (logoFile) {
                updatedGameData.logo = logoFile.filename;
            }

            const updatedGame = await Game.update(updatedGameData, {
                where: { id: id },
                returning: true,
            });

            if (updatedGame[0] === 0) {
                res.status(404).send({ message: "Game not found" });
            } else {
                res.send({
                    message: "Game updated successfully",
                    status: "success",
                });
            }
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the game" });
        }
    }

    deleteGame = async (req: Request, res: Response) => {
        try {
            const gameId = req.params.id;
            const deletedGame = await Game.destroy({ where: { id: gameId } });

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