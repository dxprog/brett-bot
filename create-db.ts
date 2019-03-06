import * as sqlite3 from 'sqlite3';

import config from './config';

const db = new sqlite3.Database(config.dbPath);

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS commands (command TEXT, data TEXT, date INT)');
  db.run('CREATE TABLE IF NOT EXISTS soundbites (title TEXT, shortcode TEXT DEFAULT NULL)');
});