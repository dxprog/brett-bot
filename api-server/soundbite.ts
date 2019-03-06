import * as fs from 'fs';
import * as md5 from 'md5';
import * as mm from 'music-metadata';
import * as path from 'path';
import * as sqlite3 from 'sqlite3';

import { ISoundbite } from 'common/soundbite';

const SOUND_BITE_MAX_DURATION = 20;

async function writeFileAsync(fileName: string, fileData: Buffer) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, fileData, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export class Soundbite {
  private db: sqlite3.Database;
  private soundbitePath: string;

  constructor(dbPath: string, soundbitePath: string) {
    this.db = new sqlite3.Database(dbPath);
    this.soundbitePath = soundbitePath;
  }

  async createSoundbite(name: string, fileData: Buffer) {
    const id3Data = await mm.parseBuffer(fileData, 'audio/mpeg');
    console.log(id3Data);
    if (id3Data && id3Data.format.duration && id3Data.format.duration < SOUND_BITE_MAX_DURATION) {
      const fileName = path.resolve(this.soundbitePath, `${md5(name)}.mp3`);
      try {
        await writeFileAsync(fileName, fileData);
      } catch (err) {
        console.error('Error writing soundbite', err);
        return false;
      }

      this.db.serialize(() => {
        const stmt = this.db.prepare('INSERT INTO soundbites VALUES (?)');
        stmt.run(name);
        stmt.finalize();
      });

      return true;
    } else {
      console.error('Bad MP3', name);
      return false;
    }
  }

  async getSoundbites(): Promise<Array<ISoundbite>> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM soundbites', (err, rows: Array<ISoundbite>) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  async getSoundbite(fileName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const filePath = path.resolve(this.soundbitePath, fileName);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}