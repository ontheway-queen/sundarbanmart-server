import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstractServices';
import CustomError from '../../../common/utils/errors/customError';

class AdminFundServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * getAllFunds
   */
  public async getAllFunds() {
    const fund = await this.query.select({
      table: 'fund',
      fields: {
        columns: ['id', 'amount', 'status', 'apply_date'],
        otherFields: [
          {
            table: 'admin_queens',
            as: [
              ['name', 'queen_name'],
              ['photo', 'queen_dp'],
            ],
          },
        ],
      },
      join: [
        {
          join: { table: 'admin_queens', field: 'id' },
          on: { table: 'fund', field: 'queen_id' },
        },
      ],
    });

    return { success: true, data: fund };
  }

  /**
   * getAFund
   */
  public async getAFund(req: Request) {
    const { id } = req.params || {};

    const fund = await this.query.select({
      table: 'fund',
      fields: {
        columns: [
          'id',
          'guardian_name',
          'guardian_type',
          'dob',
          'nid_number',
          'why',
          'amount',
          'return_time',
          'return_type',
          'status',
        ],
        otherFields: [
          {
            table: 'admin_queens',
            as: [
              ['name', 'queen_name'],
              ['photo', 'queen_dp'],
              ['id', 'queen_id'],
            ],
          },
        ],
      },
      join: [
        {
          join: { table: 'admin_queens', field: 'id' },
          on: { table: 'fund', field: 'queen_id' },
        },
      ],
      where: { table: 'fund', field: 'id', value: id },
    });

    const guaranter = await this.query.select({
      table: 'fund_guaranter',
      fields: {
        as: [['id', 'guaranter_id']],
        columns: [
          'name',
          'dob',
          'address',
          'phone',
          'nid_number',
          'photo',
          'nid_front',
          'nid_back',
          'relation',
        ],
      },
      where: { table: 'fund_guaranter', field: 'fund_id', value: fund[0].id },
    });

    return {
      success: true,
      data: { ...fund[0], fund_guaranter: guaranter[0] },
    };
  }

  /**
   * updateQueenFundStatus
   */
  public async updateQueenFundInfo(req: Request) {
    const { id } = req.params;
    const { queen_id, ...body } = req.body;

    const data = await this.query.update({
      table: 'fund',
      data: body,
      where: { id },
    });

    if (data.affectedRows) {
      return {
        success: true,
        message: 'Queen fund successfully updated',
      };
    } else {
      throw new CustomError(
        'Please provide a valid fund id to update',
        400,
        'Bad request'
      );
    }
  }
}

export default AdminFundServices;
