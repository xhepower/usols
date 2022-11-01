import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  //baseURL: 'https://hidden-wave-53367.herokuapp.com/api/v1',
  timeout: 50000,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NTgxMzA0NH0.1OuFZmZDRpm84iIcOfjVFkJBiPUshhFneLJ8N1jR57w',
  },
});
