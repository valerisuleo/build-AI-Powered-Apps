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

async function showRoute(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) return res.notFound();
        const result = await prisma.review.findMany({
            where: {
                productId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const productCtrl = {
    index: indexRoute,
    show: showRoute,
};
