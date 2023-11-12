import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import AbstractServices from '../../../abstracts/abstractServices';
import { TWhere } from '../../../common/utils/commonTypes/types';

class AdminQueensServices extends AbstractServices {
  constructor() {
    super();
  }

  // getAllQueens
  public async getAllQueens(req: Request) {
    const { limit, skip } = req.query;
    const fields = [
      'id',
      'name',
      'phone',
      'queen_category',
      'photo',
      'status',
      'note',
    ];

    const data = await this.query.select({
      fields: { columns: fields, as: [['last_update', 'reg_at']] },
      table: 'admin_queens',
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      orderBy: { table: 'admin_queens', field: 'last_update' },
      desc: true,
    });

    const forCount =
      'SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens';
    const count = await this.query.rawQuery(forCount);
    // }

    return {
      success: true,
      total: (count as RowDataPacket)[0].total,
      data: data,
    };
  }

  // get all queen by status for admin
  public async getAllQueensByStatus(req: Request) {
    const { limit, skip } = req.query;
    const { status } = req.params;
    const fields = [
      'id',
      'name',
      'phone',
      'photo',
      'status',
      'note',
      'queen_category',
    ];

    const data = await this.query.select({
      fields: { columns: fields, as: [['last_update', 'reg_at']] },
      table: 'admin_queens',
      where: { table: 'admin_queens', field: 'status', value: `'${status}'` },
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      orderBy: { table: 'admin_queens', field: 'last_update' },
      desc: true,
    });

    // let count: any = [];
    const forCount =
      'SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens where ngf_ecommerce.admin_queens.status=?';
    // if (skip === '0') {
    const count = await this.query.rawQuery(forCount, [status]);
    // }

    return {
      success: true,
      data: data,
      total: (count as RowDataPacket)[0].total,
    };

    // if (count.length) {
    //   return { success: true, data: { total: count[0].total, data: data } };
    // } else {
    //   return { success: true, data: { data: data } };
    // }
  }

  // updateQueensInfo
  public async updateQueensInfo(req: Request) {
    const { id } = req.params;
    const { filename } = req.file || {};

    return await this.transaction.beginTransaction(async (query) => {
      if (filename) req.body.photo = filename;

      const prev = await query.select({
        fields: { columns: ['photo', 'seller'] },
        table: 'admin_queens',
        where: { table: 'admin_queens', field: 'id', value: id },
      });

      await query.update({
        table: 'admin_queens',
        data: req.body,
        where: { id },
      });

      if (req.body.status === 'rejected') {
        await query.delete({
          table: 'products',
          where: { queen_id: id },
        });
      }

      const fields = [
        'id',
        'name',
        'phone',
        'photo',
        'address',
        'nid_front',
        'nid_back',
        'city',
        'post_code',
        'designation',
        'queen_category',
      ];

      if (req.body.status === 'Approved') {
        const reval = [...fields, 'lat', 'lng', 'email'];

        reval.shift();

        const res = await query.replace({
          into: 'queens',
          replace: [...reval, 'admin_queens_id'],
          select: [...reval, 'id'],
          from: 'admin_queens',
          where: { id },
        });
      } else {
        await query.delete({
          table: 'queens',
          where: { admin_queens_id: id },
        });
      }

      if (filename && prev.length > 0) {
        this.deleteFile.delete('queens', prev[0].photo);
      }

      return {
        success: true,
        message: 'Queen info successfully updated',
        data: filename,
      };
    });
  }

  // get queen by date range
  public getQueenByDateRange = async (req: Request) => {
    const { from, to } = req.query;

    const sql = `SELECT id, name,status,queen_category, phone, photo,last_update AS reg_at, note FROM ngf_ecommerce.admin_queens WHERE last_update BETWEEN ? AND ?`;

    const values = [from as string, to as string];

    const data = await this.query.rawQuery(sql, values);

    return { success: true, data };
  };

  // get queen by date range and Status
  public getQueenByDateRangeAndStatus = async (req: Request) => {
    const { status } = req.params;
    const { from, to } = req.query;

    const sql = `SELECT id, name,status,queen_category, phone, photo,last_update AS reg_at, note FROM ngf_ecommerce.admin_queens WHERE status = ? AND last_update BETWEEN ? AND ?`;

    const values = [status, from as string, to as string];

    const data = await this.query.rawQuery(sql, values);

    return { success: true, data };
  };

  // get queen by date
  public getQueenByDate = async (req: Request) => {
    const { date } = req.query;

    const sql = `SELECT id, name,status,queen_category, phone, photo, last_update AS reg_at, note FROM ngf_ecommerce.admin_queens WHERE date(last_update) = ?`;

    const values = [date as string];

    const data = await this.query.rawQuery(sql, values);

    return { success: true, data };
  };

  // get queen by date and status
  public getQueenByDateAndStatus = async (req: Request) => {
    const { status } = req.params;
    const { date } = req.query;

    const sql = `SELECT id, name,status, phone, queen_category, photo, last_update AS reg_at, note FROM ngf_ecommerce.admin_queens WHERE status = ? AND date(last_update) = ?`;

    const values = [status, date as string];

    const data = await this.query.rawQuery(sql, values);

    return { success: true, data };
  };

  // get all queen by queen category and status and all
  public getQueenByQueenCategoryStatusAll = async (req: Request) => {
    const { limit, skip } = req.query;
    const { status, category } = req.params;

    console.log({ status, category, limit, skip });
    const fields = [
      'id',
      'name',
      'phone',
      'photo',
      'status',
      'note',
      'queen_category',
    ];

    let where: any = null;

    if (
      category !== 'all' &&
      status !== 'all' &&
      category !== 'All' &&
      status !== 'All'
    ) {
      where = {
        and: [
          { table: 'admin_queens', field: 'status', value: `'${status}'` },
          {
            table: 'admin_queens',
            field: 'queen_category',
            value: `'${category}'`,
          },
        ],
      };
    } else {
      if (category !== 'all' && category !== 'All') {
        where = {
          table: 'admin_queens',
          field: 'queen_category',
          value: `'${category}'`,
        };
      }

      if (status !== 'all' && status !== 'All') {
        where = {
          table: 'admin_queens',
          field: 'status',
          value: `'${status}'`,
        };
      }
    }
    let forCuntSql = `SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens`;
    let countArr: string[] = [];
    let data = [];

    if (where) {
      data = await this.query.select({
        fields: { columns: fields, as: [['last_update', 'reg_at']] },
        table: 'admin_queens',
        where,
        limit: { limit: limit as string, skip: Number(skip) || 0 },
        orderBy: { table: 'admin_queens', field: 'last_update' },
        desc: true,
      });

      if (where?.field === 'queen_category') {
        forCuntSql = `SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens where admin_queens.queen_category = ? `;
        countArr.push(category);
      } else if (where?.field === 'status') {
        forCuntSql = `SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens where admin_queens.status = ? `;
        countArr.push(status);
      } else {
        forCuntSql = `SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens where admin_queens.queen_category = ? and admin_queens.status = ?`;
        countArr.push(category);
        countArr.push(status);
      }
    } else {
      data = await this.query.select({
        fields: { columns: fields, as: [['last_update', 'reg_at']] },
        table: 'admin_queens',
        limit: { limit: limit as string, skip: Number(skip) || 0 },
        orderBy: { table: 'admin_queens', field: 'last_update' },
        desc: true,
      });
    }

    const count = await this.query.rawQuery(forCuntSql, countArr);

    return {
      success: true,
      data: data,
      total: (count as RowDataPacket)[0].total,
    };
  };
}

export default AdminQueensServices;
