import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ZodError) {
        res.status(400).json({
            message: 'Validation Error',
            errors: err.format(),
        });
        return;
    }

    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    res.status(status).json({
        message,
        errors: err.errors,
    });
}
