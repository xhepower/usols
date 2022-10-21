const http = require('./http-common');
const FormData = require('form-data');
const fs = require('fs');
//const axios = require("axios").default;
class Service {
  async create(data) {
    return http.post('/pdfs', JSON.stringify(data));
  }

  async getAll() {
    return http.get('/pdfs');
  }
  async get(id) {
    return http.get(`/pdfs/${id}`);
  }

  async update(id, data) {
    return http.patch(`/pdfs/${id}`, data);
  }
  async delete(id) {
    return http.delete(`/pdfs/${id}`);
  }
  async deleteAll() {
    return http.delete(`/pdfs`);
  }
  async findByFile(file) {
    return http.get(`/pdfs?file=${file}`);
  }
  async findByDate(fecha) {
    return http.get(`/pdfs?fecha=${fecha}`);
  }
  async findByInterval(fecha1, fecha2) {
    return http.get(`/pdfs?fecha1=${fecha1}&fecha2=${fecha2}`);
  }
  async uploadPDF(pdf) {
    try {
      const file = await fs.createReadStream(pdf);
      const title = 'My file';

      const form = new FormData();
      form.append('title', title);
      form.append('file', file);

      const resp = await http.post(`/pdfs/subir`, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      if (resp.status === 200) {
        return 'Upload complete';
      }
    } catch (err) {
      return new Error(err.message);
    }
  }
}
module.exports = new Service();
