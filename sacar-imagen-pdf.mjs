const elpdf =
  "./pdfs/Consular Electronic Application Center - Print Applicationbenancia.pdf";
import fs from "fs";
import { esDigno } from "./nparser.js";
import { exportImages } from "pdf-export-images";
/*exportImages(elpdf, "images")
  .then((images) => console.log("Exported", images.length, "images"))
  .catch(console.error);*/

async function sacarImagenPdf(ruta) {
  //crear carpeta por cada pdf y meter ahi las imagenes para ver que pedo
  if ((await esDigno(`./pdfs/${pdf}`)) == true) {
    //fs.mkdirSync(`./images/${pdf}`);
    await exportImages(`./pdfs/${pdf}`, `./images/${pdf}`);
  }
}
const listapdf = fs.readdirSync("./pdfs");
await Promise.all(
  listapdf.map(async (pdf) => {
    await sacarImagenPdf(pdf);
  })
);

module.exports = { sacarImagenPdf };
