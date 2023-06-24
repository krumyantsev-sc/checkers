import {Request, Response} from 'express';
import {IRole} from "../models/Role"
import {Op} from "sequelize";
import {User} from "../pgModels/User"
import {Role} from "../pgModels/Role";
import {UserRole} from "../pgModels/UserRole";
import {Statistic} from "../pgModels/Statistic";

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {validationResult} = require("express-validator")
const secret = require("../config/config")


const generateAccessToken = (id: string, roles: Array<IRole | string>): string => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, {expiresIn: "72h"});
};

class authController {
    public logout = (req: Request, res: Response) => {
        res.clearCookie('jwt');
        return res.status(200).json({message: "Successful logout"});
    }

    public check = async (req: Request, res: Response) => {
        try {
            const token: string = req.cookies.jwt;
            if (!token) {
                return res.status(200).json({isAuthenticated: false, isAdmin: false});
            }
            const payload = jwt.verify(token, secret);
            let isAdmin = false;
            if (payload.roles.includes("ADMIN")) {
                isAdmin = true;
            }
            return res.status(200).json({isAuthenticated: true, isAdmin: isAdmin});
        } catch (e) {
            return res.status(403).json({isAuthenticated: false});
        }
    }

    public registration = async (req: Request, res: Response): Promise<any> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors});
            }
            const {firstName, lastName, email, username, password} = req.body;
            const candidate = await User.findOne({
                where: {
                    [Op.or]: [
                        { username: username },
                        { email: email }
                    ]
                }
            });
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем или email уже существует"});
            }
            const hashPassword: string = bcrypt.hashSync(password, 7);
            //const userRole: IRole = await Role.findOne({value: "USER"});
            const user = await User.create(
                 {
                     firstName: firstName,
                    lastName: lastName,
                    email: email,
                    username: username,
                    password: hashPassword,
                });
            const defaultRole = await Role.findOne({where: {name: "USER"}});
            if(defaultRole) {
                await user.$add('roles', defaultRole);
            }
            await Statistic.create({ userId: user.id, wins: 0, loses: 0 });
            return res.json({message: "Пользователь успешно зарегистрирован"});
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: 'Registration error'});
        }
    }

    public login = async (req: Request, res: Response): Promise<any> => {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({where: {username: username}});
             if (!user) {
                 return res.status(400).json({message: "Пользователь не найден"});
             }
             const validPassword: boolean = bcrypt.compareSync(password, user.password);
             if (!validPassword) {
                 return res.status(400).json({message: "Неверный пароль"});
             }
            const roles = await user.$get('roles');
            if (roles.some(role => role.name === 'BANNED')) {
                return res.status(403).json({ message: "Аккаунт заблокирован" });
            }
            const rolesNames = roles.map(role => role.name);
             const token: string = generateAccessToken(user.id, rolesNames);
             res.cookie('jwt', token, {
                 httpOnly: true,
                 secure: false,
             });
            res.status(200).json({message: 'Успешная авторизация'});
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: "Login error"});
        }
    }

    public getUsers = async (req: Request, res: Response): Promise<any> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 15;
            const offset = (page - 1) * limit;

            const result = await User.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['id', 'DESC']],
                attributes: ['id','username', 'email'],
                include: [{
                    model: Role,
                    as: 'roles', // Название отношения, которое вы определили в модели User
                    attributes: ['name'],
                    through: { attributes: [] }
                }]
            });

            const users = result.rows;
            const totalUsers = result.count;
            const totalPages = Math.ceil(totalUsers / limit);

            res.json({users, totalPages});
        } catch (error) {
            console.error('Ошибка при получении пользователей с пагинацией:', error);
            res.status(500).json({error: 'Произошла ошибка сервера'});
        }
    }
    public getUserSearch = async (req: Request, res: Response) => {
        const searchTerm = req.query.searchTerm as string;

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.iLike]: `${searchTerm}%` } },
                    { email: { [Op.iLike]: `${searchTerm}%` } }
                ]
            },
            attributes: ['id','username', 'email'],
            include: [{
                model: Role,
                as: 'roles',
                attributes: ['name'],
                through: { attributes: [] },
            }]
        });

        res.send(users);
    }

    public makeAdmin = async (req: Request, res: Response) => {
        const userId: string = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({message: "Пользователь не найден"});
        }

        const adminRole = await Role.findOne({where: {name: 'ADMIN'}});

        if (!adminRole) {
            return res.status(404).json({message: "Роль ADMIN не найдена"});
        }

        const userRoles = await user.$get('roles') as Role[];

        if (userRoles.some(role => role.name === 'ADMIN')) {
            return res.status(409).json({message: "Пользователь уже обладает правами администратора"});
        }

        await user.$add('role', adminRole);

        return res.status(200).json({message: "Права успешно изменены"});
    }

    public ban = async (req: Request, res: Response) => {
        const userId: string = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({message: "Пользователь не найден"});
        }

        const bannedRole = await Role.findOne({where: {name: 'BANNED'}});

        if (!bannedRole) {
            return res.status(404).json({message: "Роль BANNED не найдена"});
        }

        const userRoles = await user.$get('roles') as Role[];

        if (userRoles.some(role => role.name === 'BANNED')) {
            return res.status(409).json({message: "Пользователь уже забанен"});
        }

        await user.$add('role', bannedRole);

        return res.status(200).json({message: "Права успешно изменены"});
    }

    public getUserName = async (req: Request, res: Response): Promise<any> => {
        // try {
        //     const token: string = req.cookies.jwt;
        //     const {id: userId}: { id: string } = jwt.verify(token, secret) as { id: string };
        //     const candidate: IUser = await User.findById(userId);
        //     res.json({username: candidate?.username});
        // } catch (e) {
        //     console.log(e);
        // }
    }
}

export default new authController();