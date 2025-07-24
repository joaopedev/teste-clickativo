import { isBefore, subHours } from "date-fns";

import { SchedulingModel, Status } from "../models/model";
import { knex } from "../server";

export class Scheduling {
  private static async isBarbeiroHorarioConflito(
    barbeiro_id: string,
    data_hora: Date
  ): Promise<boolean> {
    const conflito = await knex("scheduling")
      .where("barbeiro_id", barbeiro_id)
      .andWhere("status", Status.pendente)
      .andWhere("data_hora", data_hora)
      .first();

    return !!conflito;
  }

  private static async existsUser(id: string): Promise<boolean> {
    const user = await knex("users").where("id", id).first();
    return !!user;
  }

  private static async existsEspecialidade(id: string): Promise<boolean> {
    const esp = await knex("especialidades").where("id", id).first();
    return !!esp;
  }

  private static async barbeiroTemEspecialidade(
    barbeiro_id: string,
    especialidade_id: string
  ): Promise<boolean> {
    const result = await knex("barbeiro_especialidade")
      .where("barbeiro_id", barbeiro_id)
      .andWhere("especialidade_id", especialidade_id)
      .first();

    return !!result;
  }

  public static async getScheduleById(
    id: string
  ): Promise<SchedulingModel | null> {
    return await knex("scheduling").where("id", id).first();
  }

  public static getSchedules(): Promise<SchedulingModel[]> {
    return knex("scheduling").orderBy("data_hora");
  }

  public static async createSchedule(
    agendamento: SchedulingModel
  ): Promise<SchedulingModel> {
    if (
      !agendamento ||
      !agendamento.cliente_id ||
      !agendamento.barbeiro_id ||
      !agendamento.especialidade_id ||
      !agendamento.data_hora
    ) {
      throw new Error("Dados de agendamento incompletos!");
    }

    const hora = new Date(agendamento.data_hora).getHours();
    if (hora < 8 || hora >= 18) {
      throw new Error("Agendamentos só podem ser feitos entre 08:00 e 18:00.");
    }

    const atendeEspecialidade = await this.barbeiroTemEspecialidade(
      agendamento.barbeiro_id,
      agendamento.especialidade_id
    );
    if (!atendeEspecialidade) {
      throw new Error("Barbeiro não atende essa especialidade.");
    }

    const conflito = await this.isBarbeiroHorarioConflito(
      agendamento.barbeiro_id,
      agendamento.data_hora
    );
    if (conflito) {
      throw new Error("Esse barbeiro já possui um atendimento nesse horário.");
    }

    if (!(await this.existsUser(agendamento.cliente_id))) {
      throw new Error("Cliente não existe");
    }
    if (!(await this.existsUser(agendamento.barbeiro_id))) {
      throw new Error("Barbeiro não existe");
    }
    if (!(await this.existsEspecialidade(agendamento.especialidade_id))) {
      throw new Error("Especialidade não existe");
    }

    await knex("scheduling").insert(agendamento);

    return agendamento;
  }

  public static async cancelSchedule(
    id: string,
    cliente_id: string
  ): Promise<boolean> {
    const agendamento = await knex("scheduling")
      .where("id", id)
      .andWhere("cliente_id", cliente_id)
      .first();

    if (!agendamento) throw new Error("Agendamento não encontrado.");

    const dataAgendada = new Date(agendamento.data_hora);
    const limiteCancelamento = subHours(dataAgendada, 2);

    if (isBefore(new Date(), limiteCancelamento)) {
      await knex("scheduling")
        .where("id", id)
        .update({ status: Status.cancelado });

      return true;
    } else {
      throw new Error(
        "Cancelamento só é permitido com até 2 horas de antecedência."
      );
    }
  }

  public static async getSchedulesOfToday(): Promise<SchedulingModel[]> {
    const today = new Date().toISOString().substring(0, 10);

    return await knex("scheduling")
      .whereRaw("DATE(data_hora) = ?", [today])
      .orderBy("data_hora");
  }

  public static async updateSchedule(
    agendamento: SchedulingModel
  ): Promise<void> {
    if (!agendamento.id) {
      throw new Error("ID do agendamento é obrigatório para atualização.");
    }
    const existing = await knex("scheduling")
      .where("id", agendamento.id)
      .first();
    if (!existing) {
      throw new Error("Agendamento não encontrado.");
    }
    if (agendamento.data_hora) {
      const hora = new Date(agendamento.data_hora).getHours();
      if (hora < 8 || hora >= 18) {
        throw new Error(
          "Agendamentos só podem ser feitos entre 08:00 e 18:00."
        );
      }
      const conflito = await this.isBarbeiroHorarioConflito(
        existing.barbeiro_id,
        agendamento.data_hora
      );
      if (conflito) {
        throw new Error(
          "Esse barbeiro já possui um atendimento nesse horário."
        );
      }
    }
    await knex("scheduling").where("id", agendamento.id).update(agendamento);
  }

  public static async getSchedulesByCliente(
    cliente_id: string
  ): Promise<SchedulingModel[]> {
    return await knex("scheduling")
      .where("cliente_id", cliente_id)
      .orderBy("data_hora");
  }

  public static async deleteSchedule(id: string): Promise<void> {
    const result = await knex("scheduling").where("id", id).del();
    if (result === 0) {
      throw new Error("Agendamento não encontrado ou já excluído.");
    }
  }
}
