import * as SQLite from 'expo-sqlite';
import { createTables, migrateDatabase } from './migrations.js';

class DatabaseManager {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.db) return this.db;

    try {
      this.db = SQLite.openDatabaseSync("dbSistema");
      
      // Executar migrações
      await this.runMigrations();
      
      this.isInitialized = true;
      console.log('✅ Database inicializado com sucesso');
      return this.db;
    } catch (error) {
      console.error('❌ Erro ao inicializar database:', error);
      throw error;
    }
  }

  async resetTables() {
    if (!this.db) return;
    
    try {
      this.db.execSync('DROP TABLE IF EXISTS Anotacao;');
      this.db.execSync('DROP TABLE IF EXISTS Painel;');
      this.db.execSync('DROP TABLE IF EXISTS Nota;');
      this.db.execSync('DROP TABLE IF EXISTS AlarmeDeData;');
      console.log('✅ Tabelas resetadas');
    } catch (error) {
      console.error('❌ Erro ao resetar tabelas:', error);
    }
  }

  async runMigrations() {
    if (!this.db) {
      throw new Error('Database não está aberto');
    }
    await createTables(this.db);
    await migrateDatabase(this.db);
  }

  getDatabase() {
    if (!this.db) {
      throw new Error('Database não inicializado. Chame initialize() primeiro.');
    }
    return this.db;
  }

  isReady() {
    return this.isInitialized;
  }
}

// Singleton
export const dbManager = new DatabaseManager();

export default dbManager;
