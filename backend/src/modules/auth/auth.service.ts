import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma.service';
import { JwtService } from '../../common/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}
verifyTelegramInitData(initData: string, botToken: string): Record<string, string> {
  console.log('DEBUG: botToken used for verification:', botToken);
  // initData is the raw query string from Telegram WebApp
  const params = initData.split('&').map(p => {
// ... (rest of the file)
      const [k, ...rest] = p.split('=');
      return [k, decodeURIComponent(rest.join('='))];
    });
    const obj: Record<string, string> = Object.fromEntries(params as [string, string][]);
    const hash = obj.hash;
    if (!hash) throw new UnauthorizedException('Missing hash');

    const dataCheckArray = params
      .filter(([k]) => k !== 'hash')
      .map(([k, v]) => `${k}=${v}`)
      .sort();
    const dataCheckString = dataCheckArray.join('\n');
    console.log('DEBUG: dataCheckString:', dataCheckString);

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    console.log('DEBUG: hmac:', hmac);
    console.log('DEBUG: hash:', hash);

    // Timing safe compare
    const hashLower = hash.toLowerCase();
    const hmacBuffer = Buffer.from(hmac, 'hex');
    const hashBuffer = Buffer.from(hashLower, 'hex');

    if (hmacBuffer.length !== hashBuffer.length || !crypto.timingSafeEqual(hmacBuffer, hashBuffer)) {
      throw new UnauthorizedException('Invalid initData signature');
    }

    // Basic freshness check (auth_date)
    const authDate = Number(obj.auth_date || '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 60 * 60 * 24) {
      throw new UnauthorizedException('initData is too old');
    }

    return obj;
  }

  async telegramLogin(initData: string, botToken: string) {
    const payload = this.verifyTelegramInitData(initData, botToken);
    
    let tgUser: any = {};
    try {
      if (payload.user) {
        tgUser = JSON.parse(payload.user);
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid user data in initData');
    }

    const telegramId = tgUser.id || payload.id || payload.user_id;
    if (!telegramId) throw new UnauthorizedException('telegram id missing');

    // Upsert user
    const user = await this.prisma.user.upsert({
      where: { telegramId: String(telegramId) },
      update: {
        username: tgUser.username || undefined,
        firstName: tgUser.first_name || undefined,
        photoUrl: tgUser.photo_url || undefined,
      },
      create: {
        telegramId: String(telegramId),
        username: tgUser.username || undefined,
        firstName: tgUser.first_name || undefined,
        photoUrl: tgUser.photo_url || undefined,
        wallets: {
          create: {
            balance: 0,
          },
        },
      },
    });

    // Issue JWT
    const token = this.jwtService.sign(
      { sub: user.id, role: user.role }
    );
    return { user, token };
  }

  async updateProfile(userId: string, data: { firstName: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { firstName: data.firstName },
    });
  }
}
