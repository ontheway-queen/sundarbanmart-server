import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import AssyncWrapper from '../assypers/assyper';

class Compresser {
  private assyncWrapper: AssyncWrapper;

  constructor() {
    this.assyncWrapper = new AssyncWrapper();
  }

  public compresse(folderPath: string) {
    return this.assyncWrapper.wrap(
      async (req: Request, _res: Response, next: NextFunction) => {
        const uploadsFolder = `${__dirname}/../../../uploads/${folderPath}`;

        const isArray =
          Object.prototype.toString.call(req.files) === '[object Array]';

        if (req.file) {
          const { buffer } = req.file;

          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + '.webp';

          const checkImg = await sharp(buffer).metadata();

          const { width, height } = checkImg;

          let size: [number | null, number | null];
          if (width && height) {
            // if the width and height is not undefined then proceed further
            if (width > height) {
              size = [700, null];
            } else {
              size = [null, 700];
            }

            await sharp(buffer)
              .resize(...size, {
                // background: { r: 255, g: 255, b: 255, alpha: 1 },
                fit: 'contain',
              })
              .toFormat('webp')
              .withMetadata()
              .toFile(`${uploadsFolder}/${uniqueName}`);

            req.file.filename = uniqueName;
          }

          next();
        } else if (req.files && isArray && req.files?.length > 0) {
          // iterate the files for compressing

          const files = req.files as Express.Multer.File[];
          console.log('before', req.files);

          for (let i = 0; i < req.files.length; i++) {
            const { buffer } = files[i];

            const uniqueName =
              Date.now() + '-' + Math.round(Math.random() * 1e9) + '.webp';

            const checkImg = await sharp(buffer).metadata();

            const { width, height } = checkImg;

            let size: [number | null, number | null];

            if (width && height) {
              // if the width and height is not undefined then proceed further
              if (width > height) {
                size = [500, null];
              } else {
                size = [null, 500];
              }

              await sharp(buffer)
                .resize(...size, {
                  // background: { r: 243, g: 243, b: 243, alpha: 1 },
                  fit: 'contain',
                })
                .rotate()
                .toFormat('webp')
                .toFile(`${uploadsFolder}/${uniqueName}`);

              files[i].filename = uniqueName;
            }
          }

          req.files = files;

          // send to the next middleware when compression is done
          next();
        } else {
          // if there are no image to compress then call send to the next middleware
          next();
        }
      }
    );
  }

  public smallCompress = async (folder: string, filename: string) => {
    try {
      const file = await sharp(
        `${__dirname}/../../../uploads/${folder}/${filename}`
      )
        .resize({ width: 50, height: 50 })
        .toFile(`${filename}`, (err, file) => {
          if (err) {
            console.log(err);
          }
        });
      return file;
    } catch (error) {
      console.log(error);
    }
  };
}

export default Compresser;
