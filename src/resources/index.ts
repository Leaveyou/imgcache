import { Request, Response, NextFunction } from 'express';

export default function staticResources(request :Request, response :Response) {
    response.send(request.params);
}
