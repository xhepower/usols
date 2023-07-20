import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
// export const instance = axios.create({
//   baseURL: process.env.BASE_URL,
//   //baseURL: 'http://hidden-wave-53367.herokuapp.com/api/v1',
//   timeout: 50000,
//   headers: {
//     Accept: 'application/json',
//     'Access-Control-Allow-Origin': '*',
//     'Content-Type': 'application/json; charset=utf-8',
//     Authorization:
//       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NTgxMzA0NH0.1OuFZmZDRpm84iIcOfjVFkJBiPUshhFneLJ8N1jR57w',
//   },
// });

export const instance = axios.create({
  baseURL: 'http://137.184.122.84:3000/api/v1',
  timeout: 300000,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NTgxMzA0NH0.1OuFZmZDRpm84iIcOfjVFkJBiPUshhFneLJ8N1jR57w',
  },
});

export default instance;
