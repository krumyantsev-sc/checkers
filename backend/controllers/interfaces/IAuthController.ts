import {Request, Response} from "express";

export default interface IAuthController {
    registration(req: Request, res: Response): Promise<any>;
    login(req: Request, res: Response): Promise<any>;
    getUsers(req: Request, res: Response): Promise<any>;
    getUserName(req: Request, res: Response): Promise<any>;
}