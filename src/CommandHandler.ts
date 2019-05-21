import { Client, Message, ColorResolvable } from "discord.js";
import { Command } from "./Command";
import { Script } from "./Script";
import { fetchJS } from "vnft-tools";
import * as fs from "fs";

export class CommandHandler extends Client {
  commands: Command[];
  scripts: Script[];
  scriptsTriggered: boolean;
  prefix: string;
  helpColor: ColorResolvable;

  /**
   * The constructor of the CommandHandler class.
   * @constructor
   */
  constructor() {
    super();
    this.commands = [];
    this.scripts = [];
    this.prefix = ".";
    this.on("message", message => this.commandListener(message));
    this.on("ready", () => this.scriptTrigger());
  }

  /**
   * Checks an Message for a Command and executes it if one has been found.
   * @param {Message} message - The Discord Message that should be checked for a Command.
   */
  commandListener(message: Message) {
    let regexPrefix = this.prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let requestReg = new RegExp(`^${regexPrefix}(.*?)(\\s|$)`);

    let request = message.content.match(requestReg);
    if (!request) return false;
    let commandName = request[1].toLowerCase();

    let command: Command = this.commands.find(c => {
      let inAlias = c.alias.map(s => s.toLowerCase()).includes(commandName);
      let isName = c.name.toLowerCase() == commandName;
      return inAlias || isName;
    });
    if (command) {
      command.execute(this, message);
    }
  }

  /**
   * Adds a Command to the List of known Commands
   * @param {Command} command - The Command that should be added.
   */
  addCommand(command: Command) {
    console.log(`loaded ${command.name}`);
    this.commands.push(command);
  }

  /**
   * Adds a Script to the List of known Scripts. Triggers it if Discord Client already ready.
   * @param {Script} script - The Script that should be added.
   */
  addScript(script: Script) {
    this.scripts.push(script);
    if (this.readyTimestamp !== null) {
      script.trigger(this);
    }
  }

  /**
   * Triggers all scripts that hasn't been triggered yet
   */
  scriptTrigger() {
    let notTriggeredScripts = this.scripts.filter(s => s.triggered == false);
    for (let script of notTriggeredScripts) {
      script.trigger(this);
    }
  }

  /**
   * Loads all exported Commands inside of the given Path
   * (goes also through the subfolders)
   * @param target_path - The Path that should be crawled for exported Commands
   */
  loadCommands(target_path: string) {
    let exists = fs.existsSync(target_path);
    if (!exists) return false;

    let isDir = fs.statSync(target_path).isDirectory();
    if (isDir) {
      let allJS = fetchJS(target_path);
      for (let file of allJS) {
        let commands: Command | Command[] = require(file);
        if (!Array.isArray(commands)) {
          commands = [commands];
        }
        for (let command of commands) {
          if (command.type == "Command") {
            this.addCommand(command);
          }
        }
      }
    }
  }

  /**
   * Adds all exported Scripts inside of the given Path
   * @param target_path - The Path that should be crawled for exported Scripts
   */
  loadScripts(target_path: string) {
    let exists = fs.existsSync(target_path);
    if (!exists) return false;

    let isDir = fs.statSync(target_path).isDirectory();
    if (isDir) {
      let allJS = fetchJS(target_path);
      for (let file of allJS) {
        let scripts: Script | Script[] = require(file);
        if (!Array.isArray(scripts)) {
          scripts = [scripts];
        }
        for (let script of scripts) {
          if (script.type == "Script") {
            this.addScript(script);
          }
        }
      }
    }
  }

  /**
   * adds a .help command
   */
  enableHelp() {
    this.addCommand(require("./help"));
  }
}
