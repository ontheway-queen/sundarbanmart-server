import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import AbstractServices from '../../../abstracts/abstractServices';

class productRatingServices extends AbstractServices {
  constructor() {
    super();
  }

  // add a product rating service
  public async addProductRating(req: Request) {
    const reqFiles = req.files as Express.Multer.File[];
    const rating_pic1 = reqFiles[0] && reqFiles[0].filename;
    const rating_pic2 = reqFiles[1] && reqFiles[1].filename;
    const rating_pic3 = reqFiles[2] && reqFiles[2].filename;
    const ratingData = { ...req.body, rating_pic1, rating_pic2, rating_pic3 };

    const check = await this.query.select({
      table: 'rating',
      fields: { columns: ['id'] },
      where: {
        and: [
          { table: 'rating', field: 'product', value: ratingData.product },
          { table: 'rating', field: 'rater', value: ratingData.rater },
        ],
      },
    });

    if (check.length) {
      return {
        success: false,
        msg: 'User Already added review to this product',
      };
    } else {
      await this.query.insert('rating', ratingData);
      return { success: true, msg: 'Review added successfully' };
    }
  }

  // get a single product all rating/review details
  public async getProductRatings(req: Request) {
    const { product } = req.params;
    const { skip, limit } = req.query;

    const ratings = await this.query.select({
      table: 'rating',
      fields: {
        columns: [
          'id',
          'comment',
          'rating',
          'rating_pic1',
          'rating_pic2',
          'rating_pic3',
          'createdAt',
        ],
        otherFields: [
          {
            table: 'customers',
            as: [['name', 'rater_name']],
          },
        ],
      },
      limit: { limit: limit as string, skip: Number(skip) || 0 },
      where: { table: 'rating', field: 'product', value: product },
      join: [
        {
          join: { table: 'customers', field: 'id' },
          on: { table: 'rating', field: 'rater' },
        },
      ],
      orderBy: { table: 'rating', field: 'createdAt' },
      desc: true,
    });

    const sql = `select count(rating.id) as total from ngf_ecommerce.rating where rating.product =  ?`;

    const total = await this.query.rawQuery(sql, [product]);

    return {
      success: true,
      total: (total as RowDataPacket)[0].total,
      data: ratings,
    };

    return { success: true, data: ratings };
  }

  // get a customer all rating/review details
  public async getCustomerRatings(req: Request) {
    const { rater } = req.params;

    const ratings = await this.query.select({
      table: 'rating',
      fields: {
        columns: [
          'id',
          'comment',
          'rating',
          'rating_pic1',
          'rating_pic2',
          'rating_pic3',
        ],
        as: [['createdAt', 'date']],
        otherFields: [
          {
            table: 'admin_products',
            as: [
              ['id', 'product_id'],
              ['product_name', 'product'],
            ],
          },
        ],
      },
      where: { table: 'rating', field: 'rater', value: rater },
      join: [
        {
          join: { table: 'admin_products', field: 'id' },
          on: { table: 'rating', field: 'product' },
        },
      ],
    });

    return { success: true, data: ratings };
  }

  // delete a rating/review service
  public async deleteRating(req: Request) {
    const { rating } = req.params;
    const result = await this.query.delete({
      table: 'rating',
      where: { id: rating },
    });

    if (result.affectedRows) {
      return { success: true, msg: 'Reting deleted successfully' };
    } else {
      return { success: false, msg: 'Wrong rating id!' };
    }
  }

  // check rating of a customer and product
  public async checkRatingOfCustomer(req: Request) {
    const { product, customer } = req.params;
    const result = await this.query.select({
      table: 'rating',
      fields: {
        columns: ['id'],
      },
      where: {
        and: [
          { table: 'rating', field: 'rater', value: customer },
          { table: 'rating', field: 'product', value: product },
        ],
      },
    });

    if (result.length) {
      return { success: true, rating: true };
    } else {
      return { success: true, rating: false };
    }
  }
}

export default productRatingServices;
