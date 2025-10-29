import { dbManager } from './index.js';
import { Painel, Anotacao, Nota, AlarmeData } from './models/index.js';

class BaseDAO {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async getDb() {
    return dbManager.getDatabase();
  }

  async findById(id) {
    const db = await this.getDb();
    return await db.getFirstAsync(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async findAll() {
    const db = await this.getDb();
    return await db.getAllAsync(`SELECT * FROM ${this.tableName} ORDER BY id DESC`);
  }

  async delete(id) {
    const db = await this.getDb();
    return await db.runAsync(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }
}

/**
 * DAO para Painéis
 */
export class PainelDAO extends BaseDAO {
  constructor() {
    super('painel');
  }

  async create(painel) {
    if (!(painel instanceof Painel) || !painel.isValid()) {
      throw new Error('Painel inválido');
    }

    const db = await this.getDb();
    const data = painel.toDatabase();
    
    const result = await db.runAsync(
      `INSERT INTO Painel (nome, cor, ordem, tipoEstudo, ativo, data_atualizacao) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.nome, data.cor, data.ordem, data.tipoEstudo, data.ativo, data.data_atualizacao]
    );

    return result.lastInsertRowId;
  }

  async update(id, painel) {
    if (!(painel instanceof Painel) || !painel.isValid()) {
      throw new Error('Painel inválido');
    }

    const db = await this.getDb();
    const data = painel.toDatabase();

    return await db.runAsync(
      `UPDATE Painel SET nome = ?, cor = ?, ordem = ?, tipoEstudo = ?, ativo = ?, data_atualizacao = ? 
       WHERE id = ?`,
      [data.nome, data.cor, data.ordem, data.tipoEstudo, data.ativo, data.data_atualizacao, id]
    );
  }

  async findAllActive() {
    const db = await this.getDb();
    return await db.getAllAsync(
      'SELECT * FROM Painel WHERE ativo = 1 ORDER BY ordem ASC, nome ASC'
    );
  }

  async updateOrdem(painelId, novaOrdem) {
    const db = await this.getDb();
    return await db.runAsync(
      'UPDATE Painel SET ordem = ?, data_atualizacao = ? WHERE id = ?',
      [novaOrdem, new Date().toISOString(), painelId]
    );
  }
}

/**
 * DAO para Anotações
 */
export class AnotacaoDAO extends BaseDAO {
  constructor() {
    super('Anotacao');  // Mudado para maiúsculo para corresponder à tabela
  }

  async create(anotacao) {
    if (!(anotacao instanceof Anotacao) || !anotacao.isValid()) {
      throw new Error('Anotação inválida');
    }

    const db = await this.getDb();
    const data = anotacao.toDatabase();

    const result = await db.runAsync(
      `INSERT INTO Anotacao (descricao, concluido, prioridade, data_envio, data_vencimento, painel_id, data_atualizacao, ordem)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.descricao, data.concluido, data.prioridade, data.data_envio, data.data_vencimento, data.painel_id, data.data_atualizacao, data.ordem]
    );

    return result.lastInsertRowId;
  }

  async update(id, anotacao) {
    if (!(anotacao instanceof Anotacao) || !anotacao.isValid()) throw new Error('Anotação inválida');

    const db = await this.getDb();
    const data = anotacao.toDatabase();

    return await db.runAsync(
      `UPDATE Anotacao SET descricao = ?, concluido = ?, prioridade = ?, nota = ?, data_envio = ?, 
       data_vencimento = ?, painel_id = ?, data_atualizacao = ?, ordem = ? WHERE id = ?`,
      [data.descricao, data.concluido, data.prioridade, data.nota, data.data_envio, data.data_vencimento, data.painel_id, data.data_atualizacao, data.ordem, id]
    );
  }

  async findByPainel(painelId) {
    const db = await this.getDb();
    return await db.getAllAsync(
      'SELECT * FROM Anotacao WHERE painel_id = ? ORDER BY ordem ASC, data_criacao ASC',
      [painelId]
    );
  }

  async findAllwithNoPanel() {
    const db = await this.getDb();

    return await db.getAllAsync(
      'SELECT * FROM Anotacao WHERE painel_id IS NULL ORDER BY ordem ASC, data_criacao ASC'
    );
  }

  async findPendentes(painelId = null) {
    const db = await this.getDb();
    const sql = painelId 
      ? 'SELECT * FROM Anotacao WHERE concluido = 0 AND painel_id = ? ORDER BY ordem DESC, data_criacao ASC'
      : 'SELECT * FROM Anotacao WHERE concluido = 0 ORDER BY ordem ASC, data_criacao ASC';
    
    return painelId 
      ? await db.getAllAsync(sql, [painelId])
      : await db.getAllAsync(sql);
  }

  async findConcluidas(painelId = null) {
    const db = await this.getDb();
    const sql = painelId
      ? 'SELECT * FROM Anotacao WHERE concluido = 1 AND painel_id = ? ORDER BY data_atualizacao DESC'
      : 'SELECT * FROM Anotacao WHERE concluido = 1 ORDER BY data_atualizacao DESC';
    
    return painelId
      ? await db.getAllAsync(sql, [painelId])
      : await db.getAllAsync(sql);
  }

  async marcarConcluida(id) {
    const db = await this.getDb();
    return await db.runAsync(
      'UPDATE Anotacao SET concluido = 1, data_atualizacao = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  async marcarPendente(id) {
    const db = await this.getDb();
    return await db.runAsync(
      'UPDATE Anotacao SET concluido = 0, data_atualizacao = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  // Join com painel para ter informações completas
  async findWithPainel() {
    const db = await this.getDb();
    return await db.getAllAsync(`
      SELECT a.*, p.nome as painel_nome, p.cor as painel_cor
      FROM Anotacao a
      INNER JOIN Painel p ON a.painel_id = p.id
      ORDER BY a.ordem DESC, a.data_criacao ASC
    `);
  }
}

/**
 * DAO para Notas
 */
export class NotaDAO extends BaseDAO {
  constructor() {
    super('Nota');
  }

  async create(nota) {
    if (!(nota instanceof Nota) || !nota.isValid()) {
      throw new Error('Nota inválida');
    }

    const db = await this.getDb();
    const data = nota.toDatabase();

    const result = await db.runAsync(
      'INSERT INTO Nota (nota, materia, descricao) VALUES (?, ?, ?)',
      [data.nota, data.materia, data.descricao]
    );

    return result.lastInsertRowId;
  }

  async findByMateria(materia) {
    const db = await this.getDb();
    return await db.getAllAsync(
      'SELECT * FROM Nota WHERE materia = ? ORDER BY data_criacao DESC',
      [materia]
    );
  }

  async getMediaPorMateria() {
    const db = await this.getDb();
    return await db.getAllAsync(`
      SELECT materia, AVG(nota) as media, COUNT(*) as total_notas
      FROM Nota 
      WHERE materia IS NOT NULL AND materia != ''
      GROUP BY materia
      ORDER BY media DESC
    `);
  }
}

/**
 * DAO para Alarmes
 */
export class AlarmeDataDAO extends BaseDAO {
  constructor() {
    super('alarme_data');
  }

  async create(alarme) {
    if (!(alarme instanceof AlarmeData) || !alarme.isValid()) {
      throw new Error('Alarme inválido');
    }

    const db = await this.getDb();
    const data = alarme.toDatabase();

    const result = await db.runAsync(
      `INSERT INTO alarme_data (titulo, descricao, data_alarme, horario_alarme, ativo, repetir)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.titulo, data.descricao, data.data_alarme, data.horario_alarme, data.ativo, data.repetir]
    );

    return result.lastInsertRowId;
  }

  async findAtivos() {
    const db = await this.getDb();
    return await db.getAllAsync(
      'SELECT * FROM alarme_data WHERE ativo = 1 ORDER BY data_alarme ASC, horario_alarme ASC'
    );
  }

  async findProximos(limite = 5) {
    const db = await this.getDb();
    const agora = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
    
    return await db.getAllAsync(
      `SELECT * FROM alarme_data 
       WHERE ativo = 1 AND data_alarme >= ? 
       ORDER BY data_alarme ASC, horario_alarme ASC 
       LIMIT ?`,
      [agora, limite]
    );
  }
}

