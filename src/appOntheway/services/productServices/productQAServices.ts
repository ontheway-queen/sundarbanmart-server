import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import AbstractServices from '../../../abstracts/abstractServices';

class productQAService extends AbstractServices {
  constructor() {
    super();
  }

  // ask a question service
  public async askQuestionService(req: Request) {
    const result = await this.query.insert('product_qa', req.body);

    if (result.affectedRows) {
      return { success: true, data: { id: result.insertId } };
    } else {
      return { success: false };
    }
  }

  // get all questions services for client
  public async getAllQuestionServiceClient(req: Request, by: string) {
    const { id } = req.params;
    const { limit, skip } = req.query;
    const table: string = 'product_qa';

    const data = await this.query.select({
      table,
      fields: {
        columns: ['id', 'question', 'answer'],
        otherFields: [
          by === 'customer'
            ? {
                table: 'admin_products',
                as: [
                  ['id', 'product'],
                  ['product_name', 'product_name'],
                  ['q_date', 'question_date'],
                ],
              }
            : {
                table: 'customers',
                as: [['name', 'customer_name']],
              },
        ],
      },
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      join: [
        {
          join: { table: 'admin_products', field: 'id' },
          on: { table, field: 'product' },
        },
        {
          join: { table: 'customers', field: 'id' },
          on: { table, field: 'customer' },
        },
      ],
      where: {
        and: [
          { table, field: 'status', value: "'live'" },
          { table, field: by, value: id },
        ],
      },
      orderBy: { table, field: 'q_date' },
      desc: true,
    });

    const sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.status = 'live' and product_qa. ?? = ?`;

    const total = await this.query.rawQuery(sql, [by, id]);

    return { success: true, total: (total as RowDataPacket)[0].total, data };
  }

  // get all questions services for admin panel
  public async getAllQuestionServiceAdmin(req: Request) {
    const { type } = req.params;
    const { limit, skip } = req.query;
    const table: string = 'product_qa';
    const columns = ['id', 'question', 'q_date'];

    if (type === 'deleted') {
      columns.push('deleted_by');
      columns.push('answer');
    }
    if (type === 'answered') {
      columns.push('a_date');
      columns.push('answer');
    }
    const data = await this.query.select({
      table,
      fields: {
        columns,
        otherFields: [
          {
            table: 'admin_products',
            as: [
              ['id', 'product'],
              ['product_name', 'product_name'],
              ['product_picture_1', 'product_photo'],
            ],
          },
          {
            table: 'customers',
            as: [
              ['id', 'customer'],
              ['name', 'customer_name'],
            ],
          },
        ],
      },
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      join: [
        {
          join: { table: 'admin_products', field: 'id' },
          on: { table, field: 'product' },
        },
        {
          join: { table: 'customers', field: 'id' },
          on: { table, field: 'customer' },
        },
      ],
      where: {
        and:
          type === 'deleted'
            ? [
                {
                  table,
                  field: 'status',
                  value: "'disabled'",
                },
              ]
            : [
                {
                  table,
                  field: 'answer',
                  value: type === 'answered' ? 'not null' : 'null',
                  compare: 'is',
                },
                {
                  table,
                  field: 'status',
                  value: "'live'",
                },
              ],
      },
      orderBy: { table, field: 'q_date' },
      desc: true,
    });

    let sql: string = '';

    if (type === 'deleted') {
      sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.status = 'disabled'`;
    } else if (type === 'answered') {
      sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.status = 'live' and product_qa.answer is not null`;
    } else {
      sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.status = 'live' and product_qa.answer is null`;
    }

    const total = await this.query.rawQuery(sql);

    return { success: true, total: (total as RowDataPacket)[0].total, data };
  }

  // get all questions of a single product for admin
  public async getAllQuestionOfProductForAdmin(req: Request) {
    const { id } = req.params;
    const { skip, limit } = req.query;
    const table: string = 'product_qa';
    const columns = ['id', 'question', 'answer', 'deleted_by', 'status'];

    const data = await this.query.select({
      table,
      fields: {
        columns,
        otherFields: [
          {
            table: 'admin_products',
            as: [
              ['id', 'product'],
              ['product_name', 'product_name'],
              ['q_date', 'question_date'],
              ['a_date', 'answer_date'],
            ],
          },
          {
            table: 'customers',
            as: [
              ['id', 'customer'],
              ['name', 'customer_name'],
            ],
          },
        ],
      },
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      join: [
        {
          join: { table: 'admin_products', field: 'id' },
          on: { table, field: 'product' },
        },
        {
          join: { table: 'customers', field: 'id' },
          on: { table, field: 'customer' },
        },
      ],
      where: { table, field: 'product', value: id },
      orderBy: { table, field: 'q_date' },
      desc: true,
    });

    let sql: string = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.product = ?`;

    const total = await this.query.rawQuery(sql, [id]);

    return { success: true, total: (total as RowDataPacket)[0].total, data };
  }

  // update a question by admin or customer
  public async updateQuestion(req: Request) {
    const { id, by } = req.params;
    let data = req.body;
    if (by) {
      data = { status: 'disabled', deleted_by: by };
    }
    const result = await this.query.update({
      table: 'product_qa',
      data,
      where: { id },
    });

    return {
      success: true,
      msg: by
        ? 'Question deleted successfully'
        : 'Question Answered successflly!',
    };
  }
}

export default productQAService;
