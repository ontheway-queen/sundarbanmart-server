import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstractServices';

class ContentImageServices extends AbstractServices {
  constructor() {
    super();
  }

  // Get content images
  public getContentImgs = async (req: Request) => {
    const { section } = req.params;
    +``;
    const data = await this.query.select({
      table: 'content_images',
      fields: { columns: ['id', 'img', 'link'] },
      where: {
        table: 'content_images',
        field: 'section',
        value: `'${section}'`,
      },
    });

    if (section === 'slider' || section === 'app_slider') {
      return { success: true, data };
    } else if (data.length === 1) {
      return { success: true, data: data[0] };
    } else {
      return { success: false, message: 'No image found' };
    }
  };

  // post or update slider images service
  public sliderimageUploadOrUpdate = async (req: Request) => {
    const files = (req.files as Express.Multer.File[]) || [];
    const { deleted } = req.body;
    const { section } = req.params;
    const sliders: { id: number; img: string }[] = [];
    const imgsToUpload: [string, string][] = [];
    const imgsToUpdate: [number, string][] = [];
    const imgsToDelete: string[] = [];

    return this.transaction.beginTransaction(async (query) => {
      const prevImgs = await this.query.select({
        table: 'content_images',
        fields: { columns: ['id', 'img'] },
        where: {
          table: 'content_images',
          field: 'section',
          value: `'${section}'`,
        },
      });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.fieldname.startsWith('new')) {
          imgsToUpload.push([section, file.filename]);
        } else {
          for (let j = 0; j < prevImgs.length; j++) {
            const img = prevImgs[j];
            if (Number(file.fieldname) === img.id) {
              imgsToUpdate.push([Number(file.fieldname), file.filename]);
            }
          }
        }
      }

      if (deleted) {
        const dFiles: number[] = JSON.parse(deleted) as number[];
        for (let i = 0; i < dFiles.length; i++) {
          const file = dFiles[i];
          for (let j = 0; j < prevImgs.length; j++) {
            const img = prevImgs[j];
            if (file === img.id) {
              imgsToDelete.push(img.img);
              await query.delete({
                table: 'content_images',
                where: { id: img.id },
              });

              break;
            }
          }
        }
      }
      if (imgsToUpdate.length) {
        for (let i = 0; i < imgsToUpdate.length; i++) {
          const img = imgsToUpdate[i];

          const updater = await query.update({
            table: 'content_images',
            data: { img: img[1] },
            where: { id: img[0] },
          });

          if (updater.affectedRows) {
            sliders.push({ id: img[0], img: img[1] });
            for (let i = 0; i < prevImgs.length; i++) {
              if (prevImgs[i].id === img[0]) {
                imgsToDelete.push(prevImgs[i].img);
              }
            }
          }
        }
      }

      if (imgsToUpload.length) {
        const uploaded = await query.multipleInsert(
          'content_images',
          ['section', 'img'],
          imgsToUpload
        );
        for (let i = 0; i < imgsToUpload.length; i++) {
          sliders.push({ id: uploaded.insertId + i, img: imgsToUpload[i][1] });
        }
      }
      this.deleteFile.delete('content_images', imgsToDelete);
      return { success: true, data: sliders };
    });
  };

  // update daily deals img
  public updateDailyDealsImgs = async (req: Request) => {
    const { section } = req.params;
    const { filename } = (req.file as Express.Multer.File) || {};
    const { link } = req.body;

    return await this.transaction.beginTransaction(async (query) => {
      const prev = await this.query.select({
        fields: { columns: ['id', 'img'] },
        table: 'content_images',
        where: {
          table: 'content_images',
          field: 'section',
          value: `'${section}'`,
        },
      });

      const body = filename ? { img: filename, link } : { link };

      const data = await query.update({
        table: 'content_images',
        data: body,
        where: { section: `${section}` },
      });

      if (filename) this.deleteFile.delete('deals', prev[0].img);
      return { success: true, data: { id: prev[0].id, img: filename } };
    });
  };
}

export default ContentImageServices;
