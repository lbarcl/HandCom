import { Command } from "./Command";
import { CommandHandler } from ".";
import { Message, RichEmbed } from "discord.js";

const help = new Command();

help.name = "help";
help.addAlias("info");

help.description = "gives out general or specific command-infos";
help.usage = "`[command]` or nothing";

help.funct = (bot: CommandHandler, message: Message, args: string) => {
  if (args) {
    commandInfo(bot, message, args);
  } else {
    generalInfo(bot, message);
  }
};

/**
 * Sends a RichEmbed with all the commands of the bot
 * @param {CommandHandler} bot the bot of which the commands should be send
 * @param {message} message the message to which the reply should be made
 */
function generalInfo(bot: CommandHandler, message: Message) {
  const response = new RichEmbed();
  response.setTitle("Commands");
  if (bot.helpColor) {
    response.setColor(bot.helpColor);
  }
  for (let command of bot.commands) {
    let name = command.name ? `${bot.prefix}**${command.name}**` : "\u200B";
    let description = command.description ? command.description : "\u200B";
    response.addField(name, description);
  }
  message.channel.send("", response);
}

/**
 * Sends a RichEmbed with the details of a command
 * @param {CommandHandler} bot the bot of which the command should be searched
 * @param {message} message the message to which the reply should be made
 * @param {string} commandname the targeted command which should be told about
 */
function commandInfo(bot: CommandHandler, message: Message, commandname: string) {
  const response = new RichEmbed();
  const command = bot.commands.find(c => c.name == commandname || c.alias.includes(commandname));
  if (command) {
    response.setTitle(`**${bot.prefix}${command.name}**`);
    if (bot.helpColor) {
      response.setColor(bot.helpColor);
    }
    response.addField("Alias", command.alias.join(", ") || `*(no alias)*`);
    response.addField("Description", command.description);
    response.addField("Usage", `${bot.prefix}${command.name} ${command.usage}`);
    message.channel.send("", response);
  } else {
    message.reply(`command "${bot.prefix}**${commandname}**" not found.`);
  }
}

module.exports = help;
