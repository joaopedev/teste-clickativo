import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("scheduling").del();
  await knex("especialidades").del();
  await knex("users").del();
  const bcrypt = await import("bcrypt");
  const hashedPasswordBarbeiro = await bcrypt.hash("barbeiro123", 10);
  const hashedPasswordCliente = await bcrypt.hash("cliente123", 10);

  const [joaoBarbeiroId] = await knex("users")
    .insert({
      id: knex.raw("uuid_generate_v4()"),
      name: "João Barbeiro",
      email: "joao@barbearia.com",
      password: hashedPasswordBarbeiro,
      tipo_usuario: 3, 
      data_nascimento: "1990-01-01",
      ativo: true,
      idade: 35,
    })
    .returning("id");

  const [carlosBarbeiroId] = await knex("users")
    .insert({
      id: knex.raw("uuid_generate_v4()"),
      name: "Carlos Navalha",
      email: "carlos@barbearia.com",
      password: hashedPasswordBarbeiro,
      tipo_usuario: 3, 
      data_nascimento: "1985-06-15",
      ativo: true,
      idade: 40,
    })
    .returning("id");

  const [mariaClienteId] = await knex("users")
    .insert({
      id: knex.raw("uuid_generate_v4()"),
      name: "Maria Cliente",
      email: "maria@cliente.com",
      password: hashedPasswordCliente,
      tipo_usuario: 2, 
      data_nascimento: "1992-03-10",
      ativo: true,
      idade: 33,
    })
    .returning("id");

  const [pedroClienteId] = await knex("users")
    .insert({
      id: knex.raw("uuid_generate_v4()"),
      name: "Pedro Cliente",
      email: "pedro@cliente.com",
      password: hashedPasswordCliente,
      tipo_usuario: 2, 
      data_nascimento: "1988-07-22",
      ativo: true,
      idade: 37,
    })
    .returning("id");

  const [corteId] = await knex("especialidades")
    .insert({ id: knex.raw("uuid_generate_v4()"), nome: "Corte" })
    .returning("id");

  const [barbaId] = await knex("especialidades")
    .insert({ id: knex.raw("uuid_generate_v4()"), nome: "Barba" })
    .returning("id");

  await knex("scheduling").insert([
    {
      id: knex.raw("uuid_generate_v4()"),
      cliente_id: mariaClienteId,
      barbeiro_id: joaoBarbeiroId,
      especialidade_id: corteId,
      data_hora: new Date(Date.now() + 1000 * 60 * 60 * 24), 
      status: "pendente",
    },
    {
      id: knex.raw("uuid_generate_v4()"),
      cliente_id: pedroClienteId,
      barbeiro_id: carlosBarbeiroId,
      especialidade_id: barbaId,
      data_hora: new Date(Date.now() + 1000 * 60 * 60 * 48),
      status: "pendente",
    },
  ]);
}