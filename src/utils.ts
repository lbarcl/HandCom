import { CommandHandler } from './commander';
import { Client, Interaction, Message } from 'discord.js';

import * as path from "path";
import * as fs from "fs";


/**
 * fetches all .js files in a folder and its subfolders
 * @param {string} folder - Path to the folder
 */
 export function fetchJS(folder: string): string[] {
    let folderContent = fs.readdirSync(folder);
    let files:any[] = [];
  
    for (let entry of folderContent) {
      let entrypath = path.join(folder, entry);
  
      let isDir = fs.statSync(entrypath).isDirectory();
      let isFile = fs.statSync(entrypath).isFile();
      let ext = path.extname(entrypath);
  
      if (isDir) {
        files = files.concat(fetchJS(entrypath));
      }
      if (isFile && ext == ".js") {
        files.push(entrypath);
      }
    }
  
    return files;
}
  
export const COMMAND_TYPES = {
  "CHAT_INPUT": 1,
  "USER": 2,
  "MESSAGE": 3
}

export const COMMAND_OPTION_TYPES = {
  "SUB_COMMAND": 1,
  "SUB_COMMAND_GROUP": 2,
  "STRING": 3,
  "INTEGER": 4,
  "BOOLEAN": 5,
  "USER": 6,
  "CHANNEL": 7,
  "ROLE": 8,
  "MENTIONABLE": 9,
  "NUMBER": 10,
  "ATTACHMENT": 11
}

export const LANGUAGES = {
  "INDONESIAN": "id",
  "DANISH": "da",
  "GERMAN": "de",
  "ENGLISH_UK": "en-GB",
  "ENGLISH_US": "en-US",
  "SPANISH": "es-ES",
  "FRENCH": "fr",
  "CROATIAN": "hr",
  "ITALIAN": "it",
  "LITHUANIAN": "lt",
  "HUNGARIAN": "hu",
  "DUTCH": "nl",
  "NORWEGIAN": "no",
  "POLISH": "pl",
  "PORTEGUESE_BREZILIAN": "pt-BR",
  "ROMANIAN": "ro",
  "FINNISH": "fi",
  "SWEDISH": "sv-SE",
  "VIETNAMESE": "vi",
  "TURKISH": "tr",
  "CZECH": "cs",
  "GREEK": "el",
  "BULGARIAN": "bg",
  "RUSSIAN": "ru",
  "UKRAINIAN": "uk",
  "HINDI": "hi",
  "THAI": "th",
  "CHINESE_CHINA": "zh-CN",
  "JAPANESE": "ja",
  "CHINESE_TAIWAN": "zh-TW",
  "KOREAN": "ko"
}

export const CHANNEL_TYPES = {
  "GUILD": {
    "TEXT": 0,
    "VOICE": 2,
    "CATEGORY": 4,
    "ANNOUNCEMENT": 5,
    "STAGE": {
      "VOICE": 13
    },
    "DIRECTORY": 14,
    "FORUM": 15
  },
  "DM": {
    "default": 1,
    "GROUP": 3
  },
  "THREAD": {
    "ANNOUNCEMENT": 10,
    "PUBLIC": 11,
    "PRIVATE": 12
  }
}

export type ApplicationCommandFunction = (interaction: Interaction) => void;

export interface ApplicationCommandObject {
  name: string;
  type: number;
  description?: string;
  description_localizations?: {};
  name_localizations?: {};
  options?: Array<ApplicationCommandOptionObject>;
  default_member_permissions?: string;
  dm_permission?: boolean;
  default_permission?: boolean;
  nsfw?: boolean;
}

export interface ApplicationCommandOptionObject {
  type: number;
  name: string;
  name_localizations?: {};
  description: string;
  description_localizations?: {};
  required?: boolean;
  choices?: Array<ApplicationCommandOptionChoiceObject>;
  options?: Array<ApplicationCommandOptionObject>;
  channel_type?: Array<number>;
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  autocomplete?: boolean;
}

export interface ApplicationCommandOptionChoiceObject {
  name: string;
  name_localizations?: {};
  value: string | number;
}

export type LegacyCommandFunction = (options: LegacyCommandFunctionOptions) => void;

export interface LegacyCommandFunctionOptions {
  message: Message;
  args: string[];
  client: Client;
  instance: CommandHandler;
}

export interface LegacyCommandOptions {
  description?: string;
  usage?: string;
  aliases?: string[];
}

export interface LegacyCommandObject {
  name: string;
  usage: string;
  aliases: string[];
  description: string;
  function: LegacyCommandFunction
}

export type EventFunction = (client: Client, Instance: CommandHandler) => void;