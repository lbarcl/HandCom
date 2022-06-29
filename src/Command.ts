import { Client, Message } from 'discord.js';
import { CommandHandler } from './commander';

interface CommandFunctionOptions {
    message: Message;
    args: string[];
    client: Client;
    instance: CommandHandler;
}
type CommandFunction = (options: CommandFunctionOptions) => void;

interface CommandOptions {
    description?: string;
    usage?: string;
    aliases?: string[];
}

class Command {
    name: string;
    private description: string;
    private usage: string;
    private aliases: string[];
    private func: CommandFunction | undefined;
    constructor(name: string, options?: CommandOptions) {
        this.name = name;
        this.description = options?.description ||'No description for this command';
        this.usage = options?.usage || 'No usage for this command';
        this.aliases = options?.aliases || [];
        
        this.func = undefined;
    }

    addAlias(alias: string | string[]) {
        if (alias instanceof Array) { this.aliases.push(...alias); }
        else { this.aliases.push(alias); }
    }

    run(client: Client, Instance: CommandHandler, message: Message, args: string[]) {
        if (this.func) {
            this.func({
                message,
                args,
                client,
                instance: Instance
            });
        } else {
            throw new Error('No function set for this command');
        }
    }

    set Func(func: CommandFunction) {
        this.func = func;
    }

    get Usage() {
        return this.usage;
    }

    set Usage(usage: string) {
        this.usage = usage;
    }

    get Description() {
        return this.description;
    }

    set Description(description: string) {
        this.description = description;
    }

    get Aliases() {
        return this.aliases;
    }
}

export { Command, CommandOptions, CommandFunction, CommandFunctionOptions };