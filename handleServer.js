import Service from './service.js';
import * as fs from 'fs';
const servicio = new Service();
export async function subir(datos) {
  await servicio.post(datos);
}
