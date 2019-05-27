![npm Downloads](https://img.shields.io/npm/dt/vnft-commandhandler.svg) (by old name [vnft-commandhandler](https://www.npmjs.com/package/vnft-commandhandler/))  
![npm Downloads](https://img.shields.io/npm/dt/vnftjs.svg) ([vnftjs](https://www.npmjs.com/package/vnftjs/))  


# vnftjs
Discord CommandHandler for TypeScript or JavaScript

## Table of Contents

* [Classes](#class-commandhandler)
  * [CommandHandler](#class-commandhandler)
    - [prefix](#prefix)
    - [loadCommands(path)](#loadcommandspath)
    - [loadScripts(path)](#loadscriptspath)
    - WIP [enableDebug()](#enabledebug)
  * [Command](#class-command)
    - [name](#name)
    - [funct](#funct)
    - [addAlias(name)](#addaliasname)
    - [addUserWhitelist(user)](#adduserwhitelistuser)
    - [addUserBlacklist(user)](#adduserblacklistuser)
    - [addRoleWhitelist(role)](#addrolewhitelistrole)
    - [addRoleBlacklist(role)](#addroleblacklistrole)
    - [enableHelp()](#enablehelp)
    - [description](#description)
    - [usage](#usage)
  * [Script](#class-script)
    - [funct](#funct-1)
    - [intervalTime](#intervaltime)
* [Examples](#examples)
    - [JavaScript](#javascipt)
    - [TypeScript](#typescript)

## Class: CommandHandler
the extended discord.js Client

##### `prefix`
the prefix for the commands, `.` is set by default.

##### `loadCommands(path)`
loads all exported command instances of the specified path.

##### `loadScripts(path)`
loads all exported script instances of the specified path and triggers them after the client has successfully logged in.

##### `enableDebug()`
reloads the source file of a command before execution. allows editing commands while the bot is running.


## Class: Command
##### `name`
the main trigger for the command (without prefix)

##### `funct`
the function that gets triggered with the call of the command.
parameters: `(client: Client, message: Message, args: string)`  
`Client: the discord client ( + the extended commandhandler )`
`Message: the message that triggered the command`
`args: the entire string after the commandname (e.g. .help ping → args:"ping")`

##### `addAlias(name)`
alternative names for the command, which should also trigger it.

##### `addUserWhitelist(user)`
limtes the use of the command to those who are described in the whitelist
as long as they arent in the blacklist

##### `addUserBlacklist(user)`
disallowes the use of the command to those who are described in the blacklist
even if they are in a whitelist

##### `addRoleWhitelist(role)`
restricts the use of the command to those described in the whitelist.
as long as they are not blacklisted.

##### `addRoleBlacklist(role)`
prohibits the use of the command by those described in the blacklist.
even if they are on a whitelist.

##### `enableHelp()`
adds the .help command

##### `description`
description of the command in `.help <command>`

##### `usage`
usage-description of the parameters in `.help <command>`

## Class: Script
##### `funct`
the function that gets executed after the client has successfully logged in.
parameters: `(bot: Client)`
`Client: the discord client ( + the extended commandhandler )`

##### `intervalTime`
time in ms in which it should be repeated  
(negative numbers are disabling the repeat, -1 is the default value)


## Examples

### **JavaScipt**
#### Structure for this example
```
.
├── main.js
├── commands/
│   ├── ping.js
│   ├── neko.js
│   └── setActivity.js
└── scripts/
    ├── tbd
    └── tbd
``` 
#### Code
##### main.js
```js
const { CommandHandler } = require("vnftjs");
const path = require("path");

const client = new CommandHandler();
client.prefix = "!";

client.loadCommands(path.join(__dirname, "commands"));

client.login("Discord Token");
```

##### commands/ping.js
```js
const { Command } = require("vnftjs");

const pingCommand = new Command();
pingCommand.name = "ping";

pingCommand.funct = (bot, message, args) => {
  message.reply("Pong!");
};

module.exports = pingCommand;
```

##### commands/neko.js
```js
const { Command } = require("vnftjs");
const axios = require("axios");

const neko = new Command();
neko.name = "neko";
neko.addAlias("cat");

// ↓ !help gives out the description "Sends a picture of a cat" and !neko without arguments as usage
neko.description = "Sends a picture of a cat";
neko.usage = "";

neko.funct = async (bot, message, args) => {
  var meow = await axios.get("http://aws.random.cat/meow");
  message.reply(meow.data.file);
};

module.exports = neko;
```

##### commands/activity.js
```js
const { Command } = require("vnftjs");

const activity = new Command();
activity.name = "setActivity";
activity.addAlias("activity");

// ↓ only the user with the id "397063436049186818" can now execute this command
activity.addUserWhitelist(u => u.id == "397063436049186818");

activity.funct = async (bot, message, args) => {
  await bot.user.setActivity(args);
  message.reply(`Status Updated`);
};

module.exports = activity;
```

### **TypeScript**
#### Structure for this example:
``` 
src/
├── main.ts
├── commands/
│   ├── ping.ts
│   ├── neko.ts
│   └── setActivity.ts
└── scripts/
    ├── tbd
    └── tbd
``` 
#### Code

##### main.ts
```ts
import { CommandHandler } from "vnftjs";
import * as path from "path";

const client = new CommandHandler();
client.prefix = "!";

client.loadCommands(path.join(__dirname, "commands"));

client.login("Discord Token");
```

##### commands/ping.ts
```ts
import { Command } from "vnftjs";
import { Client, Message } from "discord.js";

const ping = new Command();
ping.name = "ping";

ping.funct = (bot: Client, message: Message, args: string) => {
  message.reply("Pong");
};

module.exports = ping;
```

##### commands/neko.ts
```ts
import { Command } from "vnftjs";
import { Client, Message } from "discord.js";
import axios from "axios";

const neko = new Command();
neko.name = "neko";
neko.addAlias("cat");

// ↓ !help gives out the description "Sends a picture of a cat" and !neko without arguments as usage
neko.description = "Sends a picture of a cat";
neko.usage = "";

neko.funct = async (bot: Client, message: Message, args: string) => {
  let meow = await axios.get("http://aws.random.cat/meow");
  message.reply(meow.data.file);
};

module.exports = neko;
```

##### commands/setActivity.ts
```ts
import { Command } from "vnftjs";
import { Client, Message } from "discord.js";

const activity = new Command();
activity.name = "setActivity";
activity.addAlias("activity");

// ↓ only the user with the id "397063436049186818" can now execute this command
activity.addUserWhitelist(u => u.id == "397063436049186818");

activity.funct = async (bot: Client, message: Message, args: string) => {
  await bot.user.setActivity(args);
  message.reply(`Activity Updated!`);
};

module.exports = activity;
```
