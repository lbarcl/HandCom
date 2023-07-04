import { LegacyCommandObject, fetchJS } from './utils';
import { Client, Interaction, Message, Routes } from 'discord.js';
import { ApplicationCommand } from './ApplicationCommand';
import { Command } from './command';
import { Event } from './event';
import * as path from 'path';
import * as fs from 'fs';

class CommandHandler {
	applicationCommand: Array<ApplicationCommand> = [];
	commands: Array<LegacyCommandObject> = [];
	client: Client;
	prefix: string;

	constructor(client: Client, options?: { prefix?: string, messageEvent?: string }) {
		this.client = client;
		this.prefix = options?.prefix || '!';
		this.client.on(options?.messageEvent || 'messageCreate', (message: Message) => this.legacyCommandListener(message));
		this.client.on("interactionCreate", (interaction) => this.applicationCommandListener(interaction));
	}

	private legacyCommandListener(message: Message) {
		if (message.content.startsWith(this.prefix)) {
			const [command, ...args] = message.content.slice(this.prefix.length).split(' ');

			this.commands.forEach((commandObject) => {
				if (commandObject.name === command || (commandObject.aliases && commandObject.aliases.includes(command))) {
					commandObject.function({ client: this.client, instance: this, message, args });
				}
			});
		}
	}

	private applicationCommandListener(interaction: Interaction) {
		if (interaction.isCommand()) {
			const commandName = interaction.commandName;
			const commandGuildId = interaction.commandGuildId;
			const isGlobal = commandGuildId == null;

			this.applicationCommand.forEach((commandObject) => {
				if ((isGlobal && commandObject.isGlobal) || (!isGlobal && commandObject.guildId === commandGuildId)) {
					if (commandObject.name === commandName) {
						commandObject.runFunction(interaction);
					}
				}
			});
		}
	}

	loadCommands(target_path: string) {
		if (!fs.existsSync(target_path)) return false;

		if (target_path.startsWith('./')) {
			target_path = path.join(process.cwd(), target_path.replace(/^\.\//, ''));
		}

		if (fs.statSync(target_path).isDirectory()) {
			const allJS = fetchJS(target_path);
			for (const file of allJS) {
				this.loadCommand(file);
			}
		}
	}

	loadCommand(commandPath: string) {
		const command = require(commandPath);
		if (command.default && Object.keys(command).length === 1) {
			this.addCommand(command.default);
		} else {
			this.addCommand(command);
		}
	}

	async addCommand(command: Command | Command[] | ApplicationCommand | ApplicationCommand[]) {
		if (Array.isArray(command)) {
			for (const cmd of command) {
				if (cmd instanceof ApplicationCommand) {
					//@ts-ignore
					const route = cmd.isGlobal ? Routes.applicationCommands(this.client.application?.id) : Routes.applicationGuildCommands(this.client.application?.id, cmd.guildId);
					await this.client.rest.post(route, { body: cmd.getCommandObject() });
					this.applicationCommand.push(cmd);
				} else {
					this.commands.push(cmd.getCommandObject());
				}
			}
		} else {
			if (command instanceof ApplicationCommand) {
				//@ts-ignore
				const route = command.isGlobal ? Routes.applicationCommands(this.client.application?.id) : Routes.applicationGuildCommands(this.client.application?.id, command.guildId);
				await this.client.rest.post(route, { body: command.getCommandObject() });
				this.applicationCommand.push(command);
			} else {
				this.commands.push(command.getCommandObject());
			}
		}
	}

	loadEvents(target_path: string) {
		if (!fs.existsSync(target_path)) return false;

		if (target_path.startsWith('./')) {
			target_path = path.join(process.cwd(), target_path.replace(/^\.\//, ''));
		}

		if (fs.statSync(target_path).isDirectory()) {
			const allJS = fetchJS(target_path);
			for (const file of allJS) {
				this.loadEvent(file);
			}
		}
	}

	loadEvent(eventPath: string) {
		const event = require(eventPath);
		if (event.default && Object.keys(event).length === 1) {
			this.addEvent(event.default);
		} else {
			this.addEvent(event);
		}
	}

	addEvent(event: Event | Event[]) {
		if (Array.isArray(event)) {
			for (const evt of event) {
				evt.run(this.client, this);
			}
		} else {
			event.run(this.client, this);
		}
	}
}

export { CommandHandler };
