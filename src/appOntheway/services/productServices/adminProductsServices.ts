import { Request } from 'express';
import { TRowDataPacket } from '../../../common/utils/commonTypes/types';
import AbstractServices from '../../../abstracts/abstractServices';
import { RowDataPacket } from 'mysql2';

type TProductI = {
  product_name: string;
  category: string;
  price: string;
  stock_status: number;
  delivery_day: string;
  short_desc: string;
  queen_id: string;
  status: string;
  tags: string;
  weight: string;
  product_picture_1?: string;
  product_picture_2?: string;
};

class AdminProductServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * updateProduct
   */

  public async updateProduct(req: Request) {
    const reqFiles = (req.files as Express.Multer.File[]) || [];

    return await this.transaction.beginTransaction(async (query) => {
      const { id } = req.params;

      const product_picture_1 = reqFiles[0] && reqFiles[0].filename;
      const product_picture_2 = reqFiles[1] && reqFiles[1].filename;
      const firstProduct: string = reqFiles[0] && reqFiles[0].fieldname;
      const secondProduct: string = reqFiles[1] && reqFiles[1].fieldname;

      const updatedImgs: {
        product_picture_1?: string;
        product_picture_2?: string;
      } = {};

      if (firstProduct === 'product_picture_1') {
        updatedImgs.product_picture_1 = product_picture_1;
      } else if (firstProduct === 'product_picture_2') {
        updatedImgs.product_picture_2 = product_picture_1;
      }

      if (secondProduct === 'product_picture_2') {
        updatedImgs.product_picture_2 = product_picture_2;
      }

      const fieldsName = [];
      for (let i = 0; i < reqFiles.length; i++) {
        fieldsName.push(reqFiles[i].fieldname);
      }

      const {
        product_name,
        category,
        price,
        delivery_day,
        short_desc,
        queen_id,
        stock_status,
        status,
        tags,
        weight,
      } = req.body;

      const productInfo: TProductI = {
        product_name,
        category,
        price,
        delivery_day,
        stock_status,
        short_desc,
        queen_id,
        status,
        tags,
        weight,
      };

      if (fieldsName.includes('product_picture_1')) {
        productInfo.product_picture_1 = product_picture_1;

        this.deleteFile.delete('products', req.body.prev_1);
      }

      if (fieldsName.includes('product_picture_2')) {
        productInfo.product_picture_2 = product_picture_2 || product_picture_1;

        this.deleteFile.delete('products', req.body.prev_2);
      }

      await query.update({
        table: 'admin_products',
        data: productInfo,
        where: { id },
      });

      const repVals = [
        'queen_id',
        'product_name',
        'category',
        'product_picture_1',
        'product_picture_2',
        'delivery_day',
        'short_desc',
        'price',
        'tags',
        'upload_date',
        'stock_status',
        'weight',
      ];

      if (req.body.status === 'Approved') {
        await query.replace({
          replace: [...repVals, 'admin_products_id'],
          into: 'products',
          select: [...repVals, 'id'],
          from: 'admin_products',
          where: { id },
        });
      } else {
        await query.delete({
          table: 'products',
          where: { admin_products_id: id },
        });
      }

      if (updatedImgs.product_picture_1 || updatedImgs.product_picture_2) {
        return {
          success: true,
          message: 'Product Successfully updated',
          updatedImgs,
        };
      } else {
        return {
          success: true,
          message: 'Product Successfully updated',
        };
      }
    });
  }

  // get all product by date range and or status and or category
  public async getAllProductByDateRangeStatusCategory(req: Request) {
    const { from, to } = req.query;
    const { status, category } = req.params;

    let values: any = [from, to];

    let totalValues: string[] = [from as string, to as string];

    let sql = `SELECT admin_products.id, admin_products.status, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_products.category, admin_queens.id as queen_id, admin_queens.name as queen_name FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id = admin_products.queen_id where admin_products.upload_date between ? and ? order by upload_date desc `;

    let totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.upload_date between ? and ?`;

    if (status !== 'all') {
      values = [status, ...values];
      totalValues.push(status);
      sql = `SELECT admin_products.id, admin_products.status, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_products.category, admin_queens.id as queen_id, admin_queens.name as queen_name FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id = admin_products.queen_id where admin_products.status = ? and admin_products.upload_date between ? and ? order by upload_date desc  `;

      totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.upload_date between ? and ? and admin_products.status = ? `;
    }

    if (category !== 'all') {
      values = [category, ...values];
      totalValues.push(category);
      sql = `SELECT admin_products.id, admin_products.status, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_products.category, admin_queens.id as queen_id, admin_queens.name as queen_name FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id = admin_products.queen_id where admin_products.category = ? and admin_products.upload_date between ? and ? order by upload_date desc  `;

      totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.upload_date between ? and ? and admin_products.category = ? `;
    }

    if (category !== 'all' && status !== 'all') {
      sql = `SELECT admin_products.id, admin_products.status, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_products.category, admin_queens.id as queen_id, admin_queens.name as queen_name FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id = admin_products.queen_id where admin_products.category = ? and admin_products.status = ? and admin_products.upload_date between ? and ? order by upload_date desc  `;

      totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.upload_date between ? and ? and admin_products.status = ? and admin_products.category = ? `;
    }

    const data = await this.query.rawQuery(sql, values);
    const total = (await this.query.rawQuery(
      totalSql,
      totalValues
    )) as RowDataPacket[];

    return {
      success: true,
      data,
      total: total[0].total,
    };
  }

  // approve update product
  public async approveUpdateProduct(req: Request) {
    return this.transaction.beginTransaction(async (query) => {
      const { id } = req.params;

      const [data] = await query.select({
        table: 'update_products',
        fields: {
          columns: [
            'product_name',
            'category',
            'product_picture_1',
            'product_picture_2',
            'price',
            'delivery_day',
            'short_desc',
            'tags',
            'delivery_charge',
            'stock_status',
            'weight',
          ],
        },
        where: { table: 'update_products', field: 'product_id', value: id },
      });

      if (data?.product_name) {
        Object.keys(data).forEach((item) => {
          if (data[item] === null) {
            delete data[item];
          }
        });

        const product = await query.select({
          table: 'admin_products',
          fields: {
            columns: ['status', 'product_picture_2', 'product_picture_1'],
          },
          where: { table: 'admin_products', field: 'id', value: id },
        });

        const {
          status,
          product_picture_1: prev_1,
          product_picture_2: prev_2,
        } = product[0] || {};

        await query.update({
          table: 'admin_products',
          data,
          where: { id },
        });

        if (status === 'Approved') {
          await query.update({
            table: 'products',
            data,
            where: { admin_products_id: id },
          });
        }

        if (data.product_picture_1) {
          this.deleteFile.delete('products', prev_1);
        }

        if (data.product_picture_2) {
          this.deleteFile.delete('products', prev_2);
        }
        await query.delete({
          table: 'update_products',
          where: { product_id: id },
        });

        return {
          success: true,
          message: 'Product update approved successfully!',
        };
      } else {
        return {
          success: false,
          message: 'No update pending product with this id',
        };
      }
    });
  }

  // reject update product
  public async rejectUpdateProduct(req: Request) {
    const { id } = req.params;
    const { product_picture_1, product_picture_2 } = req.body;

    await this.query.delete({
      table: 'update_products',
      where: { product_id: id },
    });

    if (product_picture_1) {
      this.deleteFile.delete('products', product_picture_1);
    }

    if (product_picture_2) {
      this.deleteFile.delete('products', product_picture_2);
    }

    return { success: true, message: 'Update Product rejected successfully' };
  }

  // get all pending update product
  public async getAllPendingUpdateProduct(_req: Request) {
    const data = (await this.query.rawQuery(
      'SELECT * FROM ngf_ecommerce.update_products'
    )) as RowDataPacket[];

    return { success: true, data, total: data.length };
  }

  // get a queen all pending update product
  public async getAllPendingUpdateProductOfQueen(req: Request) {
    const { id } = req.params;
    const data = await this.query.rawQuery(
      'SELECT * FROM ngf_ecommerce.update_products WHERE update_products.queen_id= ?',
      [id]
    );
    return { success: true, data };
  }

  // get a single product update
  public async getASingleProductUpdate(req: Request) {
    const { id } = req.params;

    const data = (await this.query.rawQuery(
      'SELECT * FROM ngf_ecommerce.update_products WHERE update_products.product_id= ?',
      [id]
    )) as TRowDataPacket;
    if (data.length) {
      return { success: true, data: data[0] };
    } else {
      return { success: true, message: 'No pending request of this product' };
    }
  }
}

export default AdminProductServices;
