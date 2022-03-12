const { nanoid } = require('nanoid');

class AlbumsService {
    constructor() {
      this._albums = [];
    }

    addAlbum ({name,year}){
        const id = `album-${nanoid(16)}`;
        const newAlbum = {
            id,name,year
        };
        this._albums.push(newAlbum);

        const isSuccess = this._albums.filter((n) => n.id === id).length > 0;
 
        if (!isSuccess) {
            throw new Error('Album gagal ditambahkan');
        }
        return id;
    }

    getAlbumById(id){
        const album = this._albums.filter((n) => n.id === id)[0];
        if (!album) {
            throw new Error('Album tidak ditemukan');
          }
          return album;
    }

    editAlbumById(id, { name, year }) {
        const index = this._albums.findIndex((n) => n.id === id);
     
        if (index === -1) {
          throw new Error('Gagal memperbarui Album. Id tidak ditemukan');
        }
        this._albums[index] = {
          ...this._albums[index],
          name,
          year,
        };
    }

    deleteAlbumById(id){
        const index = this._albums.findIndex((n) => n.id === id);
        if (index === -1) {
          throw new Error('Album gagal dihapus. Id tidak ditemukan');
        }
        this._albums.splice(index, 1);
    }
}


module.exports = AlbumsService;