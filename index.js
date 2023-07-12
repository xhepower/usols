import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
import FormData from 'form-data';
import { exportImages } from 'pdf-export-images';
import {
  getContent,
  esDigno,
  datosPDF,
  nombrePDF,
  pdfSinExtension,
  extraerImagenes,
} from './handlePDF.js';
import { isPDF, moverPDF, Imagenes } from './handleFiles.js';
import { partirArray } from './utils.js';
import { subir } from './handleServer.js';
const path = './usol-pdfs';
// aqui vamso a eliminar los archisvos que no sean pdf y los directorios
// Eliminar todos los pdf que no sean dignos
(async () => {
  let archivos = await Promise.all(
    fs
      .readdirSync(path)
      .filter((archivo) => {
        return isPDF(`${path}/${archivo}`);
      })
      .map(async (pdf) => {
        const contenido = await getContent(`${path}/${pdf}`);
        return [pdf, esDigno(contenido), contenido];
      })
  );
  // let escribir = [];
  archivos = archivos
    .filter((pdf) => pdf[1])
    .map((pdf) => {
      const contenido = pdf[2];
      const archivo = pdf[0];

      const datos = datosPDF(contenido);
      datos.archivo = archivo;
      datos.pdf = `${nombrePDF(datos)}.pdf`;
      moverPDF(`${path}/${datos.archivo}`, datos.pdf);
      return datos;
    });
  archivos = await Promise.all(
    archivos.map(async (datos) => {
      await extraerImagenes(datos.pdf);
      return datos;
    })
  );
  archivos = await Promise.all(
    archivos.map(async (datos) => {
      const { photo, barcode } = await Imagenes(pdfSinExtension(datos.pdf));
      datos.photo = photo;
      datos.barcode = barcode;
      datos.file = fs.readFileSync(`./pdfs/${datos.pdf}`).toString('base64');
      datos.computadora = process.env.COMPUTADORA;
      datos.oficina = process.env.OFICINA;
      return datos;
    })
  );
  const arregloDatos = await partirArray(archivos, 5);
  await Promise.all(
    arregloDatos.map(async (chunck) => {
      await Promise.all(
        chunck.map(async (datos) => {
          await subir(datos);
        })
      );
    })
  );
  // console.log(arregloDatos);
})();
