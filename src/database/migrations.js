import * as SQLite from 'expo-sqlite';

export function createTables(db) {
    try {
        // Criar tabela Painel
        db.execSync(`
            CREATE TABLE IF NOT EXISTS Painel (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cor TEXT,
                ordem INTEGER NOT NULL,
                tipoEstudo INTEGER NOT NULL,
                ativo INTEGER DEFAULT 1,
                data_atualizacao TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Criar tabela Anotacao
        db.execSync(`
            CREATE TABLE IF NOT EXISTS Anotacao (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                descricao TEXT NOT NULL, 
                concluido INTEGER DEFAULT 0,
                prioridade INTEGER DEFAULT 1,
                data_envio TEXT NOT NULL,
                data_vencimento TEXT,
                ordem INTEGER NOT NULL,
                painel_id INTEGER,
                data_criacao TEXT DEFAULT CURRENT_TIMESTAMP,
                data_atualizacao TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(painel_id) REFERENCES Painel(id)
            );
        `);

        // Criar tabela Nota
        db.execSync(`
            CREATE TABLE IF NOT EXISTS Nota (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nota REAL NOT NULL,
                materia TEXT,
                descricao TEXT,
                data_criacao TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Criar tabela AlarmeDeData
        db.execSync(`
            CREATE TABLE IF NOT EXISTS AlarmeDeData (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT,
                descricao TEXT,
                data_alarme TEXT NOT NULL,
                horario_alarme TEXT NOT NULL,
                ativo INTEGER DEFAULT 1,
                repetir INTEGER DEFAULT 0
            );
        `);

        console.log('✅ Tabelas criadas com sucesso');
    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error);
        throw error;
    }
}

export function migrateDatabase(db) {
    try {
        // Verificar se as colunas necessárias existem na tabela Anotacao
        const tableInfo = db.getAllSync("PRAGMA table_info(Anotacao)");
        const columnNames = tableInfo.map(col => col.name);
        
        console.log('Colunas existentes na tabela Anotacao:', columnNames);
        
        // Adicionar colunas que estão faltando
        if (!columnNames.includes('prioridade')) {
            db.execSync(`ALTER TABLE Anotacao ADD COLUMN prioridade INTEGER DEFAULT 1`);
            console.log('✅ Coluna prioridade adicionada');
        }
        if (!columnNames.includes('ordem')) {
            db.execSync(`ALTER TABLE Anotacao ADD COLUMN ordem INTEGER DEFAULT 0`);
            console.log('✅ Coluna ordem adicionada à tabela Anotacao');
        }
        
        if (!columnNames.includes('data_vencimento')) {
            db.execSync(`ALTER TABLE Anotacao ADD COLUMN data_vencimento TEXT`);
            console.log('✅ Coluna data_vencimento adicionada');
        }
        
        if (!columnNames.includes('data_criacao')) {
            db.execSync(`ALTER TABLE Anotacao ADD COLUMN data_criacao TEXT DEFAULT CURRENT_TIMESTAMP`);
            console.log('✅ Coluna data_criacao adicionada');
        }
        
        if (!columnNames.includes('data_atualizacao')) {
            db.execSync(`ALTER TABLE Anotacao ADD COLUMN data_atualizacao TEXT DEFAULT CURRENT_TIMESTAMP`);
            console.log('✅ Coluna data_atualizacao adicionada');
        }
        
        // Verificar e migrar tabela Nota
        console.log('🔍 Verificando tabela Nota...');
        const notaTableInfo = db.getAllSync("PRAGMA table_info(Nota)");
        const notaColumnNames = notaTableInfo.map(col => col.name);
        
        console.log('Colunas existentes na tabela Nota:', notaColumnNames);
        
        if (!notaColumnNames.includes('materia')) {
            db.execSync(`ALTER TABLE Nota ADD COLUMN materia TEXT`);
            console.log('✅ Coluna materia adicionada à tabela Nota');
        }
        
        if (!notaColumnNames.includes('descricao')) {
            db.execSync(`ALTER TABLE Nota ADD COLUMN descricao TEXT`);
            console.log('✅ Coluna descricao adicionada à tabela Nota');
        }
        
        if (!notaColumnNames.includes('data_criacao')) {
            db.execSync(`ALTER TABLE Nota ADD COLUMN data_criacao TEXT DEFAULT CURRENT_TIMESTAMP`);
            console.log('✅ Coluna data_criacao adicionada à tabela Nota');
        }
        
        console.log('✅ Migração de colunas concluída');
        // Verificar se a tabela Painel tem a coluna 'ordem' (pode faltar em bases antigas)
        try {
            const painelInfo = db.getAllSync("PRAGMA table_info(Painel)");
            const painelCols = painelInfo.map(c => c.name);
            if (!painelCols.includes('ordem')) {
                db.execSync(`ALTER TABLE Painel ADD COLUMN ordem INTEGER DEFAULT 0`);
                console.log('✅ Coluna ordem adicionada à tabela Painel');
            }
        } catch (err) {
            // se a tabela Painel não existir ainda, nada a fazer
            console.log('⚠️ Verificação da coluna ordem em Painel falhou (tabela ausente?):', err.message);
        }
    } catch (error) {
        console.error('❌ Erro na migração:', error);
        throw error;
    }
}