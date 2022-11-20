import FormData from 'form-data';
import fetch from 'node-fetch';
import * as fs from 'fs';
import axios from 'axios';
const path = './pdfs/';
import { datos } from './handlePdf.js';
import * as dotenv from 'dotenv';
import { instance } from './http-common.js';
const pdf1 = 'ANGIE NAVARRETE.pdf';

export const upload = async (pdf) => {
  try {
    const title = 'My file';
    const filename = (await datos(pdf)).file;

    const form = new FormData();
    form.append('title', title);
    form.append('filename', filename);
    form.append('file', fs.createReadStream(pdf));
    const resp = await instance.post('/pdfs/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    if (resp.status === 200) {
      return 'Upload complete';
    }
  } catch (error) {
    console.error(error);
  }
};
let ruta = `${path}${pdf1}`;

(async () => {
  await upload(ruta);
})();
