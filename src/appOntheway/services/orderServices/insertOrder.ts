import AbstractServices from '../../../abstracts/abstractServices';
import Queries from '../../../common/dataAccess/queries';
import { TOrder_details } from '../../../common/utils/commonTypes/types';

class OrderDetails extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * insert
   */
  public async insert(
    query: Queries,
    order: object,
    order_details: TOrder_details[]
  ) {
    const data = await query.insert('orders', order);

    const fileds = [
      'order_id',
      'product_name',
      'product_category',
      'product_id',
      'price',
      'quantity',
      'queen_id',
      'delivery_date',
    ];

    const values = [];

    for (let i = 0; i < order_details.length; i++) {
      const element = order_details[i];

      values.push([
        data.insertId,
        element.product_name,
        element.product_category,
        element.product_id,
        element.price,
        element.quantity,
        element.queen_id,
        element.delivery_date,
      ]);
    }

    await query.multipleInsert('order_details', fileds, values);

    return { success: true, orderId: data.insertId };
  }
}

export default OrderDetails;
