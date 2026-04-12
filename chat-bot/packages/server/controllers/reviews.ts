import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../config/prisma';

export async function getReviews(productId: number, limit?: number) {
    return prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        ...(limit ? { take: limit } : {}),
    });
}

async function showRoute(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) return res.notFound();
        const result = await getReviews(productId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const reviewCtrl = {
    show: showRoute,
};
