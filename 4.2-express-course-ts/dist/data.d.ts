import type { Request, Response, NextFunction } from 'express';
declare const products: {
    id: number;
    name: string;
    image: string;
    price: number;
    desc: string;
}[];
declare const people: {
    id: number;
    name: string;
}[];
declare const logger: (req: Request, res: Response, next: NextFunction) => void;
declare const authorize: (req: Request, res: Response, next: NextFunction) => void;
export { products, people, logger, authorize };
//# sourceMappingURL=data.d.ts.map