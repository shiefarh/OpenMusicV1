//impor module
const ClientError = require("../../exceptions/ClientError");

//membuat handler untuk lagu dengan melakukan validasi pada input yang diberikan serta melakukan error handling
class SongsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    //handler untuk menambahkan lagu
    async postSongHandler(request, h) {
        try{
            this._validator.validateSongPayload(request.payload);
            const { title, year, genre, performer, duration, albumId } = request.payload;
            const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });
            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                  songId,
                },
        });
        response.code(201);
        return response;
      }catch (error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
        }
    }

    //handler untuk mendapatkan seluruh lagu
    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
          status: 'success',
          data: {
            songs:songs.map((song) => ({
              id:song.id,
              title:song.title,
              performer:song.performer,
            })),
            },
        };
    }

    //handler untuk mendapatkan lagu sesuai id
    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          response.code(500);
          console.error(error);
          return response;
        }
    }

    //handler untuk mengedit lagu sesuai id
    async putSongByIdHandler(request, h) {
        try {
          this._validator.validateSongPayload(request.payload);
          const { id } = request.params;
          await this._service.editSongById(id, request.payload);
          return {
              status: 'success',
              message: 'Lagu berhasil diperbarui',
            };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          response.code(500);
          console.error(error);
          return response;
        }
    }

    //handler untuk menghapus lagu sesuai id
    async deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteSongById(id);
          return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
          };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          response.code(500);
          console.error(error);
          return response;
        }
      }
}

//ekspor modul handler
module.exports = SongsHandler;