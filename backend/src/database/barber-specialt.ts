import { knex } from "../server";

export const BarbeiroEspecialidade = {
  async createVinculo(barbeiro_id: string, especialidade_id: string): Promise<void> {
    await knex("barbeiro_especialidade").insert({ barbeiro_id, especialidade_id });
  },

  async deleteVinculo(barbeiro_id: string, especialidade_id: string): Promise<void> {
    await knex("barbeiro_especialidade")
      .where({ barbeiro_id, especialidade_id })
      .del();
  },

  async getEspecialidadesByBarbeiro(barbeiro_id: string): Promise<{ id: string; nome: string }[]> {
    return knex("especialidades")
      .join("barbeiro_especialidade", "especialidades.id", "barbeiro_especialidade.especialidade_id")
      .where("barbeiro_especialidade.barbeiro_id", barbeiro_id)
      .select("especialidades.id", "especialidades.nome");
  },

  async getBarbeirosByEspecialidade(especialidade_id: string): Promise<{ id: string; nome: string }[]> {
    return knex("users")
      .join("barbeiro_especialidade", "users.id", "barbeiro_especialidade.barbeiro_id")
      .where("barbeiro_especialidade.especialidade_id", especialidade_id)
      .select("users.id", "users.nome");
  }
};
