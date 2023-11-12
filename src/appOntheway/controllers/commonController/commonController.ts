import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import commonServices from '../../../common/services/commonServices';
import CommonServices from '../../services/commonServices';

class CommonController extends AbstractController {
  private commonService = new CommonServices();
  constructor() {
    super();
  }

  // check phone for register
  public checkPhoneForReg = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      if (req.params.phone.length < 12 && req.params.phone.length > 10) {
        const auths = [
          'admin_queens',
          'freelancing_seller',
          'freelancing_buyer',
          'social_users',
          'customers',
          'training_trainee',
        ];
        if (auths.includes(req.params.type)) {
          const data = await this.commonService.checkPhoneForReg(
            req.params.phone,
            req.params.type
          );

          if (data.success) {
            res.status(200).json(data);
          } else {
            res.status(500).json(data);
          }
        } else {
          res
            .status(404)
            .json({ success: false, message: 'Invalid auth type' });
        }
      } else {
        res.status(443).json({ success: false, message: 'Invalid phone' });
      }
    }
  );
}
export default CommonController;
