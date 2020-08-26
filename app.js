const TelegramBot = require("node-telegram-bot-api");
const ping = require("ping");
const fs = require("fs");
// replace the value below with the Telegram token you receive from @BotFather
const token = "1258591822:AAGFIEdaJDXFap-7CZSYGg6qUns1RXfesvU";
let data = JSON.parse(fs.readFileSync("data.json"));
// console.log(typeof data);
console.log(data);
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
let pingtime = 1000;

// Matches "/echo [whatever]"
bot.onText(/\/addsite (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  const obj = {
    url: resp,
  };
  if (!data.sites.includes(match[1])) {
    data.sites.push(match[1]);
  }
  fs.writeFileSync("data.json", JSON.stringify(data));
  console.log(data);
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
bot.onText(/\/show/, (msg) => {
  const chatId = msg.chat.id;
  data.sites.forEach((site) => {
    console.log(typeof site);
    bot.sendMessage(chatId, `Сайт в базе: ${site}`);
  });
});
bot.onText(/\/remove (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  console.log(resp);
  // data.sites.splice(index, 1);
  data.sites = data.sites.filter((e) => e !== resp);
  console.log(typeof resp);
  // arr = arr.filter(e => e !== 'B');
  fs.writeFileSync("data.json", JSON.stringify(data));
  bot.sendMessage(chatId, `Сайт ${resp} удален из базы`);
});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Сайт принят');
// });
