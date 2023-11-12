import { Request } from 'express';
import AbstractServices from '../../abstracts/abstractServices';
import CustomError from '../../common/utils/errors/customError';

class CommonServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * updateDp
   */
  public async updateDp(table: string, req: Request) {
    const { id } = req.params;
    const { filename } = (req.file as Express.Multer.File) || {};

    if (filename) {
      return await this.transaction.beginTransaction(async (query) => {
        const qInfo = await query.select({
          table,
          fields: { columns: ['photo', 'status'] },
          where: { table, field: 'id', value: id },
        });

        if (qInfo.length < 1) {
          throw new CustomError(
            'Please provide a valid ID to update photo',
            400,
            'Bad request'
          );
        }

        const { photo, status } = qInfo[0];

        await query.update({
          table,
          data: { photo: filename },
          where: { id },
        });

        if (status === 'Approved') {
          await query.update({
            table: 'queens',
            data: { photo: filename },
            where: { admin_queens_id: id },
          });
        }

        const folder =
          table === 'admin_queens'
            ? 'queens'
            : table === 'trainer'
            ? 'trainer'
            : '';

        if (!folder) {
          throw new CustomError(
            'Please select a valid table to update photo e.g.(admin_queens or trainer)',
            500,
            'Internal server error'
          );
        }

        // if (table === 'admin_queens') {
        //   await this.outServiceShare.updateSellerInfo(id, { photo: filename });
        // }

        this.deleteFile.delete(folder, photo);

        return {
          success: true,
          message: 'successfully updated dp',
          data: filename,
        };
      });
    } else {
      throw new CustomError(
        'Please provide an image to update',
        400,
        'Bad request'
      );
    }
  }

  /**
   * updateNids
   */
  public async updateNids(table: string, req: Request) {
    const { id } = req.params;

    const files = (req.files as Express.Multer.File[]) || [];

    const nid_front =
      files[0]?.fieldname === 'nid_front'
        ? files[0].filename
        : files[1]?.fieldname === 'nid_front'
        ? files[1]?.filename
        : null;

    const nid_back =
      files[0]?.fieldname === 'nid_back'
        ? files[0].filename
        : files[1]?.fieldname === 'nid_back'
        ? files[1]?.filename
        : null;

    if (files.length < 2) {
      throw new CustomError('Must send two NID images.', 400, 'Bad request');
    } else if (files.length > 2) {
      throw new CustomError(
        'Cannot upload more than 2 images.',
        400,
        'Bad request'
      );
    } else if (!nid_front || !nid_back) {
      throw new CustomError(
        'Fields name must be `nid_front` and `nid_back`.',
        400,
        'Bad request'
      );
    }

    const folder =
      table === 'admin_queens'
        ? 'queens'
        : table === 'trainer'
        ? 'trainer'
        : table === 'fund_guaranter'
        ? 'fund_guaranter'
        : '';

    if (!folder) {
      throw new CustomError(
        'Please select a valid table to update NId e.g.(admin_queens or trainer)',
        500,
        'Internal server error'
      );
    }

    return await this.transaction.beginTransaction(async (query) => {
      const nids = await query.select({
        table,
        fields: { columns: ['nid_front', 'nid_back'] },
        where: { table, field: 'id', value: id },
      });

      if (nids.length >= 1) {
        const nidFront = nids[0].nid_front;
        const nidBack = nids[0].nid_back;

        this.deleteFile.delete('nids', nidFront);
        this.deleteFile.delete('nids', nidBack);
      }

      const data = await query.update({
        table,
        data: { nid_back, nid_front },
        where: { id },
      });

      if (data.affectedRows && data.changedRows) {
        return {
          success: true,
          message: 'NID update successful',
          data: { nid_front, nid_back },
        };
      } else {
        return {
          success: false,
          message:
            'Cannot update nids, Please check if you are providing valid ID',
          status: 400,
        };
      }
    });
  }

  // check phone for reg
  public async checkPhoneForReg(phone: string | number, table: string) {
    const data = await this.query.select({
      table,
      fields: { columns: ['id', 'status'] },
      where: { table, field: 'phone', value: phone },
    });

    if (data.length) {
      return {
        success: false,
        message: 'User already exist with this phone',
      };
    } else {
      return {
        success: true,
        message: 'No user found with this id',
      };
    }
  }
}

export default CommonServices;
