import { Command } from "./Command";
import { CommandHandler } from ".";
import { Message } from "discord.js";

const help = new Command();

help.name = "help";
help.addAlias("info");

help.funct = (bot: CommandHandler, message: Message, args: String) => {
  message.channel.send("(this is a early version of the feature)");
  if (args) {
    commandInfo(bot, message, args);
  } else {
    generalInfo(bot, message);
  }
};

function generalInfo(bot: CommandHandler, message: Message) {
  message.channel.send(`commands:\n${bot.commands.map(c => c.name).join("\n")}`);
}

function commandInfo(bot: CommandHandler, message: Message, command: String) {
  message.channel.send(`Information of the command: ${command}`);
}

module.exports = help;
