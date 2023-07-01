import { ApplicationCommandObject, ApplicationCommandOptionObject, ApplicationCommandOptionChoiceObject, ApplicationCommandFunction, COMMAND_OPTION_TYPES } from "./utils";
import { Interaction } from "discord.js";

const REGEX = new RegExp("^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u");
const MAX_DESCRIPTION_LENGTH = 100;
const MAX_OPTION_NAME_LENGTH = 100;
const MAX_OPTION_VALUE_LENGTH = 100;
const MAX_NAME_LENGTH = 32;

class ApplicationCommand {
	readonly name: string;
	readonly guildId?: string;
	readonly isGlobal: boolean = true;

	private type: number;
	private description: string = "No command description";
	private descriptionLocalizations?: Record<string, string>;
	private nameLocalizations?: Record<string, string>;
	private defaultMemberPermissions?: string;
	private dmPermission: boolean = false;
	private defaultPermission: boolean = false;
	private nsfw: boolean = false;
	private requiredOptions: ApplicationCommandOption[] = [];
	private options: ApplicationCommandOption[] = [];
	private applicationCommandFunction?: ApplicationCommandFunction;

	constructor(name: string, type: number = 1, guildId?: string) {
		if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
			throw new Error(
				`name must be at least 1 character and not more than ${MAX_NAME_LENGTH} characters`
			);
		}

		if (type === 1 && REGEX.test(name)) {
			throw new Error(
				"Command name is not a valid command name. You can learn about naming rules at 'https://discord.com/developers/docs/interactions/application-commands'"
			);
		}

		this.name = name;
		this.type = type;

		if (guildId) {
			this.isGlobal = false;
			this.guildId = guildId;
		}
	}

	runFunction(interaction: Interaction) {
		if (!this.applicationCommandFunction) {
			throw new Error("Application command function is not defined");
		}

		this.applicationCommandFunction(interaction);
	}

	setFunction(applicationCommandFunction: ApplicationCommandFunction) {
		this.applicationCommandFunction = applicationCommandFunction;
	}

	setDescription(description: string) {
		if (this.type !== 1) {
			throw new Error("Description can be set only in CHAT_INPUT type");
		}

		if (description.length === 0 || description.length > MAX_DESCRIPTION_LENGTH) {
			throw new Error(
				`Description must be at least 1 character and not more than ${MAX_DESCRIPTION_LENGTH} characters`
			);
		}

		this.description = description;
	}

	addLocalDescription(local: string, description: string) {
		if (this.type !== 1) {
			throw new Error("Local description can be set only in CHAT_INPUT type");
		}

		if (description.length === 0 || description.length > MAX_DESCRIPTION_LENGTH) {
			throw new Error(
				`Description must be at least 1 character and not more than ${MAX_DESCRIPTION_LENGTH} characters`
			);
		}

		this.descriptionLocalizations = this.descriptionLocalizations || {};
		this.descriptionLocalizations[local] = description;
	}

	addLocalName(local: string, name: string) {
		if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
			throw new Error(
				`name must be at least 1 character and not more than ${MAX_NAME_LENGTH} characters`
			);
		}

		this.nameLocalizations = this.nameLocalizations || {};
		this.nameLocalizations[local] = name;
	}

	setDefaultMemberPermissions(permissions: string) {
		this.defaultMemberPermissions = permissions;
	}

	setAvailableAsDirectMessage() {
		if (!this.isGlobal) {
			throw new Error("DM permission can be set only in global commands");
		}

		this.dmPermission = true;
	}

	setAvailableAsDefault() {
		console.warn(
			"setDefaultPermission is deprecated, please use setDefaultMemberPermissions instead"
		);

		this.defaultPermission = true;
	}

	setAsNSFW() {
		this.nsfw = true;
	}

	addOption(option: ApplicationCommandOption) {
		if (option.required) {
			this.requiredOptions.push(option);
		} else {
			this.options.push(option);
		}
	}

	getCommandObject(): ApplicationCommandObject {
		const commandObject: ApplicationCommandObject = {
			name: this.name,
			type: this.type,
			dm_permission: this.dmPermission,
			default_permission: this.defaultPermission,
			nsfw: this.nsfw,
		};

		if (this.type === 1) {
			commandObject.description = this.description;
		}

		if (this.nameLocalizations) {
			commandObject.name_localizations = this.nameLocalizations;
		}

		if (this.descriptionLocalizations) {
			commandObject.description_localizations = this.descriptionLocalizations;
		}

		if (this.defaultMemberPermissions) {
			commandObject.default_member_permissions = this.defaultMemberPermissions;
		}

		if (this.requiredOptions.length > 0 || this.options.length > 0) {
			commandObject.options = [
				...this.requiredOptions.map((option) => option.getOptionsObject()),
				...this.options.map((option) => option.getOptionsObject()),
			];
		}

		return commandObject;
	}
}

