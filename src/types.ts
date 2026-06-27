export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
};

export type UsuarioPublico = {
  id: string;
  nome: string;
  email: string;
};

export type Busca = {
  id: string;
  usuarioId: string;
  medicamento: string;
  latitude: number;
  longitude: number;
  distritoMaisProximo: number;
  quantidadeResultados: number;
  timestamp: string;
};

