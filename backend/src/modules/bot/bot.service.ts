import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

type DepositAction = 'approve' | 'reject';
type DepositActionHandler = (action: DepositAction, depositId: string) => Promise<string>;

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf | null = null;
  // Lazily-resolved handler registered by DepositsService to keep the modules decoupled.
  private depositActionHandler: DepositActionHandler | null = null;

  constructor(private configService: ConfigService) {}

  registerDepositActionHandler(handler: DepositActionHandler) {
    this.depositActionHandler = handler;
  }

  async onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    const adminChatId = this.configService.get<string>('ADMIN_CHAT_ID');

    if (!token || token === 'your_telegram_bot_token_here') {
      console.error('BOT_TOKEN is missing or invalid! Bot not started.');
      return;
    }

    if (!adminChatId) {
      console.warn('ADMIN_CHAT_ID is not set! Admin notifications will not work.');
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Admin notifications will be sent to: ${adminChatId}`);
      }
    }

    this.bot = new Telegraf(token);
    this.setupHandlers();

    try {
      const webAppUrl = this.configService.get<string>('NEXT_PUBLIC_BASE_URL') || 'http://localhost:3000';

      await this.bot.telegram.setMyCommands([
        { command: 'start', description: 'Botni ishga tushirish' },
        { command: 'shop', description: 'Do\'konni ochish' },
        { command: 'profile', description: 'Profilni ko\'rish' },
        { command: 'orders', description: 'Buyurtmalar tarixini ko\'rish' },
        { command: 'help', description: 'Yordam va qo\'llab-quvvatlash' },
      ]);

      try {
        await this.bot.telegram.setChatMenuButton({
          menuButton: {
            type: 'web_app',
            text: 'Open',
            web_app: { url: webAppUrl },
          },
        });
      } catch (menuError) {
        // @ts-ignore
        console.warn('Could not set Chat Menu Button (likely due to non-HTTPS URL in dev):', menuError.message);
      }

      await this.bot.launch();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Telegram Bot started successfully with commands');
      }
    } catch (error) {
      console.error('Error starting Telegram Bot:', error);
    }
  }

  /** Send a new deposit request to the admin chat with Approve/Reject buttons. */
  async notifyAdminDeposit(deposit: any) {
    const adminChatId = this.configService.get<string>('ADMIN_CHAT_ID');
    if (!this.bot) {
      console.error('ERROR: Bot is not initialized. Cannot send admin notification.');
      return;
    }
    if (!adminChatId) {
      console.error('ERROR: ADMIN_CHAT_ID is not set in configuration. Admin notification skipped.');
      return;
    }

    const user = deposit.user || {};
    const amount = Number(deposit.amount).toLocaleString('ru-RU');
    const message =
      `💰 New Deposit Request\n\n` +
      `Deposit ID: #${deposit.id}\n` +
      `User: @${user.username || 'user'}\n` +
      `User ID: ${user.telegramId || '-'}\n` +
      `Amount: ${amount} UZS\n` +
      `Status: Pending`;

    await this.bot.telegram.sendMessage(adminChatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Approve', callback_data: `approve_deposit:${deposit.id}` },
            { text: '❌ Reject', callback_data: `reject_deposit:${deposit.id}` },
          ],
        ],
      },
    });
  }

  /** Send a direct message to a user by their Telegram id. */
  async notifyUser(telegramId: string, text: string) {
    if (!this.bot || !telegramId) return;
    await this.bot.telegram.sendMessage(telegramId, text);
  }

  private setupHandlers() {
    if (!this.bot) return;
    const webAppUrl = this.configService.get<string>('NEXT_PUBLIC_BASE_URL') || 'https://localhost:3000';
    // Telegram only allows HTTPS for WebApp buttons. 
    const isHttps = webAppUrl.startsWith('https://');
    
    if (!isHttps) {
      console.error('CRITICAL: WebApp URL must use HTTPS. Current URL:', webAppUrl);
    }

    this.bot.start(async (ctx) => {
      try {
        const replyMarkup = isHttps ? {
          inline_keyboard: [
            [{ text: '🚀 Do\'konni ochish', web_app: { url: webAppUrl } }],
          ],
        } : {
          inline_keyboard: [
            [{ text: '🔗 Brauzerda ochish', url: webAppUrl }],
          ],
        };

        await ctx.replyWithMarkdownV2(`*Xush kelibsiz, ${ctx.from.first_name || 'foydalanuvchi'}\\!* 🎮\n\nGang Pay orqali o'yinlar uchun paketlarni tez va arzon sotib oling\\.`, {
          reply_markup: replyMarkup,
        });
      } catch (e) {
        console.error('Bot start reply failed:', (e as Error).message);
        await ctx.reply(`Xush kelibsiz! Ilovani ochish uchun bosing: ${webAppUrl}`);
      }
    });

    this.bot.command('shop', async (ctx) => {
      try {
        if (isHttps) {
          await ctx.reply('Savdo qilish uchun pastdagi tugmani bosing:', {
            reply_markup: {
              inline_keyboard: [[{ text: '🛍 Do\'kon', web_app: { url: webAppUrl } }]],
            },
          });
        } else {
          await ctx.reply(`Savdo qilish uchun brauzer orqali kiring:\n${webAppUrl}`);
        }
      } catch (e) {
        await ctx.reply(`Do'kon: ${webAppUrl}`);
      }
    });

    this.bot.command('profile', (ctx) => {
      const url = `${webAppUrl}/profile`;
      if (isHttps) {
        ctx.reply('Profil ma\'lumotlarini ko\'rish uchun ilovani oching:', {
          reply_markup: {
            inline_keyboard: [[{ text: '👤 Profilim', web_app: { url } }]],
          },
        });
      } else {
        ctx.reply(`Profil uchun havola:\n${url}`);
      }
    });

    this.bot.command('orders', (ctx) => {
      const url = `${webAppUrl}/history`;
      if (isHttps) {
        ctx.reply('Barcha buyurtmalaringiz ro\'yxati ilovada:', {
          reply_markup: {
            inline_keyboard: [[{ text: '📋 Buyurtmalarim', web_app: { url } }]],
          },
        });
      } else {
        ctx.reply(`Buyurtmalar uchun havola:\n${url}`);
      }
    });

    this.bot.help((ctx) => {
      ctx.reply('Savollaringiz bormi? Biz bilan bog\'laning:\n\n👨‍💻 Admin: @Yoldashaliyev_19');
    });

    // Admin Approve / Reject inline-button callbacks.
    this.bot.action(/^approve_deposit:(.+)$/, (ctx) => this.handleDepositAction(ctx, 'approve'));
    this.bot.action(/^reject_deposit:(.+)$/, (ctx) => this.handleDepositAction(ctx, 'reject'));
  }

  private async handleDepositAction(ctx: any, action: DepositAction) {
    const depositId = ctx.match?.[1];
    try {
      if (!this.depositActionHandler || !depositId) {
        await ctx.answerCbQuery('Ishlov beruvchi mavjud emas');
        return;
      }
      const result = await this.depositActionHandler(action, depositId);
      await ctx.answerCbQuery(result);
      // Replace the inline keyboard so the action can't be repeated.
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] }).catch(() => {});
      await ctx.reply(result);
    } catch (e: any) {
      await ctx.answerCbQuery(e?.message?.slice(0, 190) || 'Xatolik').catch(() => {});
    }
  }
}
