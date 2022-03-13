//import module
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

//membuat modul service untuk album
class AlbumsService {
    constructor() {
    this._pool = new Pool();
    }

    //service untuk menambahkan album dari input query ke database
    async addAlbum ({name,year}){
        const id = `album-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
        throw new InvariantError('Lagu gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    //service untuk mendapatkan album secara spesifik dengan id yang diberikan
    async getAlbumById(id) {
        const query = {
          text: 'SELECT * FROM albums WHERE id = $1',
          values: [id],
        };
        const result = await this._pool.query(query);
     
        if (!result.rows.length) {
          throw new NotFoundError('Album tidak ditemukan');
        }
        return result.rows[0];
    }

    //service untuk mengedit album secara spesifik dengan id yang diberikan
    async editAlbumById(id, { name, year })  {
        const query = {
          text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
          values: [name, year, id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
          throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    //service untuk menghapus album secara spesifik dengan id yang diberikan
    async deleteAlbumById(id) {
        const query = {
          text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
          values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
          throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }
}

//mengekspor modul service
module.exports = AlbumsService;