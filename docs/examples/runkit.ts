const { CommandHandler, Command } = require("vnft-commandhandler");
const axios = require("axios");

const client = new CommandHandler();
const Discord_Token = "Discord Token";

client.prefix = "!";

const pingCommand = new Command();
pingCommand.name = "ping";
pingCommand.funct = (bot, message, args) => {
  message.reply("Pong!");
};

const neko = new Command();
neko.name = "neko";
neko.addAlias("cat");
neko.funct = async (bot, message, args) => {
  var meow = await axios.get("http://aws.random.cat/meow");
  message.reply(meow.data.file);
};

const activity = new Command();
activity.name = "setActivity";
activity.addAlias("activity");
activity.funct = async (bot, message, args) => {
  await bot.user.setActivity(args);
  message.reply(`Status Updated`);
};

client.addCommand(pingCommand);
client.addCommand(neko);
client.addCommand(activity);

client.login(Discord_Token);
