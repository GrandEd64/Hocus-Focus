export class Painel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.cor = data.cor || '#4630eb';
    this.ordem = data.ordem || 0;
    this.tipoEstudo = data.tipoEstudo || data.tipo_estudo || 1;
    this.ativo = data.ativo || 1;
    this.data_criacao = data.data_criacao || new Date().toISOString();
    this.data_atualizacao = data.data_atualizacao || new Date().toISOString();
  }

  // Validações
  isValid() {
    console.log('🔍 Validando painel:');
    console.log('  - Nome:', this.nome);
    console.log('  - Nome existe?', !!this.nome);
    console.log('  - Nome após trim:', this.nome ? this.nome.trim() : 'undefined');
    console.log('  - Comprimento após trim:', this.nome ? this.nome.trim().length : 0);
    
    const isValidResult = this.nome && this.nome.trim().length > 0;
    console.log('  - Resultado da validação:', isValidResult);
    
    return isValidResult;
  }

  // Converte para objeto simples para o banco
  toDatabase() {
    return {
      nome: this.nome,
      cor: this.cor,
      ordem: this.ordem,
      tipoEstudo: this.tipoEstudo,
      ativo: this.ativo,
      data_atualizacao: new Date().toISOString()
    };
  }
}


