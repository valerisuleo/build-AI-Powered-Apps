import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../config/prisma';
import { getReviews } from './reviews';

async function createRoute(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) return res.notFound();
        const reviews = await getReviews(productId, 10);
        const reviewsText = reviews.map((r) => r.content).join('\n\n');
        const prompt = `Summarize the following customer reviews into a short paragraph, highlighting key themes, both positive and negative.\n\n${reviewsText}`;
        res.json({ summary: 'This is a placeholder summary' });
    } catch (error) {
        next(error);
    }
}

export const summaryCtrl = {
    create: createRoute,
};
