import * as fs from 'fs';
import { isPDF, moverPDF, Imagenes } from './handleFiles.js';
import {
  getContent,
  esDigno,
  datosPDF,
  nombrePDF,
  pdfSinExtension,
  extraerImagenes,
} from './handlePDF.js';
let archivos = async (path) =>
  await Promise.all(
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
(async () => {
  const raiz = (await archivos('./')).length;
  const folder = (await archivos('./pdfs/')).length;
  console.log('En la raiz hay ', raiz, ' pdfs');
  console.log('En la carpetahay ', folder, ' pdfs');
  console.log('Hay un total de ', raiz + folder);
})();
