import { Application, Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import createError from "http-errors";
import { HTTP_ERRORS } from "../../models/model";
import { handleError } from "../../utils/errors";
import { BarbeiroEspecialidade } from "../../database/barber-specialt";

export = (app: Application) => {
  app.post(
    "/private/barbeiro-especialidade",
    body("barbeiro_id").notEmpty().withMessage("barbeiro_id é obrigatório"),
    body("especialidade_id").notEmpty().withMessage("especialidade_id é obrigatório"),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(HTTP_ERRORS.BAD_REQUEST, errors.array()[0].msg));
      }

      const { barbeiro_id, especialidade_id } = req.body;

      try {
        await BarbeiroEspecialidade.createVinculo(barbeiro_id, especialidade_id);
        res.status(201).json({ message: "Especialidade vinculada ao barbeiro com sucesso." });
      } catch (err) {
        next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(err)));
      }
    }
  );

  app.delete(
    "/private/barbeiro-especialidade",
    query("barbeiro_id").notEmpty().withMessage("barbeiro_id é obrigatório"),
    query("especialidade_id").notEmpty().withMessage("especialidade_id é obrigatório"),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(HTTP_ERRORS.BAD_REQUEST, errors.array()[0].msg));
      }

      const { barbeiro_id, especialidade_id } = req.query;

      try {
        await BarbeiroEspecialidade.deleteVinculo(
          String(barbeiro_id),
          String(especialidade_id)
        );
        res.json({ message: "Vínculo removido com sucesso." });
      } catch (err) {
        next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(err)));
      }
    }
  );  

  app.get("/private/barbeiro-especialidade/especialidades/:barbeiro_id", async (req, res, next) => {
    try {
      const { barbeiro_id } = req.params;
      const especialidades = await BarbeiroEspecialidade.getEspecialidadesByBarbeiro(barbeiro_id);
      res.json({ especialidades });
    } catch (err) {
      next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(err)));
    }
  });

  app.get("/private/barbeiro-especialidade/barbeiros/:especialidade_id", async (req, res, next) => {
    try {
      const { especialidade_id } = req.params;
      const barbeiros = await BarbeiroEspecialidade.getBarbeirosByEspecialidade(especialidade_id);
      res.json({ barbeiros });
    } catch (err) {
      next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(err)));
    }
  });
};
