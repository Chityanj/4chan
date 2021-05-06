const http = require("http");

const x = require("x-ray-scraper");
const cron = require("node-cron");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const keywords = ["airdrop", "giveaway", "air-dropping","claim","claim your free tokens","free tokens"];
const Chan = require("./model/Chan");
const TelegramBot = require("node-telegram-bot-api");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const sentMessage = (bot) => {
  x("https://boards.4channel.org/biz/", ".thread", [
    {
      postId: ".postNum.desktop > a:nth-child(2)",
      subject: ".subject",
      link: "a@href",
      desp: ".postMessage",
    },
  ]).then(async (obj) => {
    for (let i = 0; i < obj.length; i++) {
      for (let k = 0; k < keywords.length; k++) {
        if (obj[i]?.desp) {
          if (obj[i]?.desp?.toLowerCase().indexOf(keywords[k]) !== -1) {
            const post = await Chan.findOne({ postId: obj[i].postId });
            if (post) continue;
            console.log(process.env.CHAT, obj[i].link)
            bot.sendMessage(
              process.env.CHAT,
              `Subject: <b>${obj[i]?.subject}</b> \n ${obj[i].link}`,
              {
                parse_mode: "HTML",
              }
            );
            await Chan.create(obj[i]);
          }
        }
      }
    }
     bot.sendMessage(chatId,"@Prashant69 @Onkar_k @kstbh @ProPrk @Rk585 @amndngi @Cryptotion @TechyHk @lmbu2 @MRNOBODY00000000000000000000 @MaDs718 @lmbu2 @OJ_404 @justaguy30 @mandar19 @chityanj");
  });
};

bot.onText(/\/scan/, (msg, match) => {
  const chatId = msg.chat.id;

  x("https://boards.4channel.org/biz/", ".thread", [
    {
      postId: ".postNum.desktop > a:nth-child(2)",
      subject: ".subject",
      link: "a@href",
      desp: ".postMessage",
    },
  ]).then(async (obj) => {
    for (let i = 0; i < obj.length; i++) {
      for (let k = 0; k < keywords.length; k++) {
        if (obj[i]?.desp) {
          if (obj[i]?.desp?.toLowerCase().indexOf(keywords[k]) !== -1) {
             bot.sendMessage(
              chatId,
              `Subject: <b>${obj[i]?.subject}</b> \n ${obj[i].link}`,
              {
                parse_mode: "HTML",
              }
            );
            
          }
        }
      }
    }
  });
});

bot.onText(/\/search/, (msg, match) => {
  const chatId = msg.chat.id;
  const input = match.input.split(" ")[1];

  if (input === undefined) {
    bot.sendMessage(
      chatId,
      "Please provide keywords split by comma ',' or send a single keyword like 'mads-gay'"
    );
    return;
  }
  const keywords = input.split(",");

  x("https://boards.4channel.org/biz/", ".thread", [
    {
      postId: ".postNum.desktop > a:nth-child(2)",
      subject: ".subject",
      link: "a@href",
      desp: ".postMessage",
    },
  ]).then(async (obj) => {
    for (let i = 0; i < obj.length; i++) {
      for (let k = 0; k < keywords.length; k++) {
        if (obj[i]?.desp) {
          if (obj[i].desp.toLowerCase().indexOf(keywords[k]) !== -1) {
             bot.sendMessage(
              chatId,
              `Subject: <b>${obj[i]?.subject}</b> \n ${obj[i].link}`,
              {
                parse_mode: "HTML",
              }
            );
          }
        }
      }
    }
  });
});

cron.schedule("* * * * *", () => {
  console.log('Running Scheduler --------------------------')         
  sentMessage(bot);
});

var server = http.createServer(function (req, res) {
  res.writeHead(200, {});
  res.end("response");
  badLoggingCall("sent response");
  console.log("sent response");
});
process.on("uncaughtException", function (e) {
  console.log(e);
});
const PORT = process.env.PORT || 5000;
server.listen(PORT);

bot.on("polling_error", (err) => console.log(err));
