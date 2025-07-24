import { TipoUsuario, UserModel } from './../models/model';
import { validate as isUUID } from 'uuid';
import { knex } from '../server';

export class UserDB {
  public static async getUsers(): Promise<UserModel[]> {

    let users = await knex('users').select('*').orderBy('id');
    if (!users || users.length <= 0)
      throw new Error('Náo há nenhum usuário cadastrado!');

    return users;
  }

  public static async getUsersEmployers(): Promise<UserModel[]> {

    let users = await knex('users').select('*').where('tipo_usuario', TipoUsuario.barbeiro).orderBy('id');
    if (!users || users.length <= 0)
      throw new Error('Náo há nenhum barbeiro cadastrado!');

    return users;
  }

  public static async getUserById(id: string): Promise<UserModel> {
    if (!isUUID(id)) throw new Error('ID de usuário inválido!');
    const query = knex('users');
    const user: UserModel = await query
      .select('*')
      .where('id', id)
      .first();
    if (!user) throw new Error('Náo há nenhum usuário com este Id!');

    return user;
  }

  public static async getUserByEmail(email: string): Promise<UserModel> {
    const user = await knex('users')
      .select('*')
      .where('email', email)
      .first();
    if (!user) throw new Error('Náo há nenhum usuário com este email!');

    return user;
  }

  public static async createUser(usuario: UserModel): Promise<UserModel> {
    if (usuario.password.length < 8) {
      throw new Error('A senha deve ter pelo menos 8 caracteres');
    }
    const trx = await knex.transaction();
    try {
      const existingUser = await trx('users')
        .where({ email: usuario.email })
        .first();

      if (existingUser) {
        throw new Error('Este email já possui cadastro!');
      }
      await trx('users').insert(usuario);
      await trx.commit();
      return usuario;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  public static async updateUser(usuario: UserModel): Promise<UserModel> {
    const idUsuario = usuario.id ?? '';
    const trx = await knex.transaction();
    let userBanco: UserModel = await this.getUserById(idUsuario);  
    if (!userBanco) throw new Error('O usuário informado não existe!');

    let existeEmail: UserModel;
    if(usuario.email) {
      existeEmail = await this.getUserByEmail(usuario.email);
      if(existeEmail && existeEmail.email != userBanco.email) throw new Error('email ja existente no sistema!');
    }

    try {    
      userBanco = { ...userBanco, ...usuario };
      await trx('users').where('id', userBanco.id).first().update(userBanco);
      trx.commit();
      return userBanco;
    } catch (error) {
      trx.rollback();
      throw error;
    }
  }

  public static async deleteUser(id: string): Promise<boolean> {
    if (!isUUID(id)) throw new Error('ID de usuário inválido!');
    const userBanco: UserModel = await this.getUserById(id);
    if (!userBanco) return false;
    const trx = await knex.transaction();

    try {
      const user = await trx('users')
        .select('users')
        .where('email', userBanco.email)
        .first()
        .delete();

      trx.commit();
      return !!user;
    } catch (error) {
      trx.rollback();
      throw error;
    }
  }
}
