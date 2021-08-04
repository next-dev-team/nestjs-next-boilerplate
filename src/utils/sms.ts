import { ConfigService } from '@nestjs/config';
import * as otpg from 'otp-generator';

export class SmsProvider {
  config = {};
  otpCode = '';

  constructor(private configService: ConfigService) {
    this.config = {
      url: 'configuration.data.url',
      data: {
        username: 'meanmean',
        api_secret: 'hs1qwt3a1a0b58e',
        api_key: 'lto1xgkdfc08697',
        from: '85567248999'
        //to: prPayload.phoneNumber,
        //text: "Your OTP code : " + otpCode
      },
      conf: {
        headers: { 'Content-Type': 'application/json' }
      }
    };
  }

  async smsOtp(from, to, sms) {
    console.log(this.configService);
    const otpCode = otpg.generate(4, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    //this.config.data['from'] = sms? sms + otpCode : "Your OTP code : " + otpCode;
    //console.log(this.otpCode);
    return otpCode;
  }
}
