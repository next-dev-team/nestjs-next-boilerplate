import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as EmailExi from 'email-existence';

@Injectable()
export class EmailsService {
  constructor(private mailerService: MailerService) {}

  //check if email existence
  async emailExistence(email) {
    return new Promise((resolve, reject) => {
      EmailExi.check(email, (err, res) => {
        if (err) resolve(false);
        resolve(res);
      });
    });
  }

  async emailOtp(params) {
    return await this.mailerService.sendMail(params);
  }
}
