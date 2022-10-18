const { execFileSync } = require('child_process');
const fs = require('fs');
const { get } = require('request');

const { esDigno, getContent, datos } = require('./nparser');

const path = './pdf/zxzxzx';
listapdfs = (async () => {
  aja = await Promise.all(
    fs
      .readdirSync(path)
      .filter((pdf) => {
        if (pdf.substring(0, 4) == 'usol') {
          return false;
        } else {
          return true;
        }
      })
      .map((pdf) => `${path}/${pdf}`)
      .map(async (pdf) => {
        if ((await esDigno(pdf)) == false) {
          borrarArchivo(pdf);
        } else {
          return pdf;
        }
      })
  );
  return aja.filter((pdf) => pdf !== undefined);
})();
const borrarArchivo = async (path) => {
  fs.unlinkSync(path);
};

const nombreDeArchivo = async (datos) => {
  //return datos;
  return `usol-${await datos.date}-${datos.name}-${datos.idNumber}-${
    datos.city
  }-${datos.phone}`;
};
(async () => {
  console.log(
    await Promise.all(
      (
        await listapdfs
      ).map(async (pdf) => {
        return await datos(pdf);
      })
    )
  );
})();
