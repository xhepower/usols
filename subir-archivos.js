elpdf = 'usol-6072022-CORALIA MELISSA VASQUEZ URQUIA-1208200400533.pdf';
const FormData = require('form-data');
const fs = require('fs');
const http = require('./http-common');
const upload = async () => {
  try {
    const file = await fs.createReadStream(`./pdfs/${elpdf}`);
    const title = 'My file';

    const form = new FormData();
    form.append('title', title);
    form.append('file', file);

    const resp = await http.post(`/pdfs/subir`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    if (resp.status === 200) {
      return 'Upload complete';
    }
  } catch (err) {
    return new Error(err.message);
  }
};

upload().then((resp) => console.log(resp));
