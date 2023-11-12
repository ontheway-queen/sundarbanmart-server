import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import AbstractServices from '../../../abstracts/abstractServices';

class ProductServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * queenUploadProduct
   */

  public async queenUploadProduct(req: Request) {
    const reqFiles = req.files as Express.Multer.File[];
    const product_picture_1 = reqFiles[0] && reqFiles[0].filename;
    const product_picture_2 = reqFiles[1] && reqFiles[1].filename;

    const productValues = {
      ...req.body,
      product_picture_1,
      product_picture_2,
      tags: `${req.body.category} ${req.body.tags}`,
    };

    return await this.transaction.beginTransaction(async (query) => {
      const data = await query.insert('admin_products', productValues);

      const columns = [
        'id',
        'queen_id',
        'product_name',
        'category',
        'product_picture_1',
        'product_picture_2',
        'price',
        'delivery_day',
        'short_desc',
        'status',
        'tags',
        'weight',
        'stock_status',
      ];

      const response = await query.select({
        table: 'admin_products',
        fields: {
          columns,
          otherFields: [
            {
              table: 'admin_queens',
              as: [
                ['photo', 'queen_photo'],
                ['name', 'queen_name'],
              ],
            },
          ],
        },
        join: [
          {
            join: { table: 'admin_queens', field: 'id' },
            on: { table: 'admin_products', field: 'queen_id' },
          },
        ],
        where: { table: 'admin_products', field: 'id', value: data.insertId },
      });

      return { success: true, data: response[0] };
    });
  }

  /**
   * queenUpdateProduct request
   */

  public async queenRequestUpdateProduct(req: Request) {
    return await this.transaction.beginTransaction(async (query) => {
      const { id } = req.params;
      console.log(req.body, id, req.files);
      const reqFiles = req.files as Express.Multer.File[];
      const product_picture_1 = reqFiles[0] && reqFiles[0];
      const product_picture_2 = reqFiles[1] && reqFiles[1];

      if (product_picture_1) {
        if (product_picture_1.fieldname === 'product_picture_1') {
          req.body.product_picture_1 = product_picture_1.filename;
        } else {
          req.body.product_picture_2 = product_picture_1.filename;
        }
      }

      if (product_picture_2) {
        req.body.product_picture_2 = product_picture_2.filename;
      }

      const data = await query.select({
        table: 'update_products',
        fields: {
          columns: ['product_id', 'product_picture_1', 'product_picture_2'],
        },
        where: { table: 'update_products', field: 'product_id', value: id },
      });

      if (data.length) {
        console.log(req.body);
        const result = await query.update({
          table: 'update_products',
          data: req.body,
          where: { product_id: id },
        });

        if (result.affectedRows) {
          if (req.body.product_picture_1 && data[0].product_picture_1) {
            this.deleteFile.delete('products', data[0].product_picture_1);
          }
          if (req.body.product_picture_2 && data[0].product_picture_2) {
            this.deleteFile.delete('products', data[0].product_picture_2);
          }
        }
      } else {
        req.body.product_id = id;
        const result = await query.insert('update_products', req.body);
      }
      return {
        success: true,
        data: { ...req.body, product_id: id },
        message: 'Product update request send successfully!',
      };
    });
  }

  /**
   * getAllApprovedProducts
   */
  public async getAllApprovedProducts(req: Request) {
    const { limit, skip } = req.query;

    const sql = `SELECT admin_products.id, admin_products.delivery_day, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.status='approved' group by admin_products.id order by admin_products.upload_date desc limit ? offset ? `;

    const totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.status = 'Approved'`;

    const data = await this.query.rawQuery(sql, [Number(limit), Number(skip)]);
    const total = (await this.query.rawQuery(totalSql, [])) as RowDataPacket[];
    return { success: true, data, total: total[0].total };
  }

  /**
   * searchProducts
   */
  public async searchProducts(req: Request) {
    const { search, limit, skip } = req.query;
    const data = await this.query.search(
      search as string,
      limit as string,
      skip as string
    );
    return { success: true, ...data };
  }
}

export default ProductServices;
