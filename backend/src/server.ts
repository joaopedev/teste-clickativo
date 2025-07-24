import express, { json, Response, NextFunction, Request } from "express";
import createError from "http-errors";
import helmet from "helmet";
import cors from "cors";
import { HTTP_ERRORS } from "./models/model";
import Knex from "knex";

const consign = require("consign");
require("dotenv").config();

const AUTHORIZATION = process.env.AUTHORIZATION;

const app = express();

export const knex = Knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

app.use(helmet());
app.use(cors());
app.use(json());

app.use("/private/*", (req: Request, res: Response, next: NextFunction) => {
  let authorization = req.header("authorization");
  if (authorization == AUTHORIZATION) {
    next();
  } else {
    next(
      createError(
        HTTP_ERRORS.ACESSO_NAO_AUTORIZADO,
        "login incorreto ao acessar rota privada"
      )
    );
  }
});

consign({ cwd: __dirname }).include("routers").into(app);

app.use((error: any, res: Response) => {
  // Set HTTP Status Code
  res.status(error.status);
  // Send response
  res.json({ message: error.message });
});

const server = app.listen(Number(process.env.PORT), () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
