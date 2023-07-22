import Service from './service.js';
import * as fs from 'fs';
const servicio = new Service();
export async function subir(datos) {
  try {
    await servicio.post(datos);
  } catch (error) {
    console.error(error);
  }
}
