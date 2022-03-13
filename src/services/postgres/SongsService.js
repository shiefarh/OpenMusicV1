//impor module
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

//membuat modul service untuk lagu
class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  //service untuk menambahkan lagu dari input query ke database
  async addSong ({title,year,genre,performer,duration}){
    const id = `song-${nanoid(16)}`;
    const albumId = `album-${nanoid(16)}`;
    const query = {
        text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
        throw new InvariantError('Lagu gagal ditambahkan');
    }
    return result.rows[0].id;
    }

    //service untuk mendapatkan seluruh daftar lagu
    async getSongs() {
        const result = await this._pool.query('SELECT * FROM songs');
        return result.rows;
    }

    //service untuk mendapatkan lagu secara spesifik dengan id yang diberikan
    async getSongById(id) {
        const query = {
          text: 'SELECT * FROM songs WHERE id = $1',
          values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
          throw new NotFoundError('Lagu tidak ditemukan');
        }
        return result.rows[0];
    }

    //service untuk mengedit lagu secara spesifik dari id yang diberikan
    async editSongById(id, { title, year, genre, performer, duration, albumId })  {
        const query = {
          text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id',
          values: [title, year, genre, performer, duration, id],
        }; 
        const result = await this._pool.query(query);
        if (!result.rows.length) {
          throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
    }

    //service untuk menghapus lagu secara spesifik dari id yang diberikan
    async deleteSongById(id) {
        const query = {
          text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
          values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
          throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

//ekspor modul service
module.exports = SongsService;