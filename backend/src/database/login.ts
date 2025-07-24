import { knex } from "../server";
import { UserModel } from "../models/model";
import { comparePasswords } from "../utils/bcrypFunctions";

export class UserLogin {
  public static async loginUser(
    email: string,
    senha: string
  ): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      knex("users")
        .select("*")
        .where("email", email)
        .first()
        .then((usuarioBanco: UserModel | null) => {
          if (!usuarioBanco) {
            return reject(
              new Error("Nenhum usuário encontrado com este email!")
            );
          }

          if (!comparePasswords(senha, usuarioBanco.password)) {
            return reject(new Error("Senha incorreta!"));
          }

          return resolve(usuarioBanco);
        })
        .catch((erro: any) => {
          reject(erro);
        });
    });
  }
}
