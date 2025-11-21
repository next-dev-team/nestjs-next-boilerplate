import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '@schema/entities/user.entity';
import { RefreshToken } from '@schema/entities/refresh-token.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { MailService } from '@api/mail/mail.service';
import { MESSAGES } from '@common/constants/messages.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = uuidv4();

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.USER,
      isActive: true,
      emailVerificationToken,
    });

    await this.userRepository.save(user);

    // Send verification email
    await this.mailService.sendVerificationEmail(user.email, emailVerificationToken);

    return {
      message: MESSAGES.AUTH.REGISTER_SUCCESS,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is not active');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user);

    return {
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, expiresAt: MoreThan(new Date()) },
      relations: ['user'],
    });

    if (!tokenRecord) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_TOKEN);
    }

    const tokens = await this.generateTokens(tokenRecord.user);

    // Remove old refresh token
    await this.refreshTokenRepository.remove(tokenRecord);

    return tokens;
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException(MESSAGES.AUTH.INVALID_TOKEN);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);

    return { message: MESSAGES.AUTH.EMAIL_VERIFIED };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return { message: MESSAGES.AUTH.PASSWORD_RESET_SENT };
    }

    const resetToken = uuidv4();
    const expiresIn = 3600000; // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + expiresIn);
    await this.userRepository.save(user);

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: MESSAGES.AUTH.PASSWORD_RESET_SENT };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException(MESSAGES.AUTH.INVALID_TOKEN);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.save(user);

    await this.mailService.sendPasswordChangedEmail(user.email);

    return { message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESS };
  }

  async logout(userId: string) {
    await this.refreshTokenRepository.delete({ userId });
    return { message: MESSAGES.AUTH.LOGOUT_SUCCESS };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = uuidv4();
    const refreshExpiration = this.configService.get('JWT_REFRESH_EXPIRATION', '7d');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepository.save({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
