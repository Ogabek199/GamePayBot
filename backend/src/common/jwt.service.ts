import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private secret = process.env.JWT_SECRET || 'change_me';

  sign(payload: object, opts?: jwt.SignOptions) {
    return jwt.sign(payload, this.secret, { expiresIn: '7d', ...(opts || {}) });
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.secret) as any;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
