import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '../../common/jwt.service';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
