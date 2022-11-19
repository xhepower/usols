import FormData from 'form-data';
import fetch from 'node-fetch';
import * as fs from 'fs';
import axios from 'axios';
const path = './pdfs/';
import { datos } from './handlePdf.js';
import * as dotenv from 'dotenv';

dotenv.config();
const pdf1 = 'ANGIE NAVARRETE.pdf';
const instance = axios.create({
  baseURL: process.env.BASE_URL,
  //baseURL: 'http://hidden-wave-53367.herokuapp.com/api/v1',
  timeout: 50000,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NTgxMzA0NH0.1OuFZmZDRpm84iIcOfjVFkJBiPUshhFneLJ8N1jR57w',
  },
});
const upload = async (pdf) => {
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
(async () => {
  await upload(`${path}/${pdf1}`);
})();
