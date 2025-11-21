import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM')}>`,
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    const template = this.loadTemplate('verification');
    const html = template({ verificationUrl });

    await this.sendEmail(email, 'Verify Your Email', html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    const template = this.loadTemplate('password-reset');
    const html = template({ resetUrl });

    await this.sendEmail(email, 'Reset Your Password', html);
  }

  async sendPasswordChangedEmail(email: string) {
    const template = this.loadTemplate('password-changed');
    const html = template({});

    await this.sendEmail(email, 'Password Changed Successfully', html);
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const template = this.loadTemplate('welcome');
    const html = template({ firstName });

    await this.sendEmail(email, 'Welcome!', html);
  }

  private loadTemplate(templateName: string): HandlebarsTemplateDelegate {
    const templatePath = path.join(
      process.cwd(),
      'assets',
      'templates',
      'email',
      `${templateName}.hbs`,
    );

    if (fs.existsSync(templatePath)) {
      const templateFile = fs.readFileSync(templatePath, 'utf8');
      return Handlebars.compile(templateFile);
    }

    // Fallback to simple HTML if template doesn't exist
    return Handlebars.compile('<div>{{message}}</div>');
  }
}
