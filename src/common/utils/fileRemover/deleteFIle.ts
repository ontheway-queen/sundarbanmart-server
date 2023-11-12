import fs from 'fs';

class DeleteFile {
  public delete = async (dir: string, files: string | string[]) => {
    try {
      if (typeof files === 'string') {
        const strPath = `${__dirname}/../../../uploads/${dir}/${files}`;
        await fs.promises.unlink(strPath);
      } else if (files && files.length >= 1) {
        for (let i = 0; i < files.length; i++) {
          const filename = files[i];
          const path = `${__dirname}/../../../uploads/${dir}/${filename}`;
          await fs.promises.unlink(path);
        }
      } else {
        return;
      }
    } catch (err) {
      console.log({ err });
    }
  };
}

export default DeleteFile;
