/*const fs = require('fs');
var rimraf = require('rimraf');
const service = require('./service');
const dpath = require('path');
const { esDigno, getContent, datos, nombreDeArchivo } = require('./nparser');*/
import * as fs from 'fs';
import rimraf from 'rimraf';
import { Service } from './service.js';
import * as dpath from 'path';
import { esDigno, getContent, datos, nombreDeArchivo } from './nparser.js';
const service = new Service();
const path = './pdfs';
const nombreSinRuta = (nombre) => {
  let pos = 0;
  const longitud = nombre.length;
  let i = 0;
  for (i = longitud; i >= 0; i--) {
    if (nombre.substring(i) == '/') {
      pos = i;
    }
  }
  return nombre.substring(i, nombre.length);
};

const purgar = () => {
  let ArchivosBorrados = 0;
  let totalArchivos = fs.readdirSync(path).length;
  fs.readdirSync(path).map((file) => {
    if (
      fs.statSync(`${path}/${file}`).isDirectory() ||
      dpath.extname(file).toLowerCase() !== '.pdf'
    ) {
      rimraf.sync(`${path}/${file}`);
      ArchivosBorrados++;
    }
  });
  console.log(`Total de archivos en la carpeta: ${totalArchivos}`);
  console.log(
    `Carpetas y archivos que no son pdf borrados: ${ArchivosBorrados}`
  );
};

const listapdfs = (async () => {
  purgar();
  let archivoFromato = 0;
  let archivosProcesados = 0;
  const aja = await Promise.all(
    fs
      .readdirSync(path)
      .filter((pdf) => {
        //console.log(nombreSinRuta(pdf));
        if (pdf.substring(0, 4) == 'usol') {
          archivosProcesados++;
          return false;
        } else {
          return true;
        }
      })
      .map((pdf) => `${path}/${pdf}`)
      .map(async (pdf) => {
        if ((await esDigno(pdf)) == false) {
          archivoFromato++;
          borrarArchivo(pdf);
        } else {
          return pdf;
        }
      })
  );
  console.log(
    `Archivos PDF que no cumplen el formato borrados: ${archivoFromato}`
  );
  console.log(`Archivos que ya fueron procesados: ${archivosProcesados}`);
  console.log(`Archivos PDF a trabajar: ${aja.length - archivoFromato}`);
  return aja.filter((pdf) => pdf !== undefined);
})();

const borrarArchivo = async (path) => {
  fs.unlinkSync(path);
};

const renombrar = async (archivo) => {
  const adatos = await datos(archivo);
  const anombre = await nombreDeArchivo(adatos);
  const nuevoNombre = `${path}/${anombre}.pdf`;
  fs.renameSync(archivo, nuevoNombre);
  return nuevoNombre;
};

const partirArray = async (array) => {
  let arregloDeArreglos = []; // Aquí almacenamos los nuevos arreglos
  const LONGITUD_PEDAZOS = 20; // Partir en arreglo de 3
  for (let i = 0; i < array.length; i += LONGITUD_PEDAZOS) {
    let pedazo = array.slice(i, i + LONGITUD_PEDAZOS);
    arregloDeArreglos.push(pedazo);
  }
  return arregloDeArreglos;
};
const guardarArchivo = async (datos) => {
  //return datos;
  //datos.file = await nombreDeArchivo(datos);
  await service.create(datos);
};
const subirArchivo = async (pdf, nombrepdf) => {
  service.uploadPDFFtp(pdf, nombrepdf);
};
const existe = async (datos) => {
  const data = (await service.findByFile(datos.file)).data;
  if (data.length == 0) {
    return false;
  } else {
    return true;
  }
};
const Procesar = async () => {
  let array = [];
  let archivosRepetidos = 0;
  let archivosGuardados = 0;
  const lali = await Promise.all(
    (
      await listapdfs
    ).map(async (pdf) => {
      try {
        let dato = await nombreDeArchivo(await datos(pdf));
        if (!array.includes(dato)) {
          array.push(dato);
          return pdf;
        } else {
          borrarArchivo(pdf);
          archivosRepetidos++;
        }
      } catch (error) {
        console.log('pdf:', pdf);
        console.error(error);
      }
    })
  );
  //console.log(array);
  const lista = await partirArray(lali);
  const aja = async () => {
    return await Promise.all(
      lista.map(
        async (item) =>
          await Promise.all(
            item.map(async (pdf) => {
              try {
                if ((await existe(await datos(pdf))) == false) {
                  await guardarArchivo(await datos(pdf));
                  let nuevoNombre = await renombrar(pdf);
                  //console.log(nuevoNombre);
                  await subirArchivo(nuevoNombre, nombreSinRuta(nuevoNombre));
                  archivosGuardados++;
                } else {
                  borrarArchivo(pdf);
                  archivosRepetidos++;
                }
              } catch (error) {
                console.log('pdf:', pdf);
                console.error(error);
              }
            })
          )
      )
    );
  };
  await aja();
  console.log('Los archivos repetidos borrados: ' + archivosRepetidos);
  console.log('Los archivos guardados: ' + archivosGuardados);
};
(async () => {
  await Procesar();
  // console.log(await datosAGuardar());
  //fs.writeFileSync('puto.json', JSON.stringify(await Procesar()));
})();
