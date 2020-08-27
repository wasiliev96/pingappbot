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
let pingtime = 2000;
let intervals = [];

// menu

// end of menu

bot.onText(/\/start/, (msg) => {
  msg.chat.id = msg.chat.id;
});
// Matches "/echo [whatever]"
bot.onText(/\/add (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

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
    msg.chat.id,
    `Сайт ${resp} записан в базу данных. Опрос будет производиться один раз в ${
      pingtime / 1000
    } секунд`
  );
});
bot.onText(/\/timer (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const resp = match[1]; // the captured "whatever"
  pingtime = resp;
  // send back the matched "whatever" to the chat
  bot.sendMessage(
    msg.chat.id,
    `Частота опроса теперь - 1 раз в ${resp / 1000} секунд`
  );
});
bot.onText(/\/stop/, (msg) => {
  stopIntervals();
  bot.sendMessage(msg.chat.id, "stopping...");
});
bot.onText(/\/list/, (msg) => {
  data.sites.forEach((site) => {
    console.log(typeof site);
    bot.sendMessage(msg.chat.id, `Сайт в базе: ${site}`);
  });
});
bot.onText(/\/remove (.+)/, (msg, match) => {
  const resp = match[1];
  console.log(resp);
  // data.sites.splice(index, 1);
  data.sites = data.sites.filter((e) => e !== resp);
  console.log(typeof resp);
  // arr = arr.filter(e => e !== 'B');
  fs.writeFileSync("data.json", JSON.stringify(data));
  bot.sendMessage(msg.chat.id, `Сайт ${resp} удален из базы`);
});
bot.onText(/\/run/, (msg) => {
  runIntervals(msg.chat.id);
  bot.sendMessage(msg.chat.id, `Running...`);
});
// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(msg.chat.id, 'Сайт принят');
// });

function stopIntervals() {
  intervals.map((interval) => {
    // console.log(interval);
    clearInterval(interval);
    arr = [];
  });
}
function runIntervals(chatId) {
  data.sites.forEach(function (host) {
    console.log(host);
    intervals.push(
      setInterval(function () {
        ping.sys.probe(host, function (active) {
          var info = active
            ? "IP " + host + " = Active"
            : "IP " + host + " = Non-Active";
          console.log(info);
          !active && bot.sendMessage(chatId, `${host} is down!`);
        });
      }, pingtime)
    );
  });
}
