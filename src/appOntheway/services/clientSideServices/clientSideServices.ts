import { Request } from 'express';
import { send } from 'process';
import AbstractServices from '../../../abstracts/abstractServices';

class clientSideServices extends AbstractServices {
  constructor() {
    super();
  }

  // send contact msg service
  public sendContactMsg = async (req: Request) => {
    const data = await this.query.insert('contact_message', req.body);
    if (data.insertId) {
      const msg = await this.query.select({
        table: 'contact_message',
        fields: { columns: ['status', 'msg_date'] },
        where: { table: 'contact_message', field: 'id', value: data.insertId },
      });
      return {
        success: true,
        message: 'Message send successfully!',
        id: data.insertId,
        msg_date: msg[0].msg_date,
        status: msg[0].status,
      };
    } else {
      return {
        success: false,
        message: "Message couldn't send. Something is wrong",
      };
    }
  };

  // get all contact msg service
  public getAllContactMsg = async () => {
    const data = await this.query.select({
      table: 'contact_message',
      fields: {
        columns: ['id', 'name', 'status', 'message', 'note', 'msg_date'],
      },
      orderBy: { table: 'contact_message', field: 'id' },
      desc: true,
    });

    if (data.length) {
      return { success: true, data };
    } else {
      return { success: false };
    }
  };

  // get a single contact msg service
  public getSingleContactMsg = async (req: Request) => {
    const { id } = req.params;
    const data = await this.query.select({
      table: 'contact_message',
      fields: {
        columns: [
          'id',
          'name',
          'status',
          'email',
          'phone',
          'message',
          'note',
          'msg_date',
        ],
      },
      where: { table: 'contact_message', field: 'id', value: id },
    });

    if (data.length) {
      return { success: true, data: data[0] };
    } else {
      return { success: false };
    }
  };

  // update singel contact msg service
  public updateSingleContactMsg = async (req: Request) => {
    const { id } = req.params;
    const data = await this.query.update({
      table: 'contact_message',
      data: req.body,
      where: { id },
    });

    if (data.affectedRows) {
      return { success: true, msg: 'Contact msg updated successfully' };
    } else {
      return { success: false };
    }
  };
}

export default clientSideServices;
