import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import AdminPanelServices from '../../services/adminPanelServices/adminPanelServices';

class AdminPanelControllers extends AbstractController {
  private adminPanelServices = new AdminPanelServices();
  constructor() {
    super();
  }

  /**
   * login a user
   */

  public login = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.adminPanelServices.login(req.body);

      if (data.success) {
        req.andro
          ? res.set('__a_o', data.token)
          : res.cookie('__a_o', data.token);

        res.status(200).json({ success: true, data: data.user });
      } else {
        res.status(400).json(data);
      }
    }
  );
}

export default AdminPanelControllers;
