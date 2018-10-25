import * as sqlite3 from 'sqlite3';

export class Logger {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
  }

  log(command: string, data: any) {
    this.db.serialize(() => {
      const stmt = this.db.prepare('INSERT INTO commands (command, data, date) VALUES (?, ?, ?)');
      stmt.run(command, JSON.stringify(data), Date.now());
      stmt.finalize();
    });
  }
}