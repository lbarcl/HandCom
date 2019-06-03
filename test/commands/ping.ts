import { Command } from "../../src";

const ping = new Command();
ping.name = "ping";

ping.funct = (client, message, args) => {
  message.reply("pongo!!");
};

ping.addUserWhitelist(u => u.id == "397063436049186818");

module.exports = ping;
