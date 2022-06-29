import { Client, Message } from 'discord.js';
import { CommandHandler } from './commander';
interface CommandFunctionOptions {
    message: Message;
    args: string[];
    client: Client;
    instance: CommandHandler;
}
declare type CommandFunction = (options: CommandFunctionOptions) => void;
interface CommandOptions {
    description?: string;
    usage?: string;
    aliases?: string[];
}
declare class Command {
    name: string;
    private description;
    private usage;
    private aliases;
    private func;
    constructor(name: string, options?: CommandOptions);
    addAlias(alias: string | string[]): void;
    run(client: Client, Instance: CommandHandler, message: Message, args: string[]): void;
    set Func(func: CommandFunction);
    get Usage(): string;
    set Usage(usage: string);
    get Description(): string;
    set Description(description: string);
    get Aliases(): string[];
}
export { Command, CommandOptions, CommandFunction, CommandFunctionOptions };
//# sourceMappingURL=command.d.ts.map