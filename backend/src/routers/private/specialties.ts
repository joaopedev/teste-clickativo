import { Application, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import createError from "http-errors";
import { EspecialidadeModel, HTTP_ERRORS } from "../../models/model";
import { Especialidade } from "../../database/specialties";
import { handleError } from "../../utils/errors";

export = (app: Application) => {
  app.post(
    "/private/especialidades",
    body("nome").notEmpty().withMessage("O nome da especialidade é obrigatório"),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(HTTP_ERRORS.BAD_REQUEST, errors.array()[0].msg));
      }

      try {
        const novaEspecialidade: EspecialidadeModel = {
          nome: req.body.nome,
        };

        const criada = await Especialidade.createEspecialidade(novaEspecialidade);
        res.status(201).json({
          message: "Especialidade criada com sucesso.",
          especialidade: criada,
        });
      } catch (erro) {
        console.error(erro);
        next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(erro)));
      }
    }
  );

  app.get("/private/especialidades", async (_req, res, next) => {
    try {
      const especialidades = await Especialidade.getAllEspecialidades();
      res.json({ especialidades });
    } catch (err) {
      next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(err)));
    }
  });

  app.get("/private/especialidades/:id", async (req, res, next) => {
    try {
      const especialidade = await Especialidade.getEspecialidadeById(req.params.id);

      if (!especialidade) {
        return next(createError(HTTP_ERRORS.REGISTRO_NAO_ENCONTRADO, "Especialidade não encontrada"));
      }

      res.json({ especialidade });
    } catch (err) {
      next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(err)));
    }
  });

  app.delete("/private/especialidades/:id", async (req, res, next) => {
    try {
      const deletados = await Especialidade.deleteEspecialidade(req.params.id);

      if (deletados === 0) {
        return next(createError(HTTP_ERRORS.REGISTRO_NAO_ENCONTRADO, "Especialidade não encontrada"));
      }

      res.json({ message: "Especialidade excluída com sucesso." });
    } catch (err) {
      next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(err)));
    }
  });
};
