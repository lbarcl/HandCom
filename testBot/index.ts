// @ts-nocheck
const discord = require('discord.js');
const {Intents} = discord;
const client = new discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
import { CommandHandler, Event} from '../src/index';
import * as path from 'path';

client.on('ready', () => {
    console.log('Ready!');
    
    const commandHandler = new CommandHandler(client);
    commandHandler.loadCommands(path.join(__dirname, 'commands'));

    const event = new Event.Event((client, Instance) => { 
        client.on('messageCreate', (message) => { 
            console.log(message.author.username);
        });
    });
    commandHandler.addEvent(event);
});

client.login('YOUR TOKEN');
