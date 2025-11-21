import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from '@schema/entities/user.entity';
import { RefreshToken } from '@schema/entities/refresh-token.entity';
import { UsersModule } from '@api/users/users.module';
import { MailModule } from '@api/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION', '15m')
        }
      })
    }),
    UsersModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
