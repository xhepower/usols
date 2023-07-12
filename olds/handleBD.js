import { esDigno, getContent, datos, nombreDeArchivo } from './handlePdf.js';
import { Service } from './service.js';

const service = new Service();
const existe = async (datos) => {
  const data = (await service.findByFile(datos.file)).data;
  if (data.length == 0) {
    return false;
  } else {
    return true;
  }
};
const archivosEnServer = async () => {
  const data = (await service.getArchivos()).data;
  return data;
};
const archivosBD = async () => {
  return (await service.getAll()).data;
};
const subirArchivo = async (arr) => {
  await service.uploadPDFFtp(arr);
};
const guardarArchivo = async (datos) => {
  //return datos;
  //datos.file = await nombreDeArchivo(datos);
  await service.create(datos);
};
export { existe, subirArchivo, guardarArchivo, archivosEnServer, archivosBD };
