import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("scheduling", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("cliente_id").notNullable();
    table.uuid("barbeiro_id").notNullable();
    table.uuid("especialidade_id").notNullable();
    table.timestamp("data_hora").notNullable();
    table.enum("status", ["pendente", "realizado", "cancelado", "ausente"]).defaultTo("pendente");
    table.foreign("cliente_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("barbeiro_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("especialidade_id").references("id").inTable("especialidades").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("scheduling");
}
