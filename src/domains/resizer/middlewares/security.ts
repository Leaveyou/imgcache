import {Request, Response, NextFunction} from 'express';

export function security(request: Request, response: Response, next: NextFunction) {
    console.log("Security middleware not implemented");
    next();
}