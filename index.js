import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import {
  getContent,
  esDigno,
  datosPDF,
  nombrePDF,
  pdfSinExtension,
  extraerImagenes,
} from './handlePDF.js';
import { isPDF, soloTumbados, moverPDF, Imagenes } from './handleFiles.js';
import { partirArray } from './utils.js';
import { subir, obtenerArchivos, obtenerDatos } from './handleServer.js';
const path = './';
// aqui vamso a eliminar los archisvos que no sean pdf y los directorios
// Eliminar todos los pdf que no sean dignos
// (async () => {
//   let archivos = await Promise.all(
//     fs
//       .readdirSync(path)
//       .filter((archivo) => {
//         return isPDF(`${path}/${archivo}`);
//       })
//       .map(async (pdf) => {
//         const contenido = await getContent(`${path}/${pdf}`);
//         return [pdf, esDigno(contenido), contenido];
//       })
//   );
//   // let escribir = [];
//   archivos = archivos
//     .filter((pdf) => pdf[1])
//     .map((pdf) => {
//       const contenido = pdf[2];
//       const archivo = pdf[0];

//       const datos = datosPDF(contenido);
//       datos.archivo = archivo;
//       datos.pdf = `${nombrePDF(datos)}.pdf`;
//       moverPDF(`${path}/${datos.archivo}`, datos.pdf);
//       return datos;
//     });
//   archivos = await Promise.all(
//     archivos.map(async (datos) => {
//       await extraerImagenes(datos.pdf);
//       return datos;
//     })
//   );
//   archivos = await Promise.all(
//     archivos.map(async (datos) => {
//       const { photo, barcode } = await Imagenes(pdfSinExtension(datos.pdf));
//       datos.photo = photo;
//       datos.barcode = barcode;
//       datos.file = fs.readFileSync(`./pdfs/${datos.pdf}`).toString('base64');
//       datos.computadora = process.env.COMPUTADORA;
//       datos.oficina = process.env.OFICINA;
//       return datos;
//     })
//   );
//   const arregloDatos = await partirArray(archivos, 5);
//   await Promise.all(
//     arregloDatos.map(async (chunck) => {
//       await Promise.all(
//         chunck.map(async (datos) => {
//           await subir(datos);
//         })
//       );
//     })
//   );

// })();

//Vamos a pasar todos los pdfs a la carpeta e ir agregando a un archivo los datos

(async () => {
  console.log('dandole atomos');
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
  archivos = await Promise.all(
    archivos
      .filter((pdf) => pdf[1])
      .map((pdf) => {
        const contenido = pdf[2];
        const archivo = pdf[0];

        const datos = datosPDF(contenido);
        datos.archivo = archivo;
        datos.pdf = `${nombrePDF(datos)}.pdf`;
        datos.computadora = process.env.COMPUTADORA;
        datos.oficina = process.env.OFICINA;

        return datos;
      })
      .map(async (dato) => {
        const archivosEnCarpet = fs.readdirSync('./pdfs/');
        if (!archivosEnCarpet.includes(dato.pdf)) {
          moverPDF(`${path}/${dato.archivo}`, dato.pdf);
          await extraerImagenes(dato.pdf);
          // Lee el contenido del archivo 'data.json' de forma síncrona
          const jsonData = await fs.readFileSync('datos.json', 'utf8');

          // Parsea el contenido JSON a un objeto JavaScript
          const datoJSON = await JSON.parse(jsonData);

          const archivosJson = datoJSON.map((dato) => dato.pdf);
          if (!archivosJson.includes(dato.pdf)) {
            datoJSON.push(dato);
            const writeJson = JSON.stringify(datoJSON, null, 2);
            fs.writeFileSync('datos.json', writeJson, 'utf8');
          }

          return dato;
        }
        return null;
      })
  );
  archivos = archivos.filter((dato) => dato !== null);
  console.log('archivos movidos');
})();

//? Hasta aquí lelvo solucionado la parte local, aqui se viene lo chido:SERVER
(async () => {
  const datosJSON = fs.readFileSync('datos.json', 'utf8');
  let jsonData = await JSON.parse(datosJSON);
  //const archivosServer = (await obtenerArchivos()).data;
  // const datosServer = (await obtenerDatos()).data;
  // const aDatos = datosServer.map((item) => item.pdf);

  jsonData = await Promise.all(
    jsonData.map(async (datos) => {
      const datosServer = (await obtenerDatos()).data;
      const aDatos = datosServer.map((item) => item.pdf);
      if (aDatos.includes(datos.pdf) == false) {
        const { photo, barcode } = await Imagenes(pdfSinExtension(datos.pdf));
        datos.photo = photo;
        datos.barcode = barcode;
        datos.file = fs.readFileSync(`./pdfs/${datos.pdf}`).toString('base64');

        return datos;
      } else {
        return null;
      }
    })
  );
  jsonData = jsonData.filter((dato) => dato !== null);
  Promise.all(
    jsonData.map(async (datos) => {
      await subir(datos);
    })
  );
  console.log('Dizque actualizado... Hay que ver. Saludos');
})();
