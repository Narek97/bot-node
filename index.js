const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "2031307682:AAHkPzJb9OFPOEfH_yiXLMWP-EOSdqIFlfE";

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "first hello" },
    { command: "/info", description: "get user info" },
    { command: "/game", description: "play game" },
  ]);

  const startGame = async (chatId) => {
    await bot.sendMessage(
      chatId,
      `Now I have guessed a number from 0 to 9, try to guess`
    );
    const randomNumber = Math.floor(Math.random() * 10);

    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Guess", gameOptions);
  };

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/8.webp"
      );
      return bot.sendMessage(chatId, "welcome to telegram bot. author Narek");
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Your name ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    await bot.sendSticker(
      chatId,
      "https://tlgrm.eu/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/1.webp"
    );
    return bot.sendMessage(chatId, `I do not understand you`);
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id.toString();
    if (data === "/again") {
      return startGame(chatId);
    }
    if (+data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `You win, you guess number ${data} `,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `You didn’t win the bot guessed the number ${chats[chatId]} `,
        againOptions
      );
    }
  });
};

start();
