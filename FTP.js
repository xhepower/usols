import * as ftp from 'basic-ftp';
import * as fs from 'fs';
import {} from 'dotenv/config';
class FTPClient {
  constructor(
    host = process.env.FTP_HOSTNAME,
    port = 21,
    username = process.env.FTP_USERNAME,
    password = process.env.FTP_PASSWORD,
    secure = false
  ) {
    this.client = new ftp.Client();
    this.settings = {
      host: host,
      port: port,
      user: username,
      password: password,
      secure: secure,
    };
  }

  async upload(sourcePath, remotePath, permissions) {
    let self = this;
    (async () => {
      try {
        let access = await self.client.access(self.settings);
        let upload = await self.client.upload(
          fs.createReadStream(sourcePath),
          remotePath
        );
        let permissions = await self.changePermissions(
          permissions.toString(),
          remotePath
        );
      } catch (err) {
        console.log(err);
      } finally {
        await self.client.close();
      }
    })();
  }

  async close() {
    this.client.close();
  }

  changePermissions(perms, filepath) {
    let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
    return this.client.send(cmd, false);
  }
}

export { FTPClient };
