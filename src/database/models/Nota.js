export class Nota {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nota = data.nota || 0;
    this.materia = data.materia || '';
    this.descricao = data.descricao || '';
    this.data_criacao = data.data_criacao || new Date().toISOString();
  }

  isValid() {
    return this.nota >= 0 && this.nota <= 10;
  }

  toDatabase() {
    return {
      nota: this.nota,
      materia: this.materia,
      descricao: this.descricao
    };
  }
}