const { CommandHandler, Command } = require("vnftjs");
const axios = require("axios");

// initialisation
const client = new CommandHandler();
const Discord_Token = "Discord Token";

// sets the prefix for the bot to !
client.prefix = "!";

// !ping
const pingCommand = new Command();
pingCommand.name = "ping";
pingCommand.funct = (bot, message, args) => {
  message.reply("Pong!");
};

// !neko or !cat
const neko = new Command();
neko.name = "neko";
neko.addAlias("cat");
neko.description = "replies a random cat image with the help of random.cat";
neko.usage = "";
neko.funct = async (bot, message, args) => {
  var meow = await axios.get("http://aws.random.cat/meow");
  message.reply(meow.data.file);
};

// !help
client.enableHelp();
client.helpColor = "GREEN";

// this simulates client.loadCommands(path)
client.addCommand(pingCommand);
client.addCommand(neko);

client.login(Discord_Token);
