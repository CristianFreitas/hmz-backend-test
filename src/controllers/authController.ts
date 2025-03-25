import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import authService from '../services/authService';

export class AuthController {
  // Validação dos campos de login
  validateLogin = [
    body('email')
      .isEmail()
      .withMessage('Por favor, forneça um email válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('A senha deve ter pelo menos 6 caracteres')
  ];

  // Controle de login - modificado para não retornar Promise<Response>
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Verifica se existem erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();