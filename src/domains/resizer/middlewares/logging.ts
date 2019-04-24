import {Request, Response, NextFunction} from 'express';

export function logging(request: Request, response: Response, next: NextFunction) {
    console.log("Logging middleware not implemented");
    next();
}