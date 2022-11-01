/*const http = require('./http-common');
const FormData = require('form-data');
const fs = require('fs');*/
import {} from 'dotenv/config';
import { instance as http } from './http-common.js';
import FormData from 'form-data';
import fs from 'fs';
import { FTPClient as Ftp } from './FTP.js';

//const axios = require("axios").default;
export class Service {
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
  async uploadPDFFtp(pdf, nombrepdf) {
    const ftpClient = new Ftp(
      process.env.FTP_HOSTNAME,
      21,
      process.env.FTP_USERNAME,
      process.env.FTP_PASSWORD,
      false
    );
    //ftpClient.ftp.verbose = true;
    try {
      await ftpClient.upload(pdf, `public_html/${nombrepdf}`, 755);
    } catch (error) {}
    await ftpClient.close();
  }
}
