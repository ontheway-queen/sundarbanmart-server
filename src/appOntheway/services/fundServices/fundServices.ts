import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstractServices';
import CustomError from '../../../common/utils/errors/customError';

class FundServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * queenApplyForFund
   */
  public async queenApplyForFund(req: Request) {
    const { guaranter, ...body } = req.body;

    const check = await this.query.select({
      table: 'fund',
      fields: { columns: ['id'] },
      where: { table: 'fund', field: 'queen_id', value: body.queen_id },
    });

    let data;

    if (check.length > 0) {
      await this.query.update({
        table: 'fund',
        data: body,
        where: { queen_id: body.queen_id },
      });
      data = check[0].id;
    } else {
      const fund = await this.query.insert('fund', body);

      const newFund = await this.query.select({
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
        where: { table: 'fund', field: 'id', value: fund.insertId },
      });

      data = newFund[0];
    }

    return {
      success: true,
      message: 'Data successfully updated',
      data,
    };
  }

  /**
   * queenUpdateGuaranter
   */
  public async queenUpdateGuaranter(req: Request) {
    const { fund_id } = req.params;
    const { filename } = (req.file as Express.Multer.File) || {};

    const check = await this.query.select({
      table: 'fund_guaranter',
      fields: { columns: ['id', 'photo'] },
      where: { table: 'fund_guaranter', field: 'fund_id', value: fund_id },
    });

    let data;

    if (check.length > 0) {
      await this.query.update({
        table: 'fund_guaranter',
        data: { ...req.body, ...(filename && { photo: filename }) },
        where: { fund_id },
      });

      data = check[0].id;

      /**
       * delete previous image if @filename exists
       */
      filename && this.deleteFile.delete('guaranters', check[0].photo);
    } else {
      if (!filename) {
        throw new CustomError(
          "Please provide guaranter's photo showing his/her face",
          400,
          'Bad request'
        );
      }

      const temp = await this.query.insert('fund_guaranter', {
        ...req.body,
        fund_id,
        photo: filename,
      });

      data = temp.insertId;
    }

    return {
      success: true,
      message: 'Successfully updated guaranter',
      data: filename,
      id: data,
    };
  }

  /**
   * getAQueensAllApplications
   */
  public async getAQueensAllApplications(req: Request) {
    const { queen_id } = req.params;

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
      },
      where: { table: 'fund', field: 'queen_id', value: queen_id },
    });

    const guaranter = await this.query.select({
      table: 'fund_guaranter',
      fields: {
        columns: [
          'name',
          'dob',
          'address',
          'phone',
          'nid_number',
          'photo',
          'nid_front',
          'nid_back',
        ],
      },
      where: { table: 'fund_guaranter', field: 'fund_id', value: fund[0].id },
    });

    return {
      success: true,
      data: { ...fund[0], fund_guaranter: guaranter[0] },
    };
  }
}

export default FundServices;
