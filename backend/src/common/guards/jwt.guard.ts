import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '../jwt.service';

@Injectable()
class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if (process.env.NODE_ENV !== 'production') {
    }

    let token: string | undefined;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies['gp_token']) {
      token = req.cookies['gp_token'];
    }
    
    if (!token) {
      console.warn('JWT_DEBUG: Token not found in header or cookies.');
      throw new UnauthorizedException('No token');
    }
    
    try {
        req.user = this.jwtService.verify(token);
        return true;
    } catch (e) {
        console.error('JWT_DEBUG: Token verification failed:', e);
        throw new UnauthorizedException('Invalid token');
    }
  }
}

export default JwtAuthGuard
