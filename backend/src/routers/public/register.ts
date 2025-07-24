import { body, validationResult } from 'express-validator';
import { HTTP_ERRORS, UserModel } from '../../models/model';
import createError from 'http-errors';
import { Application, NextFunction, Request, Response } from 'express';
import { encodePassword } from '../../utils/bcrypFunctions';
import { handleError } from '../../utils/errors';
import { UserDB } from '../../database/users';

export = (app: Application) => {
  app.post(
    '/registerUsers',
    body('email').notEmpty(),
    body('password')
      .exists()
      .isLength({ min: 8 })
      .withMessage('A senha deve conter pelo menos 8 caracteres'),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          createError(
            HTTP_ERRORS.VALIDACAO_DE_DADOS,
            JSON.stringify(errors.array())
          )
        );
      }
      const usuario: UserModel = { ...req.body };
      if (!usuario.email || !usuario.password) {
        const erro = usuario.email ? 'usuario.password' : 'usuario.email';
        return next(createError(HTTP_ERRORS.BAD_REQUEST, `${erro} inválido`));
      }

      const hashPassword = encodePassword(usuario.password);
      usuario.password = hashPassword;

      await UserDB.createUser(usuario)
        .then(() => {
          res.json({ message: 'Usuário cadastrado com sucesso' });
        })
        .catch(erro => {
          console.error(erro);
          next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(erro)));
        });
    }
  );
};
