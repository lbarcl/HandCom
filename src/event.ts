import { CommandHandler } from './commander';
import { EventFunction } from './utils';
import { Client } from 'discord.js';

class Event {
    EventRegister: EventFunction | undefined;

    constructor(public EventFunc: EventFunction) {
        this.EventRegister = EventFunc;
    }

    run(client: Client, Instance: CommandHandler) {
        if (!this.EventRegister) {
            throw new Error('No function set for this event');
        } 

        this.EventRegister(client, Instance);
    }
}

export { Event };