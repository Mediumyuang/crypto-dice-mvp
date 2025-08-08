import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get bot token with fallback to the provided token
const BOT_TOKEN = process.env.BOT_TOKEN || '8239590265:AAG0KqRXiv4h8ezDVXNZOVDBQ2nXPBDPH7Y';
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000';

// Create bot instance
const bot = new Telegraf(BOT_TOKEN);

// Middleware to log updates
bot.use((ctx, next) => {
    console.log(`Received update: ${ctx.updateType} from user ${ctx.from?.id}`);
    return next();
});

// Start command
bot.command('start', async (ctx) => {
    const welcomeMessage = `
🎲 Добро пожаловать в Crypto Dice!

Играйте в кости и выигрывайте TON токены на тестнете.

Нажмите кнопку ниже, чтобы начать игру:
  `;

    await ctx.reply(welcomeMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🎲 Играть в кости',
                        web_app: {
                            url: `${WEBAPP_URL}?user_id=${ctx.from.id}`
                        }
                    }
                ]
            ]
        }
    });
});

// Handle web app data
bot.on('web_app_data', async (ctx) => {
    console.log('Web app data received:', ctx.message?.web_app_data);
});

// Error handling
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
});

// Start the bot
bot.launch()
    .then(() => {
        console.log('🤖 Bot started successfully!');
        console.log(`📱 WebApp URL: ${WEBAPP_URL}`);
    })
    .catch((err) => {
        console.error('Failed to start bot:', err);
    });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
