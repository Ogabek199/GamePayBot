import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { AuthService } from '../auth/auth.service';

type DepositAction = 'approve' | 'reject';
type DepositActionHandler = (
  action: DepositAction,
  depositId: string,
) => Promise<string>;

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf | null = null;
  private depositActionHandler: DepositActionHandler | null = null;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  // ─── Handler registration ────────────────────────────────────────────────────

  registerDepositActionHandler(handler: DepositActionHandler) {
    this.depositActionHandler = handler;
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  async onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    const adminChatId = this.configService.get<string>('ADMIN_CHAT_ID');

    if (!token || token === 'your_telegram_bot_token_here') {
      console.error('[Bot] BOT_TOKEN is missing or invalid! Bot not started.');
      return;
    }

    if (!adminChatId || isNaN(parseInt(adminChatId, 10))) {
      console.error('[Bot] ADMIN_CHAT_ID is missing or not a valid number!');
    }

    this.bot = new Telegraf(token);

    // Global error handler
    this.bot.catch((err: any, ctx: any) => {
      console.error(`[Bot] Error [${ctx?.updateType ?? 'unknown'}]:`, err?.message ?? err);
    });

    this.setupHandlers();

    try {
      await this.bot.telegram.setMyCommands([
        { command: 'start',   description: "Botni ishga tushirish" },
        { command: 'shop',    description: "Do'konni ochish" },
        { command: 'profile', description: "Profilni ko'rish" },
        { command: 'orders',  description: "Buyurtmalar tarixini ko'rish" },
        { command: 'help',    description: "Yordam va qo'llab-quvvatlash" },
      ]);

      // Persistent Web App menu button
      const webAppUrl = this.getWebAppUrl();
      try {
        await this.bot.telegram.setChatMenuButton({
          menuButton: {
            type: 'web_app',
            text: "Do'konni ochish",
            web_app: { url: webAppUrl },
          },
        });
        console.log('[Bot] Chat menu button set to WebApp:', webAppUrl);
      } catch (menuError: any) {
        console.warn('[Bot] Could not set Chat Menu Button:', menuError?.message);
      }

      // Webhook (production) vs polling (development)
      const webhookUrl = this.configService.get<string>('WEBHOOK_URL');
      if (process.env.NODE_ENV === 'production' && webhookUrl) {
        await this.bot.launch({
          webhook: {
            domain: webhookUrl,
            port: Number(this.configService.get<string>('WEBHOOK_PORT') ?? 3001),
          },
        });
        console.log(`[Bot] Started in webhook mode: ${webhookUrl}`);
      } else {
        await this.bot.launch();
        console.log('[Bot] Started in polling mode');
      }
    } catch (error: any) {
      console.error('[Bot] Error starting bot:', error?.message);
    }
  }

  async onModuleDestroy() {
    if (this.bot) {
      this.bot.stop('SIGTERM');
      console.log('[Bot] Stopped gracefully');
    }
  }

  // ─── Admin notifications ─────────────────────────────────────────────────────

  async notifyAdminDeposit(deposit: any) {
    const adminChatId = this.configService.get<string>('ADMIN_CHAT_ID');

    if (!this.bot) {
      console.error('[Bot] Not initialized. Cannot send admin notification.');
      return;
    }
    if (!adminChatId || isNaN(parseInt(adminChatId, 10))) {
      console.error('[Bot] ADMIN_CHAT_ID is missing or invalid. Notification skipped.');
      return;
    }

    const user = deposit.user ?? {};
    const amount = Number(deposit.amount).toLocaleString('ru-RU');
    const message =
      `💰 New Deposit Request\n\n` +
      `Deposit ID: #${deposit.id}\n` +
      `User: @${user.username ?? 'user'}\n` +
      `User ID: ${user.telegramId ?? '-'}\n` +
      `Amount: ${amount} UZS\n` +
      `Status: Pending`;

    await this.bot.telegram.sendMessage(adminChatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Approve', callback_data: `approve_deposit:${deposit.id}` },
            { text: '❌ Reject',  callback_data: `reject_deposit:${deposit.id}` },
          ],
        ],
      },
    });
  }

  async notifyUser(telegramId: string, text: string) {
    if (!this.bot || !telegramId) return;
    try {
      await this.bot.telegram.sendMessage(telegramId, text);
    } catch (err: any) {
      console.error(`[Bot] Failed to notify user ${telegramId}:`, err?.message);
    }
  }

  // ─── Handlers ────────────────────────────────────────────────────────────────

  private setupHandlers() {
    if (!this.bot) return;

    const webAppUrl = this.getWebAppUrl();
    console.log('[Bot] WebApp URL:', webAppUrl);

    // /start — register user + show WebApp button
    this.bot.start(async (ctx) => {
      console.log('[Bot] /start from:', ctx.from.id, ctx.from.username);

      // 1. Fetch profile photo (best-effort)
      let photoUrl: string | undefined;
      try {
        const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
        if (photos.total_count > 0) {
          const fileId = photos.photos[0][0].file_id;
          const fileLink = await ctx.telegram.getFileLink(fileId);
          photoUrl = fileLink.href;
          console.log('[Bot] Profile photo fetched:', photoUrl);
        }
      } catch (photoErr: any) {
        console.warn('[Bot] Could not fetch profile photo:', photoErr?.message);
      }

      // 2. Save / update user in DB
      try {
        await this.authService.registerFromBot({
          id: ctx.from.id,
          username: ctx.from.username,
          first_name: ctx.from.first_name,
          photo_url: photoUrl,
        });
        console.log('[Bot] User registered/updated:', ctx.from.id);
      } catch (regErr: any) {
        console.error('[Bot] registerFromBot failed:', regErr?.message);
        // Do NOT return — still show the button even if DB failed
      }

      // 3. Reply with WebApp button (always inline_keyboard, never plain URL)
      const greeting =
        `Xush kelibsiz, ${ctx.from.first_name ?? 'foydalanuvchi'}! 🎮\n\n` +
        `GamePayBot orqali o'yinlar uchun paketlarni tez va arzon sotib oling.`;

      try {
        await ctx.reply(greeting, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🛍 Do'konni ochish", web_app: { url: webAppUrl } }],
            ],
          },
        });
      } catch (replyErr: any) {
        console.error('[Bot] Reply with markup failed:', replyErr?.message);
        // Last-resort fallback (should not normally happen)
        await ctx.reply(greeting).catch(() => {});
      }
    });

    // /shop
    this.bot.command('shop', async (ctx) => {
      try {
        await ctx.reply("Do'konni ochish uchun quyidagi tugmani bosing:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🛍 Do'kon", web_app: { url: webAppUrl } }],
            ],
          },
        });
      } catch (e: any) {
        console.error('[Bot] /shop error:', e?.message);
      }
    });

    // /profile
    this.bot.command('profile', async (ctx) => {
      try {
        await ctx.reply("Profil ma'lumotlarini ko'rish uchun ilovani oching:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: '👤 Profilim', web_app: { url: `${webAppUrl}/profile` } }],
            ],
          },
        });
      } catch (e: any) {
        console.error('[Bot] /profile error:', e?.message);
      }
    });

    // /orders
    this.bot.command('orders', async (ctx) => {
      try {
        await ctx.reply("Barcha buyurtmalaringiz ro'yxati:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: '📋 Buyurtmalarim', web_app: { url: `${webAppUrl}/history` } }],
            ],
          },
        });
      } catch (e: any) {
        console.error('[Bot] /orders error:', e?.message);
      }
    });

    // /help
    this.bot.help((ctx) => {
      ctx
        .reply("Savollaringiz bormi? Biz bilan bog'laning:\n\n👨‍💻 Admin: @Yoldashaliyev_19")
        .catch(() => {});
    });

    // Deposit approve/reject callbacks
    this.bot.action(/^approve_deposit:(.+)$/, (ctx) =>
      this.handleDepositAction(ctx, 'approve', ctx.match[1]),
    );
    this.bot.action(/^reject_deposit:(.+)$/, (ctx) =>
      this.handleDepositAction(ctx, 'reject', ctx.match[1]),
    );
  }

  private async handleDepositAction(
    ctx: any,
    action: DepositAction,
    depositId: string,
  ) {
    try {
      if (!this.depositActionHandler) {
        await ctx.answerCbQuery('Xatolik: handler topilmadi');
        return;
      }

      const result = await this.depositActionHandler(action, depositId);
      await ctx.answerCbQuery(result);
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] }).catch(() => {});
      await ctx.reply(result);
    } catch (e: any) {
      console.error(`[Bot] handleDepositAction (${action}) error:`, e?.message);
      await ctx.answerCbQuery(e?.message?.slice(0, 190) ?? 'Xatolik').catch(() => {});
    }
  }

  // ─── Helper ──────────────────────────────────────────────────────────────────

  /**
   * Returns a guaranteed-https WebApp URL.
   * Telegram requires https:// for all Web App URLs — http:// silently breaks the button.
   */
  private getWebAppUrl(): string {
    const raw =
      this.configService.get<string>('NEXT_PUBLIC_BASE_URL') ?? '';

    if (!raw) {
      console.error('[Bot] NEXT_PUBLIC_BASE_URL is not set!');
      // Return empty string — button creation will still work but URL will be wrong
      return '';
    }

    if (raw.startsWith('https://')) return raw;

    if (raw.startsWith('http://')) {
      const fixed = raw.replace(/^http:\/\//, 'https://');
      console.warn(`[Bot] URL converted to HTTPS: ${raw} → ${fixed}`);
      return fixed;
    }

    // No protocol at all — prepend https://
    const fixed = `https://${raw}`;
    console.warn(`[Bot] No protocol in URL, prepending https://: ${fixed}`);
    return fixed;
  }
}