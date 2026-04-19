import { type Request, type Response, type NextFunction } from 'express';
import dayjs from 'dayjs';
import prisma from '../config/prisma';
import { getReviews } from './reviews';
import { Summary } from '../models/summary';

export async function getCachedSummary(productId: number) {
    return prisma.summary.findFirst({
        where: {
            productId,
            expiresAt: { gt: new Date() }, // only a non-expired  row is ever returned
        },
    });
}

async function storeReviewSummary(productId: number, summary: string) {
    const now = new Date();
    const expiresAt = dayjs().add(7, 'day').toDate();

    return prisma.summary.upsert({
        where: { productId },
        create: { productId, content: summary, expiresAt },
        update: { content: summary, generatedAt: now, expiresAt },
    });
}

async function showRoute(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
        if (isNaN(productId)) return res.badRequest('Invalid product ID');

        const cached = await getCachedSummary(productId);
        if (!cached) return res.notFound();

        res.json({ summary: cached.content });
    } catch (error) {
        next(error);
    }
}

async function createRoute(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
        if (isNaN(productId)) return res.badRequest('Invalid product ID');

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) return res.notFound();

        const cached = await getCachedSummary(productId);
        if (cached) return res.json({ summary: cached.content });

        const reviews = await getReviews(productId, 10);
        if (reviews.length === 0) return res.badRequest('No reviews to summarize');
        const joinedReviews = reviews.map((r) => r.content).join('\n\n');
        const summary = await Summary.create(joinedReviews);
        await storeReviewSummary(productId, summary);
        res.json({ summary });
    } catch (error) {
        next(error);
    }
}

export const summaryCtrl = {
    show: showRoute,
    create: createRoute,
};
