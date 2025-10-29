/**
 * Tipos para as entidades do banco de dados
 */
export interface PainelEntity {
  id: number;
  nome: string;
  cor: string;
  ordem: number;
  tipoEstudo: number;
}

export interface AnotacaoEntity {
  id: number;
  descricao: string;
  concluido: number;
  prioridade?: number;
  data_envio: string;
  data_vencimento?: string;
  ordem?: number;
  nota?: number;
  painel_id?: number;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface NotaEntity {
  id: number;
  nota: number;
}

export interface AlarmeEntity {
  id: number;
  titulo?: string;
  descricao?: string;
  data_alarme: string;
  horario_alarme: string;
  ativo: number;
  repetir: number;
}
