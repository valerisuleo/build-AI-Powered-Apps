import type { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Response {
            notFound(): void;
            badRequest(errors?: any): void;
            unauthorized(): void;
        }
    }
}

export function customResponses(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    res.notFound = function notFound() {
        const err: any = new Error(
            'The page you are looking for cannot be found',
        );
        err.status = 404;
        throw err;
    };

    res.badRequest = function badRequest(errors?: any) {
        const err: any = new Error('Bad Request');
        err.status = 400;
        err.errors = errors;
        throw err;
    };

    res.unauthorized = function unauthorized() {
        const err: any = new Error('Unauthorized');
        err.status = 401;
        throw err;
    };

    next();
}
