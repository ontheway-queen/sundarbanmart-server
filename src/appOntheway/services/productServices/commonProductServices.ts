import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstractServices';
import {
  TCredType,
  TRaw,
  TWhere,
} from '../../../common/utils/commonTypes/types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class CommonProductServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * getAQueensAllProducts
   */
  public async getAQueensAllProducts(table: string, req: Request) {
    const { queen_id: id } = req.params;

    const commons = [
      'product_name',
      'product_picture_1',
      'product_picture_2',
      'price',
      'category',
      'tags',
      'weight',
      'delivery_day',
      'stock_status',
    ];

    let fields;
    let where;

    if (table === 'admin_products') {
      fields = { columns: [...commons, 'id', 'status', 'short_desc'] };
    } else {
      fields = {
        columns: commons,
        as: [['admin_products_id', 'id']] as [string, string][],
      };
    }

    if (req.andro) {
      where = {
        and: [
          { table, field: 'queen_id', value: id, compare: '=' },
          { table, field: 'status', value: "'Disabled'", compare: '!=' },
        ],
      } as TWhere;
    } else {
      where = { table, field: 'queen_id', value: id };
    }

    const products = await this.query.select({
      fields: {
        ...fields,
        otherFields: [{ table: 'admin_queens', as: [['photo', 'queen_dp']] }],
      },
      table,
      where,
      join: [
        {
          join: { table: 'admin_queens', field: 'id' },
          on: { table, field: 'queen_id' },
        },
      ],

      orderBy: { table, field: 'upload_date' },
      desc: true,
    });

    return { success: true, data: products };
  }

  /**
   * getAProducts
   */
  public async getAProduct(table: string, req: Request) {
    const { id } = req.params;
    if (table === 'products') {
      const sql = `SELECT admin_products.id as product_id, upload_date, admin_products.product_name, admin_products.category, admin_products.short_desc,admin_products.weight, admin_products.product_picture_1,admin_products.product_picture_2, admin_products.price, admin_products.delivery_day, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating, count(rating.id) as rating_count FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.status='approved' and  admin_products.id = ?`;
      const data = (await this.query.rawQuery(sql, [id])) as RowDataPacket[];

      if (data[0].product_id) {
        return { success: true, data: data[0] };
      } else {
        return {
          success: false,
          message: 'No product found with this id',
        };
      }
    } else {
      const columns = [
        'product_name',
        'category',
        'product_picture_1',
        'product_picture_2',
        'price',
        'delivery_day',
        'short_desc',
        'tags',
        'stock_status',
        'weight',
        'queen_id',
        'id',
        'status',
        'upload_date',
      ];

      const data = await this.query.select({
        table,
        fields: {
          columns,
          ...(table === 'products' && {
            as: [['admin_products_id', 'product_id']],
          }),
          otherFields: [
            {
              table: 'admin_queens',
              as: [['name', 'queen_name']],
            },
          ],
        },
        where: { table, field: 'id', value: id },
        join: [
          {
            join: { table: 'admin_queens', field: 'id' },
            on: { table, field: 'queen_id' },
          },
        ],
      });

      if (data.length) {
        return { success: true, data: data[0] };
      } else {
        return {
          success: false,
          message: 'No product found with this id',
        };
      }
    }
  }

  /**
   * getAllProducts
   */
  public async getAllProducts(req: Request) {
    const { limit, skip } = req.query;

    const columns = [
      'id',
      'product_name',
      'product_picture_1',
      'status',
      'price',
      'stock_status',
      'category',
    ];

    const products = await this.query.select({
      table: 'admin_products',
      fields: {
        columns,
        otherFields: [
          {
            table: 'admin_queens',
            as: [
              ['id', 'queen_id'],
              ['name', 'queen_name'],
            ],
          },
        ],
      },
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      join: [
        {
          join: { table: 'admin_queens', field: 'id' },
          on: { table: 'admin_products', field: 'queen_id' },
        },
      ],

      orderBy: { table: 'admin_products', field: 'upload_date' },
      desc: true,
    });

    const forCount =
      'SELECT count(ngf_ecommerce.admin_products.id) as total FROM ngf_ecommerce.admin_products';
    const count: any = await this.query.rawQuery(forCount);
    return {
      success: true,
      data: products,
      total: count[0].total,
    };
  }

  // get all products by status
  public async getAllProductsByStatus(req: Request) {
    const { limit, skip } = req.query;
    const { status } = req.params;

    const columns = [
      'id',
      'product_name',
      'product_picture_1',
      'status',
      'price',
      'stock_status',
      'category',
    ];

    const products = await this.query.select({
      table: 'admin_products',
      fields: {
        columns,
        otherFields: [
          {
            table: 'admin_queens',
            as: [
              ['id', 'queen_id'],
              ['name', 'queen_name'],
            ],
          },
        ],
      },
      where: { table: 'admin_products', field: 'status', value: `'${status}'` },
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      join: [
        {
          join: { table: 'admin_queens', field: 'id' },
          on: { table: 'admin_products', field: 'queen_id' },
        },
      ],
      orderBy: { table: 'admin_products', field: 'upload_date' },
      desc: true,
    });

    const forCount =
      'SELECT count(ngf_ecommerce.admin_products.id) as total FROM ngf_ecommerce.admin_products where ngf_ecommerce.admin_products.status= ?';
    const count: any = await this.query.rawQuery(forCount, [status]);
    return {
      success: true,
      data: products,
      total: count[0].total,
    };
  }

  /**
   * deleteProduct
   */
  public async deleteProduct(req: Request) {
    const { id } = req.params;

    return await this.transaction.beginTransaction(async (query) => {
      await query.update({
        table: 'admin_products',
        data: { status: 'Disabled' },
        where: { id },
      });

      await query.delete({
        table: 'products',
        where: { admin_products_id: id },
      });

      return { success: true, message: 'Product successfully deleted' };
    });
  }

  /**
   * getAllProductsByCategory
   */

  public async getAllProductsByCategory(table: string, req: Request) {
    const { category } = req.params;
    const { limit, skip } = req.query;

    let products;

    let columns = [
      'product_name',
      'product_picture_1',
      'price',
      'stock_status',
    ];

    if (table === 'admin_products') {
      columns = [
        'id',
        'product_name',
        'product_picture_1',
        'status',
        'price',
        'stock_status',
        'category',
      ];

      let getQuery: TCredType = {
        table: 'admin_products',
        fields: {
          columns,
          otherFields: [
            {
              table: 'admin_queens',
              as: [
                ['id', 'queen_id'],
                ['name', 'queen_name'],
              ],
            },
          ],
        },
        where: {
          table: table,
          field: 'category',
          value: `'${category}'`,
        },
        limit: { limit: limit as string, skip: Number(skip) || 0 },
        join: [
          {
            join: { table: 'admin_queens', field: 'id' },
            on: { table: 'admin_products', field: 'queen_id' },
          },
        ],
        orderBy: { table: 'admin_products', field: 'upload_date' },
        desc: true,
      };

      if (category === 'recent-product') {
        getQuery = {
          table: 'admin_products',
          fields: {
            columns,
            otherFields: [
              {
                table: 'admin_queens',
                as: [
                  ['id', 'queen_id'],
                  ['name', 'queen_name'],
                ],
              },
            ],
          },
          limit: { limit: limit as string, skip: Number(skip) || 0 },
          join: [
            {
              join: { table: 'admin_queens', field: 'id' },
              on: { table: 'admin_products', field: 'queen_id' },
            },
          ],
          orderBy: { table: 'admin_products', field: 'upload_date' },
          desc: true,
        };
      }
      products = await this.query.select(getQuery);
    } else {
      let sql = `SELECT admin_products.id, admin_products.delivery_day, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.category= ? and admin_products.status = 'approved' group by admin_products.id order by admin_products.upload_date desc limit ? offset ? `;

      if (category === 'recent-product') {
        sql = `SELECT admin_products.id, admin_products.delivery_day, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.status = 'approved' group by admin_products.id order by admin_products.upload_date desc limit ? offset ? `;

        products = await this.query.rawQuery(sql, [
          Number(limit),
          Number(skip),
        ]);
      } else {
        products = await this.query.rawQuery(sql, [
          category,
          Number(limit),
          Number(skip),
        ]);
      }
    }

    let forCount =
      "SELECT count(distinct(admin_products.id)) as total FROM ngf_ecommerce.admin_products where admin_products.category = ? and admin_products.status = 'approved'";

    if (category === 'recent-product') {
      forCount =
        "SELECT count(distinct(admin_products.id)) as total FROM ngf_ecommerce.admin_products where and admin_products.status = 'approved'";
    }

    if (table === 'admin_products') {
      forCount =
        'SELECT count(distinct(ngf_ecommerce.admin_products.id)) as total FROM ngf_ecommerce.admin_products where admin_products.category = ?';

      if (category === 'recent-product') {
        forCount =
          'SELECT count(distinct(ngf_ecommerce.admin_products.id)) as total FROM ngf_ecommerce.admin_products';
      }
    } else {
      if (category === 'recent-product') {
        forCount =
          "SELECT count(distinct(ngf_ecommerce.admin_products.id)) as total FROM ngf_ecommerce.admin_products where admin_products.status = 'approved'";
      }
    }
    let count: any;

    if (category === 'recent-product') {
      count = await this.query.rawQuery(forCount);
    } else {
      count = await this.query.rawQuery(forCount, [category]);
    }

    return {
      success: true,
      data: products,
      total: (count as RowDataPacket)[0].total,
    };
  }

  /**
   * getAllProductsByCategory and status
   */

  public async getAllProductsByCategoryAndStatus(table: string, req: Request) {
    const { category, status } = req.params;
    const { limit, skip } = req.query;

    let products;

    let columns = [
      'product_name',
      'product_picture_1',
      'price',
      'stock_status',
    ];

    if (table === 'admin_products') {
      columns = [
        'id',
        'product_name',
        'product_picture_1',
        'status',
        'price',
        'stock_status',
        'category',
      ];

      products = await this.query.select({
        table: 'admin_products',
        fields: {
          columns,
          otherFields: [
            {
              table: 'admin_queens',
              as: [
                ['id', 'queen_id'],
                ['name', 'queen_name'],
              ],
            },
          ],
        },
        where: {
          and: [
            { table, field: 'category', value: `'${category}'` },
            { table, field: 'status', value: `'${status}'` },
          ],
        },
        limit: { limit: limit as string, skip: Number(skip) || 0 },
        join: [
          {
            join: { table: 'admin_queens', field: 'id' },
            on: { table: 'admin_products', field: 'queen_id' },
          },
        ],

        orderBy: { table: 'admin_products', field: 'upload_date' },
        desc: true,
      });
    } else {
      const sql = `SELECT admin_products.id, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.category= ? and admin_products.status = 'approved' group by admin_products.id order by admin_products.upload_date desc limit ? offset ? `;

      products = await this.query.rawQuery(sql, [
        category,
        Number(limit),
        Number(skip),
      ]);
    }

    if (table === 'admin_products') {
      const forCount =
        'SELECT count(distinct(ngf_ecommerce.admin_products.id)) as total FROM ngf_ecommerce.admin_products where admin_products.category = ? and admin_products.status = ?';
      const count = await this.query.rawQuery(forCount, [category, status]);
      return {
        success: true,
        total: (count as RowDataPacket)[0].total,
        data: products,
      };
    }

    return { success: true, data: products };
  }
}

export default CommonProductServices;
