import { Application, NextFunction, Request, Response } from "express";
import {
  HTTP_ERRORS,
  SchedulingModel,
  TipoUsuario,
  UserModel,
} from "../../models/model";
import { UserDB } from "../../database/users";
import { body, validationResult } from "express-validator";
import createError from "http-errors";
import { Scheduling } from "../../database/scheduling";
import { handleError } from "../../utils/errors";

export = (app: Application) => {
  app.get(
    "/private/scheduling",
    async (req: Request, res: Response, next: NextFunction) => {
      await Scheduling.getSchedules()
        .then((agendamentos) => {
          res.json({
            message: "agendamentos recuperados com sucesso",
            agendamentos: agendamentos,
          });
        })
        .catch((erro) => {
          next(createError(HTTP_ERRORS.VALIDACAO_DE_DADOS, erro));
        });
    }
  );

  app.get(
    "/private/scheduling/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      await Scheduling.getScheduleById(req.params.id)
        .then((agendamento) => {
          res.json({
            message: "agendamento recuperado com sucesso",
            agendamentos: agendamento,
          });
        })
        .catch((erro) => {
          next(createError(HTTP_ERRORS.VALIDACAO_DE_DADOS, erro));
        });
    }
  );

  app.get(
    "/private/userScheduling/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      await Scheduling.getScheduleById(req.params.id)
        .then((agendamentos) => {
          res.json({
            message: "agendamentos recuperados com sucesso",
            agendamentos: agendamentos,
          });
        })
        .catch((erro) => {
          next(createError(HTTP_ERRORS.VALIDACAO_DE_DADOS, erro));
        });
    }
  );

  app.post(
    "/private/registerScheduling",
    body("cliente_id").notEmpty(),
    body("barbeiro_id").notEmpty(),
    body("data_hora").notEmpty(),

    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const message = errors.array().map((e) => e.msg);
        return next(createError(HTTP_ERRORS.BAD_REQUEST, message[0]));
      }

      try {
        const agendamento: SchedulingModel = {
          ...req.body,
          data_hora: new Date(req.body.data_hora),
        };

        const result = await Scheduling.createSchedule(agendamento);
        res.json({ message: "Agendamento realizado com sucesso!", result });
      } catch (erro) {
        console.error(erro);
        next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(erro)));
      }
    }
  );

  app.put(
    "/private/updateScheduling/:id",
    async (req: Request, res: Response, next: NextFunction) => {
    let agendamentoId = req.params.id;
    let usuarioParaAlteracao = req.query.usuario_id?.toString() ?? "";

      const agendamentoResult = await Scheduling.getScheduleById(agendamentoId);
      if (!agendamentoResult) {
        return next(
          createError(HTTP_ERRORS.BAD_REQUEST, "agendamentoId inválido")
        );
      }
      let agendamento: SchedulingModel = agendamentoResult;
      let usuario: UserModel = await UserDB.getUserById(usuarioParaAlteracao);

      if (!usuario || !agendamento.id) {
        const erro = usuario ? "o agendamentoId é" : "o usuario_id é";
        return next(createError(HTTP_ERRORS.BAD_REQUEST, `${erro} inválido`));
      }

      if (
        usuario.tipo_usuario === TipoUsuario.cliente &&
        agendamento.cliente_id !== usuario.id
      ) {
        return next(
          createError(
            HTTP_ERRORS.BAD_REQUEST,
            "Você não tem permissão para alterar esse agendamento!"
          )
        );
      }

      agendamento = { ...agendamento, ...req.body };

      await Scheduling.updateSchedule(agendamento)
        .then(() => {
          res.json({ message: "Agendamento atualizado com sucesso!" });
        })
        .catch((erro) => {
          console.error(erro);
          next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(erro)));
        });
    }
  );

  app.delete(
    "/private/deleteScheduling",
    async (req: Request, res: Response, next: NextFunction) => {
      const agendamentoId = req.query.id?.toString() ?? "";
      const barbeiroId = req.query.barbeiro_id?.toString() ?? "";

      try {
        const agendamento = await Scheduling.getScheduleById(agendamentoId);
        const funcionario = await UserDB.getUserById(barbeiroId);

        if (!agendamento || !funcionario) {
          const campo = funcionario ? "agendamentoId" : "funcionarioId";
          return next(
            createError(HTTP_ERRORS.BAD_REQUEST, `${campo} inválido.`)
          );
        }

        if (funcionario.tipo_usuario !== TipoUsuario.superadmin) {
          return next(
            createError(
              HTTP_ERRORS.BAD_REQUEST,
              "Você não tem permissão para excluir esse agendamento."
            )
          );
        }

        const deleted = await Scheduling.deleteSchedule(agendamento.id!);

        if (deleted !== null) {
          res.json({ message: "Agendamento excluído com sucesso." });
        } else {
          res.status(404).json({ message: "Agendamento não encontrado." });
        }
      } catch (erro) {
        next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(erro)));
      }
    }
  );

  app.get("/private/scheduling/today", async (req, res, next) => {
    try {
      const hoje = await Scheduling.getSchedulesOfToday();
      res.json({ message: "Agendamentos de hoje:", agendamentos: hoje });
    } catch (err) {
      next(createError(HTTP_ERRORS.ERRO_INTERNO, handleError(err)));
    }
  });

  app.patch(
    "/private/cancelScheduling",
    async (req: Request, res: Response, next: NextFunction) => {
      const agendamentoId = req.query.id?.toString() ?? "";
      const clienteId = req.query.cliente_id?.toString() ?? "";

      try {
        const result = await Scheduling.cancelSchedule(
          agendamentoId,
          clienteId
        );
        res.json({ message: "Agendamento cancelado com sucesso.", result });
      } catch (err) {
        next(createError(HTTP_ERRORS.BAD_REQUEST, handleError(err)));
      }
    }
  );
};