class ApplicationCommandOption {
    name: string;
    type: number;
    required: boolean = false;

    private description: string = "No command options description";
    private descriptionLocalizations: {} | undefined;
    private nameLocalizations: {} | undefined;

    private choices: Array<ApplicationCommandOptionChoice> = [];
    private channelTypes: Array<number> = [];

    private minValue: number | undefined;
    private maxValue: number | undefined;

    private minLength: number | undefined;
    private maxLength: number | undefined;

    private autocomplete: boolean = false;

    constructor(name: string, type: number) {
        if (!REGEX.test(name)) {
            throw new Error("Command option name is not a valid option name. You can learn about naming rules at 'https://discord.com/developers/docs/interactions/application-commands'");
        }

        this.name = name;
        this.type = type;
    }

    setDescription(description: string) {
        if (this.type != 1) {
            throw new Error("Description can be set only in CHAT_INPUT type");
        }

        if (description.length > MAX_DESCRIPTION_LENGTH || description.length == 0) {
            throw new Error(`Description must be at least 1 character and not more than ${MAX_DESCRIPTION_LENGTH} characters`);
        }

        this.description = description;
    }

    addLocalDescription(local: string, description: string) {
        if (this.type != 1) {
            throw new Error("Local description can be set only in CHAT_INPUT type");
        }

        if (description.length > MAX_DESCRIPTION_LENGTH || description.length == 0) {
            throw new Error(`Description must be at least 1 character and not more than ${MAX_DESCRIPTION_LENGTH} characters`);
        }

        if (this.descriptionLocalizations == undefined) {
            this.descriptionLocalizations = {};
        }

        const jsonToUpdate = JSON.parse(JSON.stringify(this.descriptionLocalizations));
        jsonToUpdate[local] = description;
        this.descriptionLocalizations = jsonToUpdate;
    }

    addLocalName(local: string, name: string) {
        if (name.length > MAX_NAME_LENGTH || name.length == 0) {
            throw new Error(`name must be at least 1 character and not more than ${MAX_NAME_LENGTH} characters`);
        }

        if (this.nameLocalizations == undefined) {
            this.nameLocalizations = {};
        }

        const jsonToUpdate = JSON.parse(JSON.stringify(this.nameLocalizations));
        jsonToUpdate[local] = name;
        this.nameLocalizations = jsonToUpdate;
    }

    setAsRequired() {
        this.required = true;
    }

    setChoices(choices: Array<ApplicationCommandOptionChoice>) {
        if (choices.length > 25) {
            throw new Error("Choices can't be longer than 25");
        }

        this.choices = choices;
    }

    addChoice(choice: ApplicationCommandOptionChoice) {
        if (this.choices.length == 25) {
            throw new Error("Choices can't be longer than 25");
        }

        this.choices.push(choice);
    }

    setChannelTypes(channels: Array<number>) {
        if (this.type != COMMAND_OPTION_TYPES.CHANNEL) {
            throw new Error("To be able to set a channel type, option type must be channel");
        }

        this.channelTypes = channels;
    }

    addChannelType(channel: number) {
        if (this.type != COMMAND_OPTION_TYPES.CHANNEL) {
            throw new Error("To be able to set a channel type, option type must be channel");
        }

        this.channelTypes.push(channel);
    }

    setMinValue(minValue: number) {
        if (this.type != COMMAND_OPTION_TYPES.INTEGER && this.type != COMMAND_OPTION_TYPES.NUMBER) {
            throw new Error("To be able to set a min value, option type must be Integer or number");
        }

        this.minValue = minValue;
    }

