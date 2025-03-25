import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import userService from '../services/userService';

export class UserController {
  validateListUsers = [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('per_page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Per page must be a positive integer')
  ];

  validateGetUser = [
    param('id')
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer')
  ];

  validateUser = [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('firstName')
      .optional()
      .isString()
      .withMessage('First name must be a string'),
    body('lastName')
      .optional()
      .isString()
      .withMessage('Last name must be a string'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('avatar')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL')
  ];

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.per_page as string) || 5;

      const result = await userService.getUsers(page, perPage);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = parseInt(req.params.id);
      const user = await userService.getUserById(id);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = parseInt(req.params.id);
      const userData = req.body;
      const updatedUser = await userService.updateUser(id, userData);
      res.status(200).json({ data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = parseInt(req.params.id);
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();