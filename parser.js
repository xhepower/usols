const pdfjs = require('pdfjs-dist/legacy/build/pdf');
const docvacio = './pdf/zxzxzx/ertretr.pdf';
const doc =
  './pdf/zxzxzx/Consular Electronic Application Center - Print Applicationerikalagos.pdf';
async function getContent(pdf) {
  contenido = [];
  const doc = await pdfjs.getDocument(pdf).promise;
  const numPages = await doc._pdfInfo.numPages;
  for (let i = 1; i <= (await numPages); i++) {
    let pageText = await (await doc.getPage(i)).getTextContent();
    pageText.items.map((item) => {
      if (item.str != ' ' && item.str != '') {
        contenido.push(item.str);
      }
    });
  }
  return contenido;
}

async function esDigno(pdf) {
  const contenido = await getContent(pdf);
  if (contenido.includes('Sensitive But Unclassified(SBU)')) {
    return true;
  } else {
    return false;
  }
}
async function datos(pdf) {
  const aBuscar = ['Full Name in Native Language:'];
  contenido = await getContent(pdf);
  //extraer fecha
  fecha = (() => {
    const laFecha = contenido[0].substr(0, contenido[0].search(','));
  })();
  return fecha;
}
datos(doc).then((r) => console.log(r));

module.exports = { esDigno, getContent };
