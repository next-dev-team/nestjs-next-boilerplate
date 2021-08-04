import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { EmailsService } from './emails.service';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        //ignoreTLS: true,
        secure: false,
        auth: {
          user: 'hinsinak2016@gmail.com',
          pass: '069526433'
        }
      }
      //defaults: {
      //from: '"No Reply" <no-reply@localhost>',
      //}
    })
  ],
  providers: [EmailsService]
  //exports: [EmailsService]
})
export class EmailsModule {}
