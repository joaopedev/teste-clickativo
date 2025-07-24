import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("barbeiro_especialidade", (table) => {
    table.uuid("barbeiro_id").notNullable();
    table.uuid("especialidade_id").notNullable();
    table.primary(["barbeiro_id", "especialidade_id"]);
    table.foreign("barbeiro_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("especialidade_id").references("id").inTable("especialidades").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("barbeiro_especialidade");
}