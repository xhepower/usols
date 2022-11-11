import * as fs from 'fs';
import rimraf from 'rimraf';
import { Service } from './service.js';
import * as dpath from 'path';
import { esDigno, getContent, datos, nombreDeArchivo } from './nparser.js';
import { existe, subirArchivo, guardarArchivo } from './handleBD.js';
import { uploadFile } from './handleUploadDigitalOcean.js';
import { arch } from 'os';
import e from 'express';
const service = new Service();
const path = './pdfs';
const LONGITUD_PEDAZOS = 1;

const archivosPurgados = async () => {
  //variables para consola
  let totalArchivos = 0;
  let archivosProcesados = 0;
  let archivosBorradosFormato = 0;
  let archivosNoPdf = 0;
  let archivosRepetidos = 0;
  const archivos = fs.readdirSync(path);
  totalArchivos = archivos.length;
  let respuesta = archivos
    .filter((file) => {
      //ver que sea de tipo pdf
      if (
        fs.statSync(`${path}/${file}`).isDirectory() ||
        dpath.extname(file).toLowerCase() !== '.pdf'
      ) {
        rimraf.sync(`${path}/${file}`);
        archivosNoPdf++;
        return false;
      } else {
        return true;
      }
    })
    .filter((pdf) => {
      //ver que no empiece por la palabra usol que es ya procesado
      if (pdf.substring(0, 4) == 'usol') {
        archivosProcesados++;
        return false;
      } else {
        return true;
      }
    });
  let archivosUnicos = [];
  respuesta = await Promise.all(
    respuesta.map(async (pdf) => {
      if ((await esDigno(`${path}/${pdf}`)) == true) {
        let losdatos = await datos(`${path}/${pdf}`);
        if ((await existe(losdatos)) == false) {
          if (archivosUnicos.includes(losdatos.file)) {
            archivosRepetidos++;
            rimraf.sync(`${path}/${pdf}`);
          } else {
            archivosUnicos.push(losdatos.file);
            return pdf;
          }
        } else {
          archivosRepetidos++;
          rimraf.sync(`${path}/${pdf}`);
        }
      } else {
        archivosBorradosFormato++;
        rimraf.sync(`${path}/${pdf}`);
      }
    })
  );

  respuesta = respuesta.filter((pdf) => pdf !== undefined);
  console.log('La cantidad de archivos en la carpeta', totalArchivos);
  console.log('Archivos que no son pdf', archivosNoPdf);
  console.log('Archivos que no cumplen el fromato', archivosBorradosFormato);
  console.log(
    'Archivos que ya fueron subidos a la base de datos',
    archivosProcesados
  );
  console.log('Archivos repetidos borrados', archivosRepetidos);
  console.log(
    'Archivos a trabajar',
    totalArchivos -
      (archivosNoPdf +
        archivosProcesados +
        archivosRepetidos +
        archivosBorradosFormato)
  );
  return respuesta;
};
const partirArray = async (array) => {
  let arregloDeArreglos = [];
  for (let i = 0; i < array.length; i += LONGITUD_PEDAZOS) {
    let pedazo = array.slice(i, i + LONGITUD_PEDAZOS);
    arregloDeArreglos.push(pedazo);
  }
  return arregloDeArreglos;
};
(async () => {
  const archivos = await partirArray(await archivosPurgados());
  let archivosSubir = [];
  let archivosRenombrados = 0;
  let archivosGuardados = 0;
  let archivosSubidos = 0;
  let algp = [];
  await Promise.all(
    archivos.map(async (trozos) => {
      await Promise.all(
        trozos
          .map(async (pdf) => {
            let losdatos = await datos(`./pdfs/${pdf}`);
            fs.renameSync(`./pdfs/${pdf}`, `./pdfs/${losdatos.file}.pdf`);
            archivosRenombrados++;
            return `${losdatos.file}.pdf`;
          })
          .map(async (pdf) => {
            try {
              let losdatos = await datos(`./pdfs/${await pdf}`);

              await uploadFile(`${await pdf}`);
              await guardarArchivo(losdatos);
              //algp.push(losdatos);
            } catch (error) {
              console.error(error);
            }
          })
      );
    })
  );
  console.log(algp);
})();