    setMaxValue(maxValue: number) {
        if (this.type != COMMAND_OPTION_TYPES.INTEGER && this.type != COMMAND_OPTION_TYPES.NUMBER) {
            throw new Error("To be able to set a max value, option type must be integer or number");
        }

        this.maxValue = maxValue;
    }

    setMinlength(minLength: number) {
        if (this.type != COMMAND_OPTION_TYPES.STRING) {
            throw new Error("To be able to set a min length, option type must be string");
        }

        if (minLength < 0 || minLength > 6000) {
            throw new Error("Length must be less than 6000 and greater than 0");
        }

        this.minLength = minLength;
    }

    setMaxlength(maxLength: number) {
        if (this.type != COMMAND_OPTION_TYPES.STRING) {
            throw new Error("To be able to set a min length, option type must be string");
        }

        if (maxLength < 0 || maxLength > 6000) {
            throw new Error("Length must be less than 6000 and greater than 0");
        }

        this.maxLength = maxLength;
    }

    setAutocompleteAvaliable() {
        if (this.type != COMMAND_OPTION_TYPES.INTEGER && this.type != COMMAND_OPTION_TYPES.NUMBER && this.type != COMMAND_OPTION_TYPES.STRING) {
            throw new Error("To be able to set autocomplete, option type must be string, integer, or number");
        }

        this.autocomplete = true;
    }

    getOptionsObject(): ApplicationCommandOptionObject {
        const optionsObject: ApplicationCommandOptionObject = {
            type: this.type,
            name: this.name,
            description: this.description,
            required: this.required,
            autocomplete: this.autocomplete
        };

        if (this.nameLocalizations) {
            optionsObject.name_localizations = this.nameLocalizations;
        }

        if (this.descriptionLocalizations) {
            optionsObject.description_localizations = this.descriptionLocalizations;
        }

        if (this.choices.length > 0) {
            optionsObject.choices = [];
            for (let i = 0; i < this.choices.length; i++) {
                optionsObject.choices.push(this.choices[i].getChoiceObject());
            }
        }

        if (this.channelTypes.length > 0) {
            optionsObject.channel_type = this.channelTypes;
        }

        if (this.minValue) {
            optionsObject.min_value = this.minValue;
        }

        if (this.maxValue) {
            optionsObject.max_value = this.maxValue;
        }

        if (this.minLength) {
            optionsObject.min_length = this.minLength;
        }

        if (this.maxLength) {
            optionsObject.max_length = this.maxLength;
        }

        return optionsObject;
    }
}

class ApplicationCommandOptionChoice {
	name: string;
	value: string | number;
	private nameLocalizations: {} | undefined;

	constructor(name: string, value: string | number) {
		if (name.length > MAX_OPTION_NAME_LENGTH || name.length == 0) {
			throw new Error(`Option name must be at least 1 and be at maximum of ${MAX_OPTION_NAME_LENGTH} characters`);
		}

		if (typeof value === "string") {
			if (value.length > MAX_OPTION_VALUE_LENGTH || value.length == 0) {
				throw new Error(`Option value must be at least 1 and be at maximum of ${MAX_OPTION_VALUE_LENGTH} characters`);
			}
		}

		this.name = name;
		this.value = value;
	}

	addLocalName(local: string, name: string) {
		if (name.length > MAX_OPTION_NAME_LENGTH || name.length == 0) {
			throw new Error(`Option name must be at least 1 character and not more than ${MAX_NAME_LENGTH} characters`);
		}

		if (this.nameLocalizations == undefined) {
			this.nameLocalizations = {};
		}

		const jsonToUpdate = JSON.parse(JSON.stringify(this.nameLocalizations));
		jsonToUpdate[local] = name;
		this.nameLocalizations = jsonToUpdate;
	}

	getChoiceObject(): ApplicationCommandOptionChoiceObject {
		const choiceObject: ApplicationCommandOptionChoiceObject = {
			name: this.name,
			value: this.value
		};

		if (this.nameLocalizations != undefined) {
			choiceObject['name_localizations'] = this.nameLocalizations;
		}

		return choiceObject;
	}
}

export {
    ApplicationCommand,
    ApplicationCommandOption,
    ApplicationCommandOptionChoice
}