# Backend - Barber API

Este repositório contém o frontend e backend de uma aplicação para agendamento de barbearia.

## Estrutura

- `backend/` - API em Node.js com Knex e PostgreSQL
- `frontend/` - Interface web construída com React


## Dependencias do projeto

É necessario tanto na pasta frontend quanto backend a execução dos comandos

```sh
npm i
```

## Migracoes e Seeding

Com o banco rodando, instale o CLI do `knex` para executar as migracoes and seeding.

```sh
npm i knex cli -g
knex migrate:latest
knex seed:run
```

## Variaveis de Ambiente 

```sh
cat > ./.env <<EOL

# porta do servidor
PORT=3000

# secret para autorizacao de rotas privadas
AUTHORIZATION=grandeSegredo

# host do banco de dados 
DB_HOST=localhost

# nome do banco de dados
NOMEDB_NAME_BD=postgres

# usuario do banco de dados 
DB_USER=postgres

# senha do banco de dados
DB_PASS=postgres
EOL
```

## Iniciar servidor de desenvolvimento

```sh
npm run dev
```

## Interagir com a API por Postman

Essa aplicacao vem com uma colecao de requests do Postman do root do projeto que irao te ajudar a navegar esse servico.

Use a funcao `Import` do Postman para importar a colecao.

**Atencao:** os dados no corpo requests podem precisar de mudancas para funcionar
