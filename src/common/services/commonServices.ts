import axios from 'axios';
import { Request } from 'express';
import AbstractServices from '../../abstracts/abstractServices';
import Lib from '../utils/libraries/lib';

class commonServices extends AbstractServices {
  // change password
  public async ChangePassword(table: string, password: string, phone: number) {
    const hashedPass = await Lib.hashPass(password);

    const result = await this.query.update({
      table,
      data: { password: hashedPass },
      where: { phone },
    });

    if (result.affectedRows) {
      return { success: true, message: 'Password successfully updated' };
    } else {
      return { success: false, message: 'Cannot change password now' };
    }
  }

  // extrernal service for ATAB

  // atab payment success
  public async atabPaymentSuccess(req: Request) {
    const body = req.body;
    const { link, type } = req.query;

    try {
      const res = await axios.post(
        'https://atab.services/api/atab/common/ssl/payment/success',
        { ...body, type }
      );
      console.log({ res });
    } catch (err) {
      console.log({ err });
    }

    return {
      success: true,
      data: link,
    };
  }

  // atab payment failed
  public async atabPaymentFailed(req: Request) {
    const body = req.body;
    const { link, type } = req.query;
    return {
      data: link,
    };
  }

  // atab payment cancelled
  public async atabPaymentCancelled(req: Request) {
    const body = req.body;
    const { link, type } = req.query;

    return {
      data: link,
    };
  }

  // create video app test
  public async createVideoAppTest(req: Request) {
    const { caption } = req.body;
    const files = (req.files as Express.Multer.File[]) || [];

    if (!files.length) {
      return {
        success: false,
        message: 'Must put video',
      };
    }

    const body = {
      caption,
      video_url: `https://hajjmanagment.online/get/video/others/${files[0].filename}`,
    };

    const data = await this.query.insert('test_videos', body);

    if (data.insertId) {
      return {
        success: true,
        data: { ...body, id: data.insertId },
      };
    } else {
      return {
        success: false,
        message: 'Cannot create video',
      };
    }
  }

  // get all video app test
  public async getAllAppVideos() {
    const data = await this.query.select({
      table: 'test_videos',
      fields: { columns: ['id', 'caption', 'video_url', 'created_at'] },
    });

    return {
      success: true,
      data,
    };
  }
}
export default commonServices;
