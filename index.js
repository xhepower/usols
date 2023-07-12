import * as fs from 'fs';
import { getContent, esDigno, datosPDF, nombrePDF } from './handlePDF.js';
import { isPDF, moverPDF } from './handleFiles.js';
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
      //console.log(contenido[0], new Date(datos.fecha), datos.archivo);
      return datos;
    });

  //console.log(archivos);
  Promise.all(
    archivos.map((datos) => {
      // console.log(datos);
      datos.pdf = `${nombrePDF(datos)}.pdf`;
      console.log(datos.archivo, datos.pdf);
      //para moverlo a la carpeta pdf si no existe
      moverPDF(`${path}/${datos.archivo}`, datos.pdf);
      //para mandarlo al servidor si
    })
  );

  fs.writeFileSync('./puto.json', JSON.stringify(archivos));
})();
