import { Request } from 'express';
import { ResultSetHeader } from 'mysql';
import { RowDataPacket } from 'mysql2/promise';
import AbstractServices from '../../../abstracts/abstractServices';

class notificationServices extends AbstractServices {
  constructor() {
    super();
  }

  //post or update a notification

  public postNotification = async (
    type: string,
    body: { msg: string; update_id?: number | string }
  ) => {
    if (type.startsWith('new')) {
      const item: RowDataPacket[] = await this.query.select({
        table: 'notifications',
        fields: { columns: ['id', 'status', 'count'] },
        where: { table: 'notifications', field: 'type', value: `'${type}'` },
      });

      if (item.length) {
        let updated: ResultSetHeader;
        if (item[0].status === 'unread') {
          updated = await this.query.update({
            table: 'notifications',
            data: { count: item[0].count + 1 },
            where: { id: item[0].id },
          });
        } else {
          updated = await this.query.update({
            table: 'notifications',
            data: { status: 'unread', count: 1 },
            where: { id: item[0].id },
          });
        }

        const notification = await this.query.select({
          table: 'notifications',
          fields: {
            columns: ['id', 'count', 'type', 'msg', 'status', 'update_id'],
            as: [['date', 'time']],
          },
          where: { table: 'notifications', field: 'id', value: item[0].id },
        });

        return notification[0];
      } else {
        const data = await this.query.insert('notifications', {
          ...body,
          type,
          count: 1,
        });

        const notification = await this.query.select({
          table: 'notifications',
          fields: {
            columns: ['id', 'count', 'type', 'msg', 'status', 'update_id'],
            as: [['date', 'time']],
          },
          where: { table: 'notifications', field: 'id', value: data.insertId },
        });

        return notification[0];
      }
    } else {
      const updated = await this.query.select({
        table: 'notifications',
        fields: { columns: ['id'] },
        where: {
          table: 'notifications',
          field: 'update_id',
          value: body.update_id as string,
        },
      });

      if (updated.length) {
        await this.query.update({
          table: 'notifications',
          data: { status: 'unread', msg: body.msg },
          where: { id: updated[0].id },
        });
      } else {
        await this.query.insert('notifications', {
          ...body,
          type,
        });
      }
      const notification = await this.query.select({
        table: 'notifications',
        fields: {
          columns: ['id', 'count', 'type', 'msg', 'status', 'update_id'],
          as: [['date', 'time']],
        },
        where: {
          table: 'notifications',
          field: 'update_id',
          value: body.update_id as string,
        },
      });

      return notification[0];
    }
  };

  // get all notifications

  public getAllNotification = async () => {
    const notifications = await this.query.select({
      table: 'notifications',
      fields: {
        columns: ['id', 'count', 'type', 'msg', 'status', 'update_id'],
        as: [['date', 'time']],
      },
      orderBy: { table: 'notifications', field: 'date' },
      desc: true,
    });
    return { success: true, data: notifications };
  };

  // read notification

  public readNotification = async (req: Request) => {
    const { id } = req.body;

    const result = await this.query.update({
      table: 'notifications',
      data: { status: 'read' },
      where: { id },
    });

    if (result.affectedRows) {
      return { success: true, msg: 'Notification read successfully' };
    } else {
      return { success: false };
    }
  };

  // delete all notification
  public clearNotifications = async () => {
    const sql: string = `DELETE FROM ngf_ecommerce.notifications`;
    const result = (await this.query.rawQuery(sql)) as RowDataPacket;

    if (result.affectedRows) {
      return { success: true, msg: 'Notifications clear successfully' };
    } else {
      return { success: false };
    }
  };
}

export default notificationServices;
