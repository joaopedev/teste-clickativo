import { HTTP_ERRORS, UserModel } from '../../models/model';
import createError from 'http-errors';
import { Application, NextFunction, Request, Response } from 'express';
import { UserDB } from '../../database/users';

export = (app: Application) => {
  app.get(
    '/private/account',
    async (req: Request, res: Response, next: NextFunction) => {
      await UserDB.getUsers()
        .then(contas => {
          res.json({
            message: 'Contas recuperadas com sucesso',
            contas: contas,
          });
        })
        .catch(erro => {
          next(createError(HTTP_ERRORS.VALIDACAO_DE_DADOS, erro));
        });
    }
  );

  app.get(
    '/private/accountEmployers',
    async (req: Request, res: Response, next: NextFunction) => {
      await UserDB.getUsersEmployers()
        .then(contas => {
          res.json({
            message: 'Contas recuperadas com sucesso',
            contas: contas,
          });
        })
        .catch(erro => {
          next(createError(HTTP_ERRORS.VALIDACAO_DE_DADOS, erro));
        });
    }
  );

  app.get(
    '/private/accountbyid/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      let id_usuario = req.params.id;

      await UserDB.getUserById(id_usuario)
        .then(conta => {
          res.json({
            message: 'Conta recuperada com sucesso',
            contas: conta,
          });
        })
        .catch(erro => {
          next(createError(HTTP_ERRORS.VALIDACAO_DE_DADOS, erro));
        });
    }
  );

  app.put(
    '/private/updateaccount/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      let usuario: UserModel = await UserDB.getUserById(req.params.id);

      if (!usuario)
        return next(createError(HTTP_ERRORS.BAD_REQUEST, 'Id Invalido!'));

      await UserDB.updateUser(usuario)
        .then(result => {
          if (result) {
            res.json({ message: 'Dados atualizados com sucesso' });
          } else {
            res.status(404).json({ result });
          }
        })
        .catch(erro => {
          next(createError(HTTP_ERRORS.ERRO_INTERNO, erro));
        });
    }
  );
};
