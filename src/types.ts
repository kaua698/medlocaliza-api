export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
};

export type UsuarioPublico = Omit<Usuario, 'senhaHash'>;

export type Busca = {
  id: string;
  usuarioId: string;
  medicamento: string;
  // null quando o usuário não liberou a localização
  latitude: number | null;
  longitude: number | null;
  distritoMaisProximo: number | null;
  quantidadeResultados: number;
  timestamp: string;
};
