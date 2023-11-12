import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import AbstractServices from '../../../abstracts/abstractServices';
import { TCredType } from '../../../common/utils/commonTypes/types';
import RequireOtp from '../../services/otpServices/requireOtp';
import OrderDetails from './insertOrder';

interface TOrder {
  delivery_address: string;
  queen_id: string;
  customer_id?: number;
}

class OrderServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * createOrder
   */
  public async createOrder(req: Request) {
    const {
      customer_id,
      delivery_address,
      order_details,
      guest,
      guest_info,
      otp_creds,
    } = req.body;

    console.log(req.body);

    return await this.transaction.beginTransaction(async (query) => {
      const order: TOrder = {
        delivery_address,
        queen_id: order_details[0].queen_id,
      };

      if (guest === 1) {
        const valid = await new RequireOtp(otp_creds).requireOtp();
        console.log({ valid });

        if (valid) {
          const guest = await query.select({
            table: 'customers',
            fields: { columns: ['id', 'guest'] },
            where: {
              table: 'customers',
              field: 'phone',
              value: guest_info.phone,
            },
          });

          if (guest.length < 1) {
            const guestCustomer = await query.insert('customers', {
              ...guest_info,
              guest: 1,
            });

            order.customer_id = guestCustomer.insertId;
          } else {
            const isGuest = guest[0].guest;
            const id = guest[0].id;

            await query.update({
              table: 'customers',
              data: { ...guest_info, guest: isGuest },
              where: { id },
            });

            order.customer_id = id;
          }
        }
      } else {
        order.customer_id = customer_id;
      }

      const data = await new OrderDetails().insert(query, order, order_details);
      if (data.success) {
        const newOrder = await query.select({
          table: 'orders',
          fields: {
            columns: ['delivery_address', 'status', 'id', 'order_date'],
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
          where: { table: 'orders', field: 'id', value: data.orderId },
        });
        return {
          success: true,
          message: 'Order successfull',
          data: newOrder[0],
        };
      } else {
        return { success: false };
      }
    });
  }

  /**
   * getAQueensAllOrders
   */
  public async getAQueensAllOrders(req: Request) {
    const { queen_id } = req.params;

    const data = await this.query.select({
      table: 'order_details',
      fields: {
        columns: ['order_id', 'product_name', 'product_id', 'quantity'],
        otherFields: [
          { table: 'customers', as: [['name', 'customer_name']] },
          {
            table: 'orders',
            columns: [
              'customer_id',
              'delivery_address',
              'order_date',
              'status',
            ],
          },
          {
            table: 'admin_products',
            columns: [
              'product_picture_1',
              'product_picture_2',
              'price',
              'short_desc',
            ],
          },
        ],
      },
      join: [
        {
          join: { table: 'orders', field: 'id' },
          on: { table: 'order_details', field: 'order_id' },
        },
        {
          join: { table: 'customers', field: 'id' },
          on: { table: 'orders', field: 'customer_id' },
        },
        {
          join: { table: 'admin_products', field: 'id' },
          on: { table: 'order_details', field: 'product_id' },
        },
      ],

      where: { table: 'order_details', field: 'queen_id', value: queen_id },
    });

    return { success: true, data };
  }

  //  get a queen all order by status
  public async getAQueensAllOrderByStatus(req: Request) {
    const { queen_id, status } = req.params;

    const data = await this.query.select({
      table: 'order_details',
      fields: {
        columns: ['order_id', 'product_name', 'product_id', 'quantity'],
        otherFields: [
          { table: 'customers', as: [['name', 'customer_name']] },
          {
            table: 'orders',
            columns: [
              'customer_id',
              'delivery_address',
              'order_date',
              'status',
            ],
          },
          {
            table: 'admin_products',
            columns: [
              'product_picture_1',
              'product_picture_2',
              'price',
              'short_desc',
            ],
          },
        ],
      },
      join: [
        {
          join: { table: 'orders', field: 'id' },
          on: { table: 'order_details', field: 'order_id' },
        },
        {
          join: { table: 'customers', field: 'id' },
          on: { table: 'orders', field: 'customer_id' },
        },
        {
          join: { table: 'admin_products', field: 'id' },
          on: { table: 'order_details', field: 'product_id' },
        },
      ],

      where: {
        and: [
          { table: 'order_details', field: 'queen_id', value: queen_id },
          { table: 'orders', field: 'status', value: `'${status}'` },
        ],
      },
    });

    return { success: true, data };
  }

  /**
   * getACustomersAllOrders
   */
  public async getACustomersAllOrders(req: Request) {
    const { customer_id, status } = req.params;

    const query: TCredType = {
      table: 'order_details',
      fields: {
        columns: [
          'order_id',
          'delivery_date',
          'product_name',
          'product_category',
          'price',
          'quantity',
          'delivered',
          'canceled',
          'product_id',
        ],
        otherFields: [
          {
            table: 'admin_products',
            as: [['product_picture_1', 'product_picture']],
          },
          {
            table: 'orders',
            columns: ['order_date', 'delivery_address', 'canceled', 'status'],
          },
        ],
      },
      join: [
        {
          join: { table: 'orders', field: 'id' },
          on: { table: 'order_details', field: 'order_id' },
        },
        {
          join: { table: 'admin_products', field: 'id' },
          on: { table: 'order_details', field: 'product_id' },
        },
      ],
    };

    if (status === 'all') {
      query.where = {
        table: 'orders',
        field: 'customer_id',
        value: customer_id,
      };
    } else {
      query.where = {
        and: [
          {
            table: 'orders',
            field: 'customer_id',
            value: customer_id,
          },
          {
            table: 'orders',
            field: 'status',
            value: `'${status}'`,
          },
        ],
      };
    }

    const data = await this.query.select(query);

    return { success: true, data };
  }

  /**
   * getAllOrders
   */
  public async getAllOrders(req: Request) {
    const { limit, skip } = req.query;
    const data = await this.query.select({
      table: 'orders',
      fields: {
        columns: ['id', 'delivery_address', 'status', 'order_date'],
        otherFields: [{ table: 'customers', as: [['name', 'customer_name']] }],
      },
      join: [
        {
          join: { table: 'customers', field: 'id' },
          on: { table: 'orders', field: 'customer_id' },
        },
      ],
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      orderBy: { table: 'orders', field: 'order_date' },
      desc: true,
    });

    const forCount =
      'SELECT count(ngf_ecommerce.orders.id) as total FROM ngf_ecommerce.orders';

    const count: any = await this.query.rawQuery(forCount);
    return { success: true, total: count[0].total, data: data };
  }

  /**
   * getAllOrders by status
   */
  public async getAllOrdersByStatus(req: Request) {
    const { limit, skip } = req.query;
    const { status } = req.params;
    const data = await this.query.select({
      table: 'orders',
      fields: {
        columns: ['id', 'delivery_address', 'status', 'order_date'],
        otherFields: [{ table: 'customers', as: [['name', 'customer_name']] }],
      },
      where: { table: 'orders', field: 'status', value: `'${status}'` },
      join: [
        {
          join: { table: 'customers', field: 'id' },
          on: { table: 'orders', field: 'customer_id' },
        },
      ],
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      orderBy: { table: 'orders', field: 'order_date' },
      desc: true,
    });

    const forCount =
      'SELECT count(ngf_ecommerce.orders.id) as total FROM ngf_ecommerce.orders where ngf_ecommerce.orders.status=?';
    const count: any = await this.query.rawQuery(forCount, [status]);
    return { success: true, total: count[0].total, data: data };
  }

  /**
   * getAllOrders by status or date
   */
  public async getAllOrdersByStatusOrDate(req: Request) {
    const { limit, skip, from, to } = req.query;
    const { status } = req.params;
    console.log(status);

    let values: any = [from, to];
    let totalValues: string[] = [];

    // initial get order by status all
    let sql = `SELECT orders.id,orders.order_date,orders.status,orders.note,customers.name as customer_name FROM ngf_ecommerce.orders join ngf_ecommerce.customers on orders.customer_id = customers.id  order by order_date desc limit ${limit} offset ${skip}`;

    let totalSql = `SELECT count(orders.id) as total FROM ngf_ecommerce.orders`;

    if (status === 'all' && from && to) {
      values = [from, to];

      totalValues.push(from as string, to as string);

      sql = `SELECT orders.id,orders.order_date,orders.status,orders.note,customers.name as customer_name FROM ngf_ecommerce.orders join ngf_ecommerce.customers on orders.customer_id = customers.id where orders.order_date between ? and ? order by order_date desc limit ${limit} offset ${skip}`;

      totalSql = `SELECT count(orders.id) as total FROM ngf_ecommerce.orders where orders.order_date between ? and ?`;
    }

    if (status !== 'all' && from && to) {
      values = [status, ...values];
      totalValues.push(status, from as string, to as string);

      sql = `SELECT orders.id,orders.order_date,orders.status,orders.note,customers.name as customer_name FROM ngf_ecommerce.orders join ngf_ecommerce.customers on orders.customer_id = customers.id where orders.status= ? and orders.order_date between ? and ? order by order_date desc limit ${limit} offset ${skip}`;

      totalSql = `SELECT count(orders.id) as total FROM ngf_ecommerce.orders where orders.status=? and orders.order_date between ? and ? `;
    }

    if (status !== 'all' && !from) {
      values = [status, ...values];
      totalValues.push(status);

      sql = `SELECT orders.id,orders.order_date,orders.status,orders.note,customers.name as customer_name FROM ngf_ecommerce.orders join ngf_ecommerce.customers on orders.customer_id = customers.id where orders.status= ? order by order_date desc limit ${limit} offset ${skip}`;

      totalSql = `SELECT count(orders.id) as total FROM ngf_ecommerce.orders where orders.status=?`;
    }

    const data = await this.query.rawQuery(sql, values);
    const total = (await this.query.rawQuery(
      totalSql,
      totalValues
    )) as RowDataPacket[];

    return { success: true, data: data, total: total[0].total };
  }

  /**
   * getAOrder
   */
  public async getAOrder(req: Request) {
    const { id } = req.params;

    return this.transaction.beginTransaction(async (query) => {
      const order = await query.select({
        table: 'orders',
        fields: {
          columns: [
            'delivery_address',
            'status',
            'queen_id',
            'note',
            'order_date',
          ],
          as: [['id', 'order_id']],

          otherFields: [
            {
              table: 'customers',
              as: [
                ['name', 'customer_name'],
                ['phone', 'customer_phone'],
              ],
            },
          ],
        },
        join: [
          {
            join: { table: 'customers', field: 'id' },
            on: { table: 'orders', field: 'customer_id' },
          },
        ],
        where: { table: 'orders', field: 'id', value: id },
      });

      const order_details = await query.select({
        table: 'order_details',
        fields: {
          columns: [
            'order_id',
            'product_name',
            'product_category',
            'product_id',
            'price',
            'quantity',
            'delivery_date',
          ],
          as: [['id', 'order_id']],
          otherFields: [
            {
              table: 'admin_queens',
              as: [
                ['name', 'queen_name'],
                ['photo', 'queen_photo'],
              ],
            },
          ],
        },
        join: [
          {
            join: { table: 'admin_queens', field: 'id' },
            on: { table: 'order_details', field: 'queen_id' },
          },
        ],
        where: { table: 'order_details', field: 'order_id', value: id },
      });

      return { success: true, data: { ...order[0], order_details } };
    });
  }

  // get an orders all products
  public async getAnOrdersAllProducts(req: Request) {
    const { id } = req.params;

    const products = await this.query.select({
      table: 'order_details',
      fields: {
        columns: [
          'queen_id',
          'product_name',
          'product_category',
          'product_id',
          'price',
          'quantity',
          'delivery_date',
        ],
        otherFields: [
          {
            table: 'admin_queens',
            as: [['name', 'queen_name']],
          },
        ],
      },
      join: [
        {
          join: { table: 'admin_queens', field: 'id' },
          on: { table: 'order_details', field: 'queen_id' },
        },
      ],
      where: { table: 'order_details', field: 'order_id', value: Number(id) },
    });

    if (products.length) {
      return {
        success: true,
        data: products,
      };
    } else {
      return {
        success: false,
        message: 'No products found with this id',
      };
    }
  }

  // get an order status for tracking
  public async getOrderStatusTrack(req: Request) {
    const { id } = req.params;
    const { phone } = req.query;

    const status = await this.query.select({
      table: 'orders',
      fields: {
        columns: ['status'],
        as: [['id', 'order_id']],
      },
      join: [
        {
          join: { table: 'customers', field: 'id' },
          on: { table: 'orders', field: 'customer_id' },
        },
      ],
      where: {
        and: [
          { table: 'orders', field: 'id', value: id },
          { table: 'customers', field: 'phone', value: phone as string },
        ],
      },
    });

    if (status.length) {
      return { success: true, data: status[0] };
    } else {
      return { success: false };
    }
  }

  /**
   * updateOrderStatus
   */
  public async updateOrderStatus(req: Request) {
    const { id } = req.params;
    const { status, note } = req.body;

    await this.query.update({
      table: 'orders',
      data: { status, note },
      where: { id },
    });

    return { success: true, message: 'Order status successfully updated' };
  }
}

export default OrderServices;
