import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import AbstractServices from '../../../abstracts/abstractServices';
import CustomError from '../../../common/utils/errors/customError';
import Lib from '../../../common/utils/libraries/lib';

type TInfo = {
  name: string;
  address: string;
  city: string;
  post_code?: number;
  email?: string;
  division?: string;
};

type TObj = {
  success: boolean;
  message?: string;
  data?: any;
};

class QueenServices extends AbstractServices {
  constructor() {
    super();
  }

  // search queen by name
  public async searchQueen(req: Request) {
    const { name } = req.params;
    const sql =
      'SELECT queens.admin_queens_id as id, queens.name, queens.photo, queens.city, queens.division, queens.designation FROM ngf_ecommerce.queens where match(queens.name) against(?)';

    const data = await this.query.rawQuery(sql, [name]);

    return {
      success: true,
      data,
    };
  }

  /**
   * updateQueensInfo
   */
  public async updateQueensInfo(req: Request) {
    const { id } = req.params;
    const { name, address, email, city, post_code, division } = req.body;
    const data: TObj = await this.transaction.beginTransaction(
      async (query) => {
        const info: TInfo = {
          name,
          address,
          city,
        };

        if (email) info.email = email;
        if (post_code) info.post_code = post_code;
        if (division) info.division = division;

        await query.update({
          table: 'admin_queens',
          data: info,
          where: { id },
        });

        const data = await query.select({
          table: 'queens',
          fields: { columns: ['name'] },
          where: { table: 'queens', field: 'admin_queens_id', value: id },
        });

        if (data.length > 0) {
          const upVals = [
            'name',
            'phone',
            'photo',
            'address',
            'post_code',
            'city',
            'division',
            'lat',
            'lng',
            'nid_front',
            'nid_back',
          ];

          if (email) upVals.push('email');

          await query.replace({
            replace: [...upVals, 'admin_queens_id'],
            into: 'queens',
            select: [...upVals, 'id'],
            from: 'admin_queens',
            where: { id },
          });
        }

        return { success: true, message: 'Queen successfully updated' };
      }
    );

    return data;
  }

  /**
   * getAllApprovedQueens
   */

  public async getAllApprovedQueens(req: Request) {
    const { limit, skip } = req.query;
    const sql =
      'SELECT distinct queens.admin_queens_id as id,(select count(admin_products_id) as total_product from ngf_ecommerce.products where products.queen_id = queens.admin_queens_id)  as total_product, queens.name, queens.photo FROM ngf_ecommerce.queens join ngf_ecommerce.products where ngf_ecommerce.queens.admin_queens_id = ngf_ecommerce.products.queen_id order by (select count(admin_products_id) as total_product from ngf_ecommerce.products where products.queen_id = queens.admin_queens_id) desc limit ? offset ?';
    const values: number[] = [Number(limit), Number(skip)];

    const data = await this.query.rawQuery(sql, values);

    const forCount =
      'SELECT count(distinct(ngf_ecommerce.queens.admin_queens_id)) as total FROM ngf_ecommerce.queens join ngf_ecommerce.products where ngf_ecommerce.queens.admin_queens_id = ngf_ecommerce.products.queen_id';

    const count = await this.query.rawQuery(forCount);

    return {
      success: true,
      data,
      total: (count as RowDataPacket)[0].total,
    };
  }

  /**
   * queenUpdatePassword
   */
  public async queenUpdatePassword(req: Request) {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    const oldPass = await this.query.select({
      fields: { columns: ['password'] },
      table: 'admin_queens',
      where: { table: 'admin_queens', field: 'id', value: id },
    });

    const isPassValid = await Lib.compare(old_password, oldPass[0].password);

    if (isPassValid) {
      const hashedPassword = await Lib.hashPass(new_password);

      await this.query.update({
        data: { password: hashedPassword },
        table: 'admin_queens',
        where: { id },
      });

      return {
        success: true,
        message: 'Your password changed successfully',
      };
    } else {
      throw new CustomError(
        'Your old password is incorrect',
        400,
        'Bad request'
      );
    }
  }
}

export default QueenServices;
