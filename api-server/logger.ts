import * as sqlite3 from 'sqlite3';

export interface ILogCommand {
  rowid: number;
  command: string;
  data: any;
  date: Date;
}

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

  fetch(since: number): Promise<Array<ILogCommand>> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all('SELECT * FROM commands WHERE date > ?', since, (err, rows: Array<ILogCommand>) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map((row: ILogCommand) => {
              row.data = JSON.parse(row.data);
              return row;
            }));
          }
        });
      });
    });
  }
}