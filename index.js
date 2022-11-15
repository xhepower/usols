import { datos, esDigno, nombreDeArchivo } from './handlePdf.js';
import * as fs from 'fs';
import rimraf from 'rimraf';
import * as dpath from 'path';
const path = './pdfs';

//las variables a imprimir
let archivosNoPdf = 0;
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
  return files;
};

(async () => {
  console.log(await purgar());
})();
