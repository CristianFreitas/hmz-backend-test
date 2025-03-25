import express, { Request, Response, NextFunction } from 'express';
import authController from '../controllers/authController';

const router = express.Router();
 
router.post('/', authController.validateLogin, (req: Request, res: Response, next: NextFunction) => {
  return authController.login(req, res, next);
});

export default router;