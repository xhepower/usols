import Tesseract from 'tesseract.js';

Tesseract.recognize('./usol-fotos/6.png', 'eng', {
  logger: (m) => console.log(m),
}).then(({ data: { text } }) => {
  console.log(text);
});
