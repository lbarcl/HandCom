import { LegacyCommandFunction, LegacyCommandOptions, LegacyCommandObject } from './utils';


export class Command {
    private name: string;
    private description: string;
    private usage: string;
    private aliases: string[];
    private legacyCommandFunction: LegacyCommandFunction | undefined;

    constructor(name: string, options?: LegacyCommandOptions) {
        this.name = name;
        this.description = options?.description ||'No description for this command';
        this.usage = options?.usage || 'No usage for this command';
        this.aliases = options?.aliases || [];
    }

    setFunction(legacyCommandFunction: LegacyCommandFunction) {
        this.legacyCommandFunction = legacyCommandFunction;
    }

    addDescription(description: string) {
        this.description = description;
    }
    
    addUsage(usage: string) {
        this.usage = usage;
    }
    
    addAlias(alias: string | string[]) {
        if (alias instanceof Array) { this.aliases.push(...alias); }
        else { this.aliases.push(alias); }
    }

    getCommandObject(): LegacyCommandObject {
        if (!this.legacyCommandFunction) {
            throw new Error('No function set for this command');
        }

        const commandObject = {
            name: this.name,
            usage: this.usage,
            aliases: this.aliases,
            description: this.description,
            function: this.legacyCommandFunction
        }

        return commandObject;
    }
}