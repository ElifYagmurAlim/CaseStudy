import { Request, Response, NextFunction } from 'express';
import { Roles } from '../constants/roles';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === Roles.ADMIN) {
    next();
  } else {
    res.status(403).json({ message: 'Yalnızca yöneticiler erişebilir' });
  }
};
