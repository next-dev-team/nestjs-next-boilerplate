import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { lastValueFrom } from 'rxjs';
import TwitterApi from 'twitter-api-v2';

import { SocialConfig } from './social.dto';
import { FacebookException, FacebookResult, LinkedinException, LinkedinResult } from './social.interface';

export class Social {
  private googleClient = new OAuth2Client();
  constructor(private readonly config: SocialConfig, private readonly http: HttpService) {}

  async getTwitterData(accessToken: string, accessSecret: string) {
    const client = new TwitterApi({
      appKey: this.config.TWITTER_CONSUMER_KEY,
      appSecret: this.config.TWITTER_CONSUMER_SECRET,
      accessToken,
      accessSecret
    });

    try {
      return client.v1.verifyCredentials();
    } catch (err) {
      //@ts-ignore
      throw new BadRequestException(err.message);
    }
  }

  async getFacebookData(accessToken: string) {
    try {
      const url = `https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${accessToken}`;
      const { data } = await lastValueFrom(this.http.get<FacebookResult>(url));
      return data;
    } catch (e) {
      //@ts-ignore
      const { response: res }: AxiosError<FacebookException> = e;
      throw new BadRequestException(res?.data.error.message);
    }
  }
  async getGoogleDataByAccessToken(
    accessToken: string
  ): Promise<{
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
  }> {
    try {
      const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;
      const { data } = await lastValueFrom(this.http.get<any>(url));
      return data;
    } catch (e) {
      //@ts-ignore
      const { response: res }: AxiosError<Any> = e;
      throw new BadRequestException(res?.data.error.message);
    }
  }

  // TODO:
  async getGoogleData(accessToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: accessToken,
        audience: '1075922434770-mt5s0dkvnkamumldv9d97irjt9dftah2.apps.googleusercontent.com'
      });
      return !ticket ? null : ticket!.getPayload();
    } catch (error) {
      //@ts-ignore
      throw new BadRequestException(error.message);
    }
  }

  async getLinkedInData(accessToken) {
    try {
      const url = 'https://api.linkedin.com/v1/people/~?format=json';
      const headers = { Authorization: `Bearer ${accessToken}` };
      const { data } = await lastValueFrom(
        await this.http.get<LinkedinResult>(url, { headers })
      );
      return data;
    } catch (e) {
      //@ts-ignore
      const { response: res }: AxiosError<LinkedinException> = e;
      throw new BadRequestException(res?.data.message);
    }
  }
}
