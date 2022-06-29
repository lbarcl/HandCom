import { Client, Message } from 'discord.js';
import { Command } from './command';
import { Event } from './event';
declare class CommandHandler {
    commands: Command[];
    client: Client;
    prefix: string;
    constructor(client: Client, options?: {
        prefix?: string;
        messageEvent?: string;
    });
    commandListener(message: Message): void;
    loadCommands(target_path: string): false | undefined;
    loadCommand(commandPath: string): void;
    addCommand(command: Command | Command[]): void;
    loadEvents(target_path: string): false | undefined;
    loadEvent(eventPath: string): void;
    addEvent(event: Event | Event[]): void;
}
export { CommandHandler };
//# sourceMappingURL=commander.d.ts.map