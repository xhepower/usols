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
export async function obtenerDatos() {
  try {
    return await servicio.getAll();
  } catch (error) {
    return console.error(error);
  }
}
export async function obtenerArchivos(datos) {
  try {
    return await servicio.getArchivos();
  } catch (error) {
    return console.error(error);
  }
}
