import { Client } from 'discord.js';
import { CommandHandler } from './commander';

type EventFunction = (client: Client, Instance: CommandHandler) => void;

class Event {
    EventRegister: EventFunction | undefined;

    constructor(public EventFunc: EventFunction) {
        this.EventRegister = EventFunc;
    }

    run(client: Client, Instance: CommandHandler) {
        if (this.EventRegister) {
            this.EventRegister(client, Instance);
        } else {
            throw new Error('No function set for this event');
        }
    }
}

export { Event, EventFunction };