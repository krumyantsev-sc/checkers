import {Request, Response} from "express";

export default interface IRoomController {
    connect(req: Request, res: Response): Promise<any>;
    createRoom(req: Request, res: Response): Promise<any>;
    getRoomList(req: Request, res: Response): Promise<any>;
    getRoomId(req: Request, res: Response): Promise<any>;
    getLobbyInfo(req: Request, res: Response): Promise<any>;
}
