import { Chat } from '../models/chat';
import { type Request, type Response, type NextFunction } from 'express';

async function createRoute(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await Chat.create(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const chatCtrl = {
    create: createRoute,
};
