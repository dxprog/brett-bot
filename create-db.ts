import * as sqlite3 from 'sqlite3';

import config from './config';

const db = new sqlite3.Database(config.dbPath);

db.serialize(() => {
  db.run('CREATE TABLE commands (command TEXT, data TEXT, date INT)');
  db.run('CREATE TABLE sound_bites (title TEXT)');
});