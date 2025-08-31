

export class AlarmeData {
  constructor(data = {}) {
    this.id = data.id || null;
    this.titulo = data.titulo || '';
    this.descricao = data.descricao || '';
    this.data_alarme = data.data_alarme || '';
    this.horario_alarme = data.horario_alarme || '';
    this.ativo = data.ativo || 1;
    this.repetir = data.repetir || 0;
    this.data_criacao = data.data_criacao || new Date().toISOString();
  }

  isValid() {
    return this.titulo && this.data_alarme && this.horario_alarme;
  }

  toDatabase() {
    return {
      titulo: this.titulo,
      descricao: this.descricao,
      data_alarme: this.data_alarme,
      horario_alarme: this.horario_alarme,
      ativo: this.ativo,
      repetir: this.repetir
    };
  }
}