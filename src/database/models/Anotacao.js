export class Anotacao {
  constructor(data = {}) {
    this.id = data.id || null;
    this.descricao = data.descricao || '';
    this.concluido = data.concluido || 0;
    this.prioridade = data.prioridade || 1;
    this.data_envio = data.data_envio || new Date().toISOString();
    this.data_vencimento = data.data_vencimento || null;
    this.painel_id = data.painel_id || null;
    this.data_criacao = data.data_criacao || new Date().toISOString();
    this.data_atualizacao = data.data_atualizacao || new Date().toISOString();
  }

  isValid() {
    return this.descricao && this.descricao.trim().length > 0 && this.painel_id;
  }

  toDatabase() {
    return {
      descricao: this.descricao,
      concluido: this.concluido,
      prioridade: this.prioridade,
      data_envio: this.data_envio,
      data_vencimento: this.data_vencimento,
      painel_id: this.painel_id,
      data_atualizacao: new Date().toISOString()
    };
  }

  // Helper methods
  isConcluida() {
    return this.concluido === 1;
  }

  marcarConcluida() {
    this.concluido = 1;
    this.data_atualizacao = new Date().toISOString();
  }

  marcarPendente() {
    this.concluido = 0;
    this.data_atualizacao = new Date().toISOString();
  }
}
