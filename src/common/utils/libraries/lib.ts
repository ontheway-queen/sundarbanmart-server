import config from '../../config/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';

type TokenCreds = {
  id?: number;
  photo?: string;
  phone?: number;
  name?: string;
  auth?: string;
  address?: string;
  type?: string;
};

class Lib {
  public static maxAge = 30 * 24 * 60 * 60;

  /**
   * make hashed password
   */
  public static async hashPass(password: string) {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }

  /**
   * verify password
   */
  public static async compare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * create token
   */
  public static createToken(creds: TokenCreds, maxAge: number) {
    return jwt.sign(creds, config.JWT_SECRET, { expiresIn: maxAge });
  }

  // verify token
  public static verifyToken(token: string) {
    try {
      return jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /**
   * generate otp
   */
  public static otpGen() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let otp = '';

    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 10);

      otp += numbers[randomNumber];
    }

    return otp;
  }

  /**
   * send sms
   */
  public static async sendSms(phone: number, message: string) {
    try {
      const otpUrl = config.OTP_URL;
      const apiKey = config.API_KEY;
      const clientId = config.CLIENT_ID;
      const senderId = config.SENDER_ID;
      const numbers = '+880' + phone;

      const url = `${otpUrl}?ApiKey=${apiKey}&ClientId=${clientId}&SenderId=${senderId}&Message=${message}&MobileNumbers=${numbers}&Is_Unicode=true`;

      const result = await axios.get(url);

      console.log(result.data);

      return true;
    } catch (err) {
      console.log({ err });
      return false;
    }
  }

  /**
   * queryParser
   */
  public static fieldParser(table: string, fields: string[]) {
    const parsedFields: string[] = [];

    for (let e = 0; e < fields.length; e++) {
      const element = fields[e];
      parsedFields.push(`${table}.${element}`);
    }

    return parsedFields;
  }
}

export default Lib;
