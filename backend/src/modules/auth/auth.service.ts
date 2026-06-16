import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma.service';
import { JwtService } from '../../common/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ─── Telegram initData verification ──────────────────────────────────────────

  verifyTelegramInitData(
    initData: string,
    botToken: string,
  ): Record<string, string> {
    if (!initData) throw new UnauthorizedException('initData is empty');
    if (!botToken) throw new UnauthorizedException('botToken is not configured');

    // Parse raw query string into key-value pairs
    const params: [string, string][] = initData.split('&').map((p) => {
      const [k, ...rest] = p.split('=');
      return [k, decodeURIComponent(rest.join('='))];
    });

    const obj: Record<string, string> = Object.fromEntries(params);
    const hash = obj.hash;
    if (!hash) throw new UnauthorizedException('Missing hash in initData');

    // Build data-check string (all pairs except hash, sorted alphabetically)
    const dataCheckString = params
      .filter(([k]) => k !== 'hash')
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join('\n');

    // HMAC-SHA256 with secret = HMAC-SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Timing-safe compare
    const hmacBuffer = Buffer.from(hmac, 'hex');
    const hashBuffer = Buffer.from(hash.toLowerCase(), 'hex');

    if (
      hmacBuffer.length !== hashBuffer.length ||
      !crypto.timingSafeEqual(hmacBuffer, hashBuffer)
    ) {
      throw new UnauthorizedException('Invalid initData signature');
    }

    // Freshness check — reject tokens older than 24 hours
    const authDate = Number(obj.auth_date ?? '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 60 * 60 * 24) {
      throw new UnauthorizedException('initData is too old (> 24 h)');
    }

    return obj;
  }

  // ─── Register / update user from bot /start ───────────────────────────────────
  //
  // Called by BotService every time a user presses /start.
  // Uses upsert so existing users are updated, new users are created with a wallet.
  //
  async registerFromBot(telegramUser: {
    id: number;
    username?: string;
    first_name?: string;
    photo_url?: string;
  }) {
    const telegramId = String(telegramUser.id);

    if (!telegramId) {
      throw new Error('[Auth] registerFromBot: telegramUser.id is required');
    }

    console.log(
      `[Auth] registerFromBot — id=${telegramId} username=${telegramUser.username ?? '-'}`,
    );

    const user = await this.prisma.user.upsert({
      where: { telegramId },
      update: {
        // Always refresh the latest values from Telegram
        username:  telegramUser.username   ?? null,
        firstName: telegramUser.first_name ?? null,
        photoUrl:  telegramUser.photo_url  ?? null,
      },
      create: {
        telegramId,
        username:  telegramUser.username   ?? null,
        firstName: telegramUser.first_name ?? null,
        photoUrl:  telegramUser.photo_url  ?? null,
        // Every new user gets a wallet with 0 balance
        wallets: {
          create: { balance: 0 },
        },
      },
    });

    console.log(`[Auth] User saved — dbId=${user.id} telegramId=${telegramId}`);
    return user;
  }

  // ─── Login via Telegram WebApp initData ──────────────────────────────────────
  //
  // Called from the HTTP endpoint that the WebApp hits on first load.
  // Verifies the initData signature, upserts the user, and returns a JWT.
  //
  async telegramLogin(initData: string, botToken: string) {
    // 1. Verify signature
    const payload = this.verifyTelegramInitData(initData, botToken);

    // 2. Parse user object from payload
    let tgUser: Record<string, any> = {};
    if (payload.user) {
      try {
        tgUser = JSON.parse(payload.user);
      } catch {
        throw new UnauthorizedException('Invalid user JSON in initData');
      }
    }

    // telegramId can come from the parsed user object or from top-level fields
    const rawId = tgUser.id ?? payload.id ?? payload.user_id;
    if (!rawId) {
      throw new UnauthorizedException('Telegram ID missing from initData');
    }

    const telegramId = String(rawId);

    // 3. Upsert user — keep photo_url if Telegram doesn't provide one in initData
    const user = await this.prisma.user.upsert({
      where: { telegramId },
      update: {
        username:  tgUser.username   ?? undefined,
        firstName: tgUser.first_name ?? undefined,
        // photo_url is NOT in initData — keep whatever was saved during /start
      },
      create: {
        telegramId,
        username:  tgUser.username   ?? null,
        firstName: tgUser.first_name ?? null,
        photoUrl:  null, // will be filled in by registerFromBot when user presses /start
        wallets: {
          create: { balance: 0 },
        },
      },
    });

    // 4. Issue JWT
    const token = this.jwtService.sign({ sub: user.id, role: user.role });

    return { user, token };
  }

  // ─── Profile update ───────────────────────────────────────────────────────────

  async updateProfile(userId: string, data: { firstName: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { firstName: data.firstName },
    });
  }
}