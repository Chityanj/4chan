const x = require("x-ray-scraper");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const keywords = ["airdrop", "giveway", "free"];
const Chan = require("./model/Chan");

dotenv.config({ path: "./config.env" });
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const sentMessage = () => {
  x("https://boards.4channel.org/biz/", ".thread", [
    {
      postId: ".postNum.desktop > a:nth-child(2)",
      subject: ".subject",
      link: "a@href",
    },
  ]).then(async (obj) => {
    for (let i = 0; i < obj.length; i++) {
      for (let k = 0; k < keywords.length; k++) {
        if (obj[i]?.subject) {
          if (obj[i].subject.toLowerCase().indexOf(keywords[k]) !== -1) {
            const post = await Chan.findOne({ postId: obj[i].postId });
            if (post) continue;
            const apiLink = `https://api.telegram.org/bot${process.env.TOKEN}/sendMessage?chat_id=${process.env.CHAT}&text=${obj[i].link}`;
            await fetch(apiLink);
            await Chan.create(obj[i]);
          }
        }
      }
    }
    process.exit();
  });
};

sentMessage();
