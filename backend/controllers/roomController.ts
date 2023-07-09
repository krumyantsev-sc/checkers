import {User} from "../pgModels/User"
import {Room} from "../pgModels/Room"
import emitToPlayers from "../util/util";
import {Request, Response} from 'express';
import {Game} from "../pgModels/Game";
import {Op} from "sequelize";
import {Statistic} from "../pgModels/Statistic";

const jwt = require("jsonwebtoken");
const secret = require("../config/config");

interface RoomWithPlayers extends Room {
    firstPlayer: User;
    secondPlayer: User;
}

class roomController {

    public connect = async (req: Request, res: Response): Promise<any> => {
        try {
            console.log("!!!!")
            const token: string = req.cookies.jwt;
            const {id: userId} = jwt.verify(token, secret) as { id: number };

            const candidate = await User.findByPk(userId);

            if (!candidate) {
                throw new Error('User not found');
            }

            const activeRoom = await Room.findOne({
                where: {
                    status: 'active',
                    [Op.or]: [
                        { firstPlayerId: candidate.id },
                        { secondPlayerId: candidate.id }
                    ]
                }
            });

            if (activeRoom && activeRoom.id !== req.body.roomId) {
                return res.status(403).json({
                    message: 'You are already in an active room',
                    roomId: activeRoom.id
                });
            }

            const roomId: number = req.body.roomId;
            const room = await Room.findByPk(roomId, {
                include: [
                    {model: User, as: 'firstPlayer'},
                    {model: User, as: 'secondPlayer'}
                ]
            });

            if (!room) {
                throw new Error('Room not found');
            }

            if (room.firstPlayerId && room.secondPlayerId && room.firstPlayerId !== candidate.id && room.secondPlayerId !== candidate.id) {
                return res.status(403).json({
                    message: 'Room is full',
                });
            }

            if (!room.firstPlayerId) {
                room.firstPlayer = candidate;
                room.firstPlayerId = candidate.id;
                await room.save();
            } else if (!room.secondPlayerId && room.firstPlayerId !== candidate.id) {
                room.secondPlayer = candidate;
                room.secondPlayerId = candidate.id;
                await room.save();
                console.log("roomfirstId", room.firstPlayerId)
                emitToPlayers(req, [room.firstPlayerId], 'updateLobbyData', {});
            }

            return res.status(200).json({status: 'connected'});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: 'An error occurred while connecting to the room'});
        }
    }

    public leaveRoom = async (req: Request, res: Response): Promise<any> => {
        try {
            const roomId: string = req.body.roomId;
            const room = await Room.findByPk(roomId);

            if (!room) {
                return res.status(404).json({ message: "Room not found." });
            }
            if (room.createdAt.toString() !== room.startedAt.toString()) {
                return res.status(403).json({ message: "You cannot leave the room after the game has started." });
            }

            const token: string = req.cookies.jwt;
            const { id: userId } = jwt.verify(token, secret) as { id: string };

            if (room.firstPlayerId === userId) {
                room.firstPlayerId = null;
            }
            if (room.secondPlayerId === userId) {
                room.secondPlayerId = null;
            }

            await room.save();

            return res.status(200).json({ message: "You have successfully left the room." });
        } catch (error) {
            console.error(error);
        }
    };

    public createRoom = async (req: Request, res: Response) => {
        try {
            const gameName: string = req.params.gameName;
            const game: Game = await Game.findOne({where: {name: gameName}});

            if (!game) {
                return res.status(404).json({status: "Game not found"});
            }

            const room: Room = await Room.create({
                gameId: game.id,
                status: "active",
                createdAt: new Date(),
                startedAt: new Date(),
                finishedAt: null
            });
            return res.status(200).json({status: "room created", room: room});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "An error occurred while creating the room"});
        }
    };

    public createRoomWithBot = async (req: Request, res: Response): Promise<any> => {
        // try {
        //     const gameName: string = req.params.gameName;
        //     const game: IGame = await Game.findOne({name: gameName});
        //     const room: HydratedDocument<IRoom> = new Room({game: game});
        //     const token: string = req.cookies.jwt;
        //     const {id: userId} = jwt.verify(token, secret);
        //     const candidate: IUser = await User.findById(userId);
        //     const bot = await User.findById("6474ead11d7ba9f21dbe2315");
        //     room.firstPlayer = candidate;
        //     room.secondPlayer = bot;
        //     await room.save();
        //     return res.status(200).json({id: room._id});
        // } catch (error) {
        //     console.log(error);
        // }
    }

    public getRoomList = async (req: Request, res: Response): Promise<any> => {
        try {
            const gameName = req.params.gameName;
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const game = await Game.findOne({where: {name: gameName}});

            if (!game) {
                return res.status(404).json({message: "Game not found!"})
            }

            const {count: totalRooms, rows: rawRooms} = await Room.findAndCountAll({
                where: {gameId: game.id, status: "active"},
                offset,
                limit,
                order: [['id', 'DESC']],
            });

            const totalPages = Math.ceil(totalRooms / limit);
            const rooms: RoomWithPlayers[] = rawRooms as any;

            const transformedRooms = await Promise.all(rooms.map(async (room) => {
                const firstPlayer = await User.findByPk(room.firstPlayerId);
                const secondPlayer = await User.findByPk(room.secondPlayerId);
                return {
                    id: room.id,
                    firstPlayer: room.firstPlayerId ? firstPlayer.username : "no player",
                    secondPlayer: room.secondPlayerId ? secondPlayer.username : "no player"
                };
            }));

            res.json({transformedRooms, totalPages});

        } catch (error) {
            console.log(error);
        }
    }

    public getLobbyInfo = async (req: Request, res: Response): Promise<any> => {
        try {
            let currentRoom = await Room.findOne({
                where: { id: req.body.id },
            });
            const firstPlayer = await User.findByPk(currentRoom.firstPlayerId)
            const secondPlayer = await User.findByPk(currentRoom.secondPlayerId)
            const firstPlayerStats = await Statistic.findOne({where: {userId: currentRoom.firstPlayerId}})
            const secondPlayerStats = await Statistic.findOne({where: {userId: currentRoom.secondPlayerId}})
            const transformedRoom = {
                roomId: currentRoom?.id,
                firstPlayer: currentRoom?.firstPlayerId
                    ? {
                        username: firstPlayer.username,
                        firstName: firstPlayer.firstName,
                        lastName: firstPlayer.lastName,
                        statistics: firstPlayerStats,
                        avatar: firstPlayer.avatar,
                    }
                    : {},
                secondPlayer: currentRoom?.secondPlayerId
                    ? {
                        username: secondPlayer.username,
                        firstName: secondPlayer.firstName,
                        lastName: secondPlayer.lastName,
                        statistics: secondPlayerStats,
                        avatar: secondPlayer.avatar,
                    }
                    : {},
            };
            res.send(transformedRoom);
        } catch (error) {
            console.log(error);
        }
    };
}

export default new roomController();