import express, { Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.use(auth);

router.get('/', 
  userController.validateListUsers, 
  (req: Request, res: Response, next: NextFunction) => {
    return userController.getUsers(req, res, next);
  }
);

router.get('/:id', 
  userController.validateGetUser, 
  (req: Request, res: Response, next: NextFunction) => {
    return userController.getUserById(req, res, next);
  }
);

router.put('/:id', 
  userController.validateUser, 
  (req: Request, res: Response, next: NextFunction) => {
    return userController.updateUser(req, res, next);
  }
);

router.delete('/:id', 
  userController.validateGetUser, 
  (req: Request, res: Response, next: NextFunction) => {
    return userController.deleteUser(req, res, next);
  }
);

export default router;