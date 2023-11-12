import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import AdminPanelServices from '../../services/adminPanelServices/adminPanelServices';

class AdminSearchController extends AbstractController {
  private AdminPanelServices = new AdminPanelServices();
  constructor() {
    super();
  }

  public adminSearch = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.AdminPanelServices.AdminSearchService(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(400).json(data);
      }
    }
  );
}

export default AdminSearchController;
