import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../config/prisma';

async function indexRoute(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await prisma.product.findMany();
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const productCtrl = {
    index: indexRoute,
};
