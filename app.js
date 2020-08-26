const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const token = "1258591822:AAGFIEdaJDXFap-7CZSYGg6qUns1RXfesvU";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
let pingtime = 1000;
// Matches "/echo [whatever]"
bot.onText(/\/site (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(
    chatId,
    `Сайт ${resp} записан в базу данных. Опрос будет производиться один раз в ${
      pingtime / 1000
    } секунд`
  );
});
bot.onText(/\/time (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  pingtime = resp;
  // send back the matched "whatever" to the chat
  bot.sendMessage(
    chatId,
    `Частота опроса теперь - 1 раз в ${resp / 1000} секунд`
  );
});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Сайт принят');
// });
