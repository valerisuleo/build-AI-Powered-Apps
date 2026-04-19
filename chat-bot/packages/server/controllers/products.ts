import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../config/prisma';
import { getReviews } from './reviews';
import { getCachedSummary } from './summaries';

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
        if (isNaN(productId)) return res.badRequest('Invalid product ID');

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.notFound();

        const reviews = await getReviews(productId);
        const cached = await getCachedSummary(productId);

        res.json({ ...product, reviews, summary: cached?.content ?? null });
    } catch (error) {
        next(error);
    }
}

export const productCtrl = {
    index: indexRoute,
    show: showRoute,
};
