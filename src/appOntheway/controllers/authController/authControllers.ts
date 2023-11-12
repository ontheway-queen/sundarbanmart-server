import { Request, Response } from 'express';
import { io } from '../../../common/socket/socket';
import jwt from 'jsonwebtoken';
import config from '../../../common/config/config';
import AbstractController from '../../../abstracts/abstractController';
import AuthServices from '../../services/authServices/authServices';
import notificationServices from '../../services/adminPanelServices/notificationServices';

class AuthControllers extends AbstractController {
  private authServices = new AuthServices();
  private maxAge = 1000 * 60 * 60 * 24 * 30;
  private notificationServices = new notificationServices();

  constructor() {
    super();
  }

  /**
   * register user
   */
  public register = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      if (req.body.password.length > 5 && req.body.phone.length >= 10) {
        const { filename } = (req.file || {}) as Express.Multer.File;
        const { token, ...rest } = req.body;
        const body = filename ? { ...rest, photo: filename } : rest;
        const data = await this.authServices.register(body);

        if (data.success) {
          res.status(200).json({ success: true, data: data.user });
          const notification = await this.notificationServices.postNotification(
            'new-queen',
            {
              msg: 'New Queen Registered',
            }
          );

          io.emit('new_notification', notification);
          io.emit('new_queen', data.user);
        } else {
          res.status(400).json(data);
        }
      } else {
        res
          .status(422)
          .json({ success: false, msg: 'Enter valid phone or password' });
      }
    }
  );

  /**
   * login a user
   */
  public login = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const { user } = req.params;

      const table = user === 'queen' ? 'admin_queens' : 'customers';

      const data = await this.authServices.login(table, req.body);
      const cookieName = table === 'admin_queens' ? 'qa_otw' : 'ca_otw';

      if (data.success) {
        // req.andro
        //   ? res.set(cookieName, data.token)
        //   : res.cookie(cookieName, data.token, {
        //       httpOnly: true,
        //       signed: true,
        //     });
        res
          .status(200)
          .json({ success: true, data: data.user, token: data.token });
      } else {
        res.status(400).json(data);
      }
    }
  );

  /**
   * forget password
   */

  public forgetPassword = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const { user } = req.params;
      const { token, password, phone } = req.body;

      const verified = jwt.verify(token, config.JWT_SECRET);

      if (verified) {
        const data = await this.authServices.forgetPassword(
          user,
          password,
          phone
        );

        if (data.success) {
          res.status(200).json({ success: true, message: data.message });
        } else {
          this.error();
        }
      }
    }
  );
}

export default AuthControllers;
