import { EspecialidadeModel } from "../models/model";
import { knex } from "../server";

export const Especialidade = {
  async createEspecialidade(especialidade: EspecialidadeModel): Promise<EspecialidadeModel> {
    const [created] = await knex("especialidades").insert(especialidade).returning("*");
    return created;
  },

  async getAllEspecialidades(): Promise<EspecialidadeModel[]> {
    return await knex("especialidades").select("*");
  },

  async getEspecialidadeById(id: string): Promise<EspecialidadeModel | undefined> {
    return await knex("especialidades").where({ id }).first();
  },

  async deleteEspecialidade(id: string): Promise<number> {
    return await knex("especialidades").where({ id }).del();
  },
};
