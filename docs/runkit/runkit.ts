const { CommandHandler, Command, Script } = require("vnftjs");
const axios = require("axios");

// initialisation
const client = new CommandHandler();
const Discord_Token = "Discord Token";

// sets the prefix for the bot to !
client.prefix = "!";

// !ping
const command = new Command();
command.name = "ping";
command.funct = (bot, message, args) => {
  message.reply("Pong!");
};

// !neko or !cat
const command2 = new Command();
command2.name = "neko";
command2.addAlias("cat");
command2.description = "replies a random cat image with the help of random.cat";
command2.usage = "";
command2.funct = async (bot, message, args) => {
  var meow = await axios.get("http://aws.random.cat/meow");
  message.reply(meow.data.file);
};

// dnd at start of bot
const script = new Script();

script.funct = client => {
  client.user.setStatus("dnd");
};

// !help
client.enableHelp();
client.helpColor = "GREEN";

// this simulates client.loadCommands(path)
client.addCommand(command);
client.addCommand(command2);
client.addScript(script);

client.login(Discord_Token);
