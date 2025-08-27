import * as SQLite from 'expo-sqlite';

export function InicializarBancodeDados() {
    const db = SQLite.openDatabaseSync("dbSistema");

    db.execSync(`
        CREATE TABLE IF NOT EXISTS Painel
        (id INTEGER PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        cor TEXT,
        ordem INTEGER NOT NULL,
        tipoEstudo INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Anotacao 
        (id INTEGER PRIMARY KEY NOT NULL,
        descricao TEXT NOT NULL, 
        concluido INTEGER, 
        data_envio TEXT NOT NULL, 
        painel_id INTEGER,
        FOREIGN KEY(painel_id) REFERENCES painel(id)
        );

        CREATE TABLE IF NOT EXISTS Nota (
        id INTEGER PRIMARY KEY NOT NULL,
        nota REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS AlarmeDeData(
        id INTEGER PRIMARY KEY NOT NULL,
        data_alarme TEXT NOT NULL,
        horario_alarme TEXT NOT NULL
        );
        `);
}