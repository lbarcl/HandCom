import { Client } from 'discord.js';
import { CommandHandler } from './commander';
declare type EventFunction = (client: Client, Instance: CommandHandler) => void;
declare class Event {
    EventFunc: EventFunction;
    EventRegister: EventFunction | undefined;
    constructor(EventFunc: EventFunction);
    run(client: Client, Instance: CommandHandler): void;
}
export { Event, EventFunction };
//# sourceMappingURL=event.d.ts.map