import AbstractServices from '../../../abstracts/abstractServices';
import Lib from '../../../common/utils/libraries/lib';
import { Request } from 'express';
import { TCredType } from '../../../common/utils/commonTypes/types';

type UserLogin = {
  phone: number;
  password: string;
};

// AUTHENTICATION CLASS
class AdminPanelServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * Login service
   */
  public async login(creds: UserLogin) {
    const { phone, password } = creds;

    const fields = ['name', 'phone', 'password', 'email', 'photo', 'role'];

    const user = await this.query.select({
      table: 'admin',
      fields: { columns: fields },
      where: { table: 'admin', field: 'phone', value: phone },
    });

    if (user.length < 1) {
      return { success: false, message: 'Username or password is incorrect!!' };
    }

    const { name, phone: userPhone, password: userPass, role } = user[0];

    const isPassValid = password === userPass;

    if (isPassValid) {
      const tokenCreds = { name, phone: userPhone, role };
      const token = Lib.createToken(tokenCreds, Lib.maxAge);

      const { password, ...userTosend } = user[0];

      return { success: true, user: userTosend, token };
    } else {
      return { success: false, message: 'Username or password is incorrect!!' };
    }
  }

  // admin panel search services
  public AdminSearchService = async (req: Request) => {
    const { part, type } = req.params;
    const { search } = req.query;

    let column: string[] = [];
    let table: string = '';
    let searchField: string = '';

    switch (part) {
      case 'queens':
        column = ['id', 'name', 'status', 'phone', 'photo', 'note'];
        table = 'admin_queens';
        searchField = 'name';
        break;

      case 'products':
        column = [
          'id',
          'product_name',
          'price',
          'product_picture_1',
          'status',
          'category',
          'queen_id',
        ];
        table = 'admin_products';
        searchField = 'product_name';
        break;

      case 'orders':
        column = ['id', 'status', 'note'];
        table = 'orders';
        break;
      default:
        return { success: false, data: 'Wrong search part' };
    }

    let data;

    if (type === 'id' || type === 'phone') {
      let query: TCredType = {
        table,
        fields: { columns: column, as: [['last_update', 'reg_at']] },
        where: { table, field: type, value: search as string },
      };
      if (part === 'orders') {
        query = {
          table,
          fields: {
            columns: column,
            as: [['order_date', 'order_date']],
            otherFields: [
              { table: 'customers', as: [['name', 'customer_name']] },
            ],
          },
          join: [
            {
              join: { table: 'customers', field: 'id' },
              on: { table: 'orders', field: 'customer_id' },
            },
          ],
          where: { table, field: type, value: search as string },
        };
      }
      if (part === 'products') {
        query = {
          fields: {
            columns: column,
            otherFields: [
              { table: 'admin_queens', as: [['name', 'queen_name']] },
            ],
          },
          table,
          where: { table, field: type, value: search as string },
          join: [
            {
              join: { table: 'admin_queens', field: 'id' },
              on: { table, field: 'queen_id' },
            },
          ],
          orderBy: { table, field: 'upload_date' },
          desc: true,
        };
      }
      data = await this.query.select(query);
    } else if (type === 'date') {
      data = await this.query.select({
        table,
        fields: {
          columns: column,
          as: [['order_date', 'order_date']],
          otherFields: [
            { table: 'customers', as: [['name', 'customer_name']] },
          ],
        },
        join: [
          {
            join: { table: 'customers', field: 'id' },
            on: { table: 'orders', field: 'customer_id' },
          },
        ],
        where: {
          table,
          field: 'order_date',
          value: `'${search}'` as string,
          date: true,
        },
      });
    } else if (type === 'name') {
      let sql: string;
      if (part === 'queens') {
        sql = `SELECT last_update AS reg_at, ?? FROM ?? WHERE MATCH (??) AGAINST (?)`;
      } else {
        column = [
          'admin_products.id',
          'admin_products.product_name',
          'admin_products.price',
          'admin_products.product_picture_1',
          'admin_products.status',
          'admin_products.category',
          'admin_products.queen_id',
        ];
        sql = `SELECT admin_queens.name as queen_name, ?? FROM ?? join ngf_ecommerce.admin_queens on admin_products.queen_id = admin_queens.id WHERE MATCH (??) AGAINST (?)`;
      }
      const values = [column, table, searchField, search as string];
      data = await this.query.rawQuery(sql, values);
    } else {
      return { success: false, data: 'Wrong search type' };
    }

    console.log(data);
    return { success: true, data };
  };
}

export default AdminPanelServices;
