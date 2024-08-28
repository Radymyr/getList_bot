import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import 'dotenv/config';

const bot = new Telegraf(process.env.TOKEN);

let userMessages = {};
let userMessageIds = {};
let chatStatus = {};
let listLength = Infinity;

bot.command('start_list', async (ctx) => {
  const chatId = ctx.chat.id;
  chatStatus[chatId] = true;

  ctx.deleteMessage();
});

bot.command('stop_list', async (ctx) => {
  const chatId = ctx.chat.id;
  chatStatus[chatId] = false;

  ctx.deleteMessage();
});

bot.command('new_list', async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;
  chatStatus[chatId] = true;

  const args = ctx.message?.text.split(' ');
  if (args.length > 1) {
    const number = parseInt(args[1]);
    listLength = !isNaN(number) ? number : Infinity;
  } else {
    listLength = Infinity;
  }

  userMessages[userId + chatId] = [];
  userMessageIds[userId + chatId] = [];
  await ctx.deleteMessage();
});

bot.on(message('text'), async (ctx) => {
  try {
    const chatId = ctx.chat.id;

    if (ctx.message.text === '/start') {
      return;
    }

    if (!chatStatus[chatId]) {
      return;
    }

    const userId = ctx.from.id + chatId || '';

    const userName = ctx.from.first_name || ctx.from.username || 'Аноним';

    if (!userMessages[userId]) {
      userMessages[userId] = [];
      userMessageIds[userId] = [];
    }

    if (userMessages[userId].length >= listLength) {
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
