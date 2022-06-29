import { Client, Message } from 'discord.js';
import { Command } from './command';
import { Event } from './event';
import { fetchJS } from './utils';
import * as fs from 'fs';
import * as path from 'path';

class CommandHandler {
    commands: Command[] = [];
    client: Client;
    prefix: string;

    constructor(client: Client, options?: { prefix?: string, messageEvent?: string }) {
        this.client = client;
        this.prefix = options?.prefix || '!';
        this.client.on(options?.messageEvent || 'messageCreate', (message) => this.commandListener(message));
    }

    commandListener(message: Message) {
        if (message.content.slice(0, this.prefix.length) == this.prefix) {
            let command = message.content.split(' ')[0].slice(this.prefix.length);
            let args = message.content.split(' ').slice(1);
            console.log(command, args);
            this.commands.forEach(cmd => {
                if (cmd.name === command || cmd.Aliases?.includes(command)) {
                    cmd.run(this.client, this, message, args);
                }
            });
        }
    }

    /**
    * Loads all exported Commands inside of the given Path
    * (goes also through the subfolders)
    * @param target_path - The Path that should be crawled for exported Commands
    * @example
    * const path = require("path");
    * client.loadCommands(path.join(__dirname,"commands"));
    */
    loadCommands(target_path: string) {
        let exists = fs.existsSync(target_path);
        if (!exists) return false;

        if (target_path.match(/^\.\//)) {
            target_path = path.join(process.cwd(), target_path.replace(/^\.\//, ""));
        }

        let isDir = fs.statSync(target_path).isDirectory();
        if (isDir) {
            let allJS = fetchJS(target_path);
            for (let file of allJS) {
                let commands: Command | Command[] = require(file);
                this.addCommand(commands);
            }
        }
    }

    loadCommand(commandPath: string) {
        let command: Command | Command[] = require(commandPath);
        this.addCommand(command);
    }

    addCommand(command: Command | Command[]) { 
        if (command instanceof Array) {
            this.commands.push(...command);
            command.forEach(cmd => { 
                console.log(`Command ${cmd.name} loaded`);
            })
        }
        else {
            console.log(command);
            this.commands.push(command);
            console.log(`Command ${command.name} loaded`);
        }
    }

        /**
    * Loads all exported Events inside of the given Path
    * (goes also through the subfolders)
    * @param target_path - The Path that should be crawled for exported Commands
    * @example
    * const path = require("path");
    * client.loadCommands(path.join(__dirname,"commands"));
    */
    loadEvents(target_path: string) {
        let exists = fs.existsSync(target_path);
        if (!exists) return false;

        if (target_path.match(/^\.\//)) {
            target_path = path.join(process.cwd(), target_path.replace(/^\.\//, ""));
        }

        let isDir = fs.statSync(target_path).isDirectory();
        if (isDir) {
            let allJS = fetchJS(target_path);
            for (let file of allJS) {
                let events: Event | Event[] = require(file);
                this.addEvent(events);
            }
        }
    }
    
    loadEvent(eventPath: string) {
        let command: Command | Command[] = require(eventPath);
        this.addCommand(command);
    }

    addEvent(event: Event | Event[]) { 
        if (event instanceof Array) {
            event.forEach(event => {
                event.run(this.client, this);
            })
        }
        else {
            event.run(this.client, this);
        }
    }
}

export { CommandHandler };