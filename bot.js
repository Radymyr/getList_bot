import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import 'dotenv/config';

const bot = new Telegraf(process.env.TOKEN);

let userMessages = {};
let userMessageIds = {};
let isActiveBot = false;
const LIST_LENGTH = 10;

bot.command('on', async () => (isActiveBot = true));
bot.command('off', async () => (isActiveBot = false));

bot.on(message('text'), async (ctx) => {
  try {
    if (ctx.message.text === '/start') {
      return;
    }

    if (!isActiveBot) {
      return;
    }

    const userId = ctx.from.id + ctx.chat.id || '';

    const userName = ctx.from.first_name || ctx.from.username || 'Аноним';

    if (!userMessages[userId]) {
      userMessages[userId] = [];
      userMessageIds[userId] = [];
    }

    if (userMessages[userId].length >= LIST_LENGTH) {
      userMessageIds[userId] = [];
      userMessages[userId] = [];
    }

    if (
      ctx.chat.type === 'group' ||
      ctx.chat.type === 'supergroup' ||
      ctx.chat.type === 'private'
    ) {
      userMessages[userId].push(ctx.message.text);

      if (userMessageIds[userId].length > 0) {
        for (const msgId of userMessageIds[userId]) {
          try {
            await ctx.deleteMessage(msgId);
          } catch (error) {
            console.error('Ошибка при удалении сообщения:', error);
          }
        }
        userMessageIds[userId] = [];
      }

      const response =
        `*${userName}:*\n` +
        userMessages[userId]
          .map((msg, index) => `\`${index + 1}. ${msg}\``)
          .join('\n');

      const sentMessage = await ctx.reply(response, { parse_mode: 'Markdown' });
      userMessageIds[userId].push(sentMessage.message_id);

      console.log(response);

      await ctx.deleteMessage();
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
});

bot.on('new_chat_members', (ctx) => {
  console.log('новый пользователь добавлен');
});

bot.on('left_chat_member', (ctx) => {
  if (ctx.message.left_chat_member.id === ctx.botInfo.id) {
    for (const userId in userMessages) {
      delete userMessages[userId];
      delete userMessageIds[userId];
    }
  }
});

bot.launch().then(() => console.log('Bot is running...'));
