// EXPORTANDO O MODEL DE USUARIO \\
export interface Atleta {
  id: number,
  cpf: string,
  nome: string,
  rg: string,
  data_nasc: Date,
  email: string,
  telefone: string,
  celular: string,
  endereco: string,
  cidade: string,
  estado: string,
  foto: string,
  nome_responsavel: string,
  cpf_responsavel: string,
  telefone_responsavel: string,
  celular_responsavel: string
}