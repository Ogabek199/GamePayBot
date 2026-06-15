import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;

  async onModuleInit() {
    const token = process.env.BOT_TOKEN;
    if (!token || token === 'your_telegram_bot_token_here') {
      console.error('BOT_TOKEN is missing or invalid! Bot not started.');
      return;
    }

    this.bot = new Telegraf(token);
    this.setupHandlers();

    try {
      // Set the menu button
      const webAppUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      await this.bot.telegram.setMyCommands([
        { command: 'start', description: 'Botni ishga tushirish' },
        { command: 'shop', description: 'Do\'konni ochish' },
        { command: 'profile', description: 'Profilni ko\'rish' },
        { command: 'orders', description: 'Buyurtmalar tarixini ko\'rish' },
        { command: 'help', description: 'Yordam va qo\'llab-quvvatlash' },
      ]);

      await this.bot.telegram.setChatMenuButton({
        menuButton: {
          type: 'web_app',
          text: 'Ilovani ochish',
          web_app: { url: webAppUrl },
        },
      });

      await this.bot.launch();
      console.log('Telegram Bot started successfully with commands');
    } catch (error) {
      console.error('Error starting Telegram Bot:', error);
    }
  }

  private setupHandlers() {
    this.bot.start((ctx) => {
      const webAppUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      ctx.replyWithMarkdownV2(`*Xush kelibsiz, ${ctx.from.first_name || 'foydalanuvchi'}\\!* 🎮\n\nGang Pay orqali o'yinlar uchun paketlarni tez va arzon sotib oling\\.`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Do\'konni ochish',
                web_app: { url: webAppUrl },
              },
            ],
          ],
        },
      });
    });

    this.bot.command('shop', (ctx) => {
      const webAppUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      ctx.reply('Savdo qilish uchun pastdagi tugmani bosing:', {
        reply_markup: {
          inline_keyboard: [[{ text: '🛍 Do\'kon', web_app: { url: webAppUrl } }]],
        },
      });
    });

    this.bot.command('profile', (ctx) => {
      const webAppUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      ctx.reply('Profil ma\'lumotlarini va balansingizni ko\'rish uchun ilovani oching:', {
        reply_markup: {
          inline_keyboard: [[{ text: '👤 Profilim', web_app: { url: `${webAppUrl}/profile` } }]],
        },
      });
    });

    this.bot.command('orders', (ctx) => {
      const webAppUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      ctx.reply('Barcha buyurtmalaringiz ro\'yxati ilovada:', {
        reply_markup: {
          inline_keyboard: [[{ text: '📋 Buyurtmalarim', web_app: { url: `${webAppUrl}/orders` } }]],
        },
      });
    });

    this.bot.help((ctx) => {
      ctx.reply('Savollaringiz bormi? Biz bilan bog\'laning:\n\n👨‍💻 Admin: @@Yoldashaliyev_19\n📢 Kanalimiz: @channel_link');
    });
  }
}
