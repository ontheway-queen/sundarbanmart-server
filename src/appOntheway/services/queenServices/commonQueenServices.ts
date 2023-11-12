import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstractServices';

class CommonQueenServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * getAQueen
   */
  public async getAQueen(table: string, req: Request) {
    const { id } = req.params;
    const { phone } = req.params;
    const finder = id
      ? table === 'admin_queens'
        ? ['id', id]
        : ['admin_queens_id', id]
      : ['phone', phone];

    const columns = [
      'account_number',
      'address',
      'bank_name',
      'name',
      'nid_back',
      'nid_front',
      'phone',
      'photo',
      'post_code',
      'city',
      'email',
      'designation',
      'division',
      'social_user',
      'trainee',
    ];

    if (table === 'admin_queens') {
      columns.push(
        ...['id', 'status', 'note', 'seller', 'reference_id', 'queen_category']
      );
    }

    const data = await this.query.select({
      fields: { columns, as: [['last_update', 'join_date']] },
      table,
      where: { table, field: finder[0], value: finder[1] },
    });

    if (data.length < 1) {
      return { success: false };
    } else {
      return { success: true, data: data[0] };
    }
  }

  // get a queens all reference queens
  public async getAQueensAllRefQ(req: Request) {
    const { id } = req.params;
    const data = await this.query.select({
      table: 'admin_queens',
      fields: {
        columns: ['id', 'name', 'photo', 'status', 'note', 'phone'],
        as: [['last_update', 'reg_at']],
      },
      where: {
        table: 'admin_queens',
        field: 'reference_id',
        value: id,
      },
    });

    return {
      success: true,
      data,
    };
  }
}

export default CommonQueenServices;
