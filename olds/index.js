import { datos, esDigno, nombreDeArchivo } from './handlePdf.js';
import { upload } from './handleUpload.js';
import { partirArray } from './utils.js';
import * as fs from 'fs';
import rimraf from 'rimraf';
import * as dpath from 'path';
import {
  existe,
  guardarArchivo,
  archivosEnServer,
  subirArchivo,
  archivosBD,
} from './handleBD.js';
const path = './pdfs';

const purgar = async () => {
  let files = await Promise.all(
    fs
      .readdirSync(path)
      .filter((file) =>
        fs.statSync(`${path}/${file}`).isDirectory() ||
        dpath.extname(file).toLowerCase() !== '.pdf'
          ? false
          : true
      )
      .map(async (pdf) => ((await esDigno(`${path}/${pdf}`)) ? pdf : null))
  );
  let uniqueFiles = [];
  files = files.filter((file) => {
    return file == null ? false : true;
  });

  files = await Promise.all(
    files.map(async (pdf) => {
      let nombre = (await datos(`${path}/${pdf}`)).file;
      if (uniqueFiles.includes(nombre)) {
        return null;
      } else {
        uniqueFiles.push(nombre);
        return pdf;
      }
    })
  );
  files = files.filter((file) => {
    return file == null ? false : true;
  });
  console.log('Los arvhivos a trabajar son ', files.length);
  return partirArray(files, 2);
};
const trabajar = async () => {
  const archivosYaSubidos = await archivosEnServer();
  const archivosYaGuardados = (await archivosBD()).map((item) => item.file);

  const files = await purgar();
  let archivosSubidos = 0;
  let archivosGuardados = 0;
  await Promise.all(
    files.map(async (bloque) => {
      await Promise.all(
        bloque.map(async (pdf) => {
          let ruta = `${path}/${pdf}`;
          let dato = await datos(ruta);
          let nombre = dato.file;
          if (archivosYaGuardados.includes(nombre) == false) {
            await guardarArchivo(dato);
            archivosGuardados++;
          }
          if (archivosYaSubidos.includes(nombre) == false) {
            await upload(ruta);
            archivosSubidos++;
          }
        })
      );
    })
  );
  console.log('los archivos guardados son ', archivosGuardados);
  console.log('los archivos subidos son ', archivosSubidos);
};
(async () => {
  await trabajar();
})();
