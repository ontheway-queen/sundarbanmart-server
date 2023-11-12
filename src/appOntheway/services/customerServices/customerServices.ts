import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import AbstractServices from '../../../abstracts/abstractServices';
import CustomError from '../../../common/utils/errors/customError';
import Lib from '../../../common/utils/libraries/lib';

type UserCreate = {
  name: string;
  password: string;
  phone: number;
  address: string;
  city: string;
  post_code?: number;
  email?: string;
};

class CustomerServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * registerCustomer
   */
  public async register(body: UserCreate) {
    const { name, phone, password: bodyPass, address } = body;
    return await this.transaction.beginTransaction(async (query) => {
      const user = await query.select({
        table: 'customers',
        fields: { columns: ['phone', 'photo', 'id'] },
        where: { table: 'customers', field: 'phone', value: phone },
      });

      const hashedPass = await Lib.hashPass(bodyPass);
      let data;
      if (user.length) {
        await query.update({
          table: 'customers',
          data: {
            ...body,
            guest: 0,
            password: hashedPass,
          },
          where: { id: user[0].id },
        });
      } else {
        data = await query.insert('customers', {
          ...body,
          guest: 0,
          password: hashedPass,
        });
      }

      const { password, ...rest } = body;
      const tokenCreds = { name, phone, address };
      const token = Lib.createToken(tokenCreds, Lib.maxAge);

      return {
        success: true,
        user: { ...rest, id: data?.insertId || user[0].id },
        token,
      };
    });
  }

  /**
   * getAllCustomers
   */
  public async getAllCustomers(req: Request) {
    const { limit, skip } = req.query;
    const data = await this.query.select({
      table: 'customers',
      fields: { columns: ['id', 'name', 'photo', 'phone', 'address'] },
      limit: { limit: limit as string, skip: skip as string },
    });

    const forCount =
      'SELECT count(ngf_ecommerce.customers.id) as total FROM ngf_ecommerce.customers';

    const total = (await this.query.rawQuery(forCount)) as RowDataPacket[];
    console.log({ total });

    return { success: true, data: data, total: total[0].total };
  }

  /**
   * getACustomer
   */
  public async getACustomer(req: Request) {
    const { id } = req.params;
    const { phone } = req.params;

    const finder = id ? ['id', id] : ['phone', phone];

    const columns = [
      'id',
      'name',
      'phone',
      'address',
      'email',
      'post_code',
      'photo',
      'city',
      'guest',
    ];

    const data = await this.query.select({
      table: 'customers',
      fields: { columns },
      where: { table: 'customers', field: finder[0], value: finder[1] },
    });

    if (data.length) {
      return { success: true, data: data[0] };
    } else {
      return {
        success: false,
        message: 'No data found with this Phone',
      };
    }
  }

  /**
   * updateCustomerInfo
   */
  public async updateCustomerInfo(req: Request) {
    const { id } = req.params;
    const { filename } = req.file || {};

    return await this.transaction.beginTransaction(async (query) => {
      const data = await query.select({
        table: 'customers',
        fields: { columns: ['phone', 'photo'] },
        where: { table: 'customers', field: 'id', value: id },
      });

      if (data.length < 1) {
        filename && this.deleteFile.delete('customers', filename);
        throw new CustomError('Use does not exist!!', 400, 'Bad request');
      } else {
        const updateData = filename
          ? { ...req.body, photo: filename }
          : req.body;
        await query.update({
          table: 'customers',
          data: updateData,
          where: { id },
        });
        const oldPhoto = data[0].photo as string;
        let buyerBody = {};

        if (req.body.name) {
          buyerBody = { ...buyerBody, name: req.body.name };
        }
        if (filename) {
          buyerBody = { ...buyerBody, photo: filename };
        }
        if (req.body.city) {
          buyerBody = { ...buyerBody, city: req.body.city };
        }
        if (req.body.email) {
          buyerBody = { ...buyerBody, email: req.body.email };
        }

        oldPhoto && this.deleteFile.delete('customers', oldPhoto);
      }

      return {
        success: true,
        data: {
          photo: filename,
          message: 'User successfully updated',
        },
      };
    });
  }
}

export default CustomerServices;
