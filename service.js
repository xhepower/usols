import { instance as http } from './http-common.js';

//const axios = require("axios").default;
export default class Service {
  async create(data) {
    //console.log(JSON.stringify(data));
    return http.post('/pdfs', JSON.stringify(data));
  }

  async getAll() {
    return http.get('/pdfs');
  }
  async post(data) {
    return http.post('/pdfs/', data);
  }
  async getArchivos() {
    return http.get('/pdfs/archivos');
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
  async upload(data) {
    return http.post(`/pdfs/subir`, data);
  }
  async pdfGuardados() {
    const datos = (await this.getAll()).data;
    let guardados = [];
    datos.map((dato) => {
      guardados.push(dato.pdf);
    });
    return guardados;
  }
}
const servicio = new Service();
