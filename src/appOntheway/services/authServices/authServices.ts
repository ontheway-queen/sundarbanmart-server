import AbstractServices from '../../../abstracts/abstractServices';
import Lib from '../../../common/utils/libraries/lib';

type UserCreate = {
  name: string;
  password: string;
  phone: number;
  address: string;
  division: string;
  reference_id: number;
  city: string;
  lat?: string;
  lng?: string;
  post_code?: number;
  email?: string;
  bank_name?: string;
  account_number?: string;
  guest?: number;
};

type UserLogin = {
  phone: number;
  password: string;
};

interface IAuth {
  register: (body: UserCreate) => object;
  login: (table: string, creds: UserLogin) => object;
  forgetPassword: (user: string, password: string, phone: number) => object;
}

// AUTHENTICATION CLASS
class AuthServices extends AbstractServices implements IAuth {
  constructor() {
    super();
  }

  // Register service
  public async register(body: UserCreate) {
    const { name, phone, password: bodyPass, address, reference_id } = body;
    const user = await this.query.select({
      table: 'admin_queens',
      fields: { columns: ['id'] },
      where: { table: 'admin_queens', field: 'phone', value: phone },
    });

    if (user.length) {
      return { success: false, msg: 'Already register with this number!' };
    }

    if (reference_id) {
      const refCheck = await this.query.select({
        table: 'admin_queens',
        fields: { columns: ['id'] },
        where: { table: 'admin_queens', field: 'id', value: reference_id },
      });

      if (!refCheck.length) {
        return {
          success: false,
          msg: 'Invalid ME reference id!',
        };
      }
    }

    const hashedPass = await Lib.hashPass(bodyPass);
    const data = await this.query.insert('admin_queens', {
      ...body,
      password: hashedPass,
    });

    const { password, ...rest } = body;
    const tokenCreds = { name, phone, address };
    const token = Lib.createToken(tokenCreds, Lib.maxAge);

    return {
      success: true,
      user: {
        ...rest,
        id: data.insertId,
        status: 'Pending',
        social_user: 0,
        trainee: 0,
        seller: 0,
      },
      token,
    };
  }

  // Login service
  public async login(table: string, creds: UserLogin) {
    const { phone, password } = creds;
    // console.log({ creds });
    const fields = [
      'id',
      'name',
      'phone',
      'password',
      'photo',
      'email',
      'address',
      'city',
      'post_code',
    ];

    if (table === 'admin_queens') {
      fields.push('nid_front');
      fields.push('nid_back');
      fields.push('status');
      fields.push('division');
      fields.push('seller');
      fields.push('social_user');
      fields.push('trainee');
    }

    const user = await this.query.select({
      table,
      fields: { columns: fields },
      where: { table, field: 'phone', value: phone },
    });

    if (user.length < 1) {
      return { success: false, message: 'Username or password is incorrect!!' };
    }

    const { phone: userPhone, password: userPass, ...rest } = user[0];

    const isPassValid = await Lib.compare(password, userPass);

    if (isPassValid) {
      const tokenCreds = { phone: userPhone, ...rest };
      const token = Lib.createToken(tokenCreds, Lib.maxAge);

      return { success: true, user: tokenCreds, token };
    } else {
      return { success: false, message: 'Username or password is incorrect!!' };
    }
  }

  // forgetPassword
  public async forgetPassword(user: string, password: string, phone: number) {
    const hashedPass = await Lib.hashPass(password);

    const table = user === 'queen' ? 'admin_queens' : 'customers';

    await this.query.update({
      table,
      data: { password: hashedPass },
      where: { phone },
    });

    return { success: true, message: 'Pasword successfully updated' };
  }

  // check a queen for data common
  public async checkQueenforData(creds: UserLogin) {
    const table = 'admin_queens';
    const { phone, password } = creds;
    const fields = [
      'id',
      'name',
      'phone',
      'password',
      'photo',
      'lat',
      'lng',
      'email',
      'address',
      'status',
      'city',
      'post_code',
      'nid_front',
      'nid_back',
      'seller',
    ];

    const user = await this.query.select({
      table,
      fields: { columns: fields },
      where: { table, field: 'phone', value: phone },
    });

    if (user.length < 1) {
      return {
        success: false,
        message: 'Queen phone or password is incorrect!!',
      };
    }

    const { password: userPass } = user[0];

    const isPassValid = await Lib.compare(password, userPass);

    if (isPassValid) {
      return { success: true, user: user[0] };
    } else {
      return {
        success: false,
        message: 'Queen phone or password is incorrect!!',
      };
    }
  }

  // check customer for data common
  public async checkCustomerforData(creds: UserLogin) {
    const table = 'customers';
    const { phone, password } = creds;
    const fields = [
      'id',
      'name',
      'phone',
      'password',
      'photo',
      'lat',
      'lng',
      'email',
      'address',
      'city',
      'post_code',
      'division',
    ];

    const user = await this.query.select({
      table,
      fields: { columns: fields },
      where: { table, field: 'phone', value: phone },
    });

    if (user.length < 1) {
      return {
        success: false,
        message: 'Customers phone or password is incorrect!!',
      };
    }

    const { password: userPass } = user[0];
    const isPassValid = await Lib.compare(password, userPass);
    if (isPassValid) {
      return { success: true, user: user[0] };
    } else {
      return { success: false, message: 'Phone or password is incorrect!!' };
    }
  }
}

export default AuthServices;
