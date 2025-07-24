export enum HTTP_ERRORS {
  SUCESSO = 200, // Sucesso na criação do cadastro
  BAD_REQUEST = 400, // Dados inválidos
  ACESSO_NAO_AUTORIZADO = 401, // Não autorizado para criar cadastro
  ROTA_NAO_ENCONTRADA = 404, // Rota não encontrada
  CONFLICT = 409, // conflito interno
  ERRO_INTERNO = 500, // Erro interno do servidor
  ERRO_API_EXTERNA = 403, // Erro ao realizar uma solicitação externa
  DUPLICACAO_DE_DADOS = 409, // Cadastro duplicado
  LIMITE_DE_USO_EXCEDIDO = 429, // Limite de uso excedido
  VALIDACAO_DE_DADOS = 422, // Falha na validação de dados
  REGISTRO_NAO_ENCONTRADO = 404, // Registro não encontrado (caso específico)
  OUTRO_ERRO = 550, // Outro erro não mapeado
}

export enum ErrosBDModel {
  UNIQUE_VIOLATION = 23505,
}

export enum Status {
  cancelado = 0,
  realizado,
  pendente,
  ausente,
}

export interface SchedulingModel {
  id?: string;
  cliente_id: string;
  barbeiro_id: string;
  especialidade_id: string;
  data_hora: Date;
  status: Status;
  especialidade?: string; 
}

export interface EspecialidadeModel {
  id?: string;
  nome: string;
}

export interface UserModel {
  id?: string;
  name: string;
  email?: string;
  data_nascimento: string;
  password: string;
  tipo_usuario: TipoUsuario;
  ativo: boolean;
  data_contratacao?: Date;
  idade?: number;
}

export enum TipoUsuario {
  superadmin = 1,
  cliente,
  barbeiro,
}