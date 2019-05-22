[![npm Downloads](https://img.shields.io/npm/dt/vnft-commandhandler.svg)]
(https://www.npmjs.com/package/vnft-commandhandler/)  (by old name vnft-commandhandler)  

[![npm Downloads](https://img.shields.io/npm/dt/vnftjs.svg)]
(https://www.npmjs.com/package/vnftjs/)  (vnftjs)  


# vnftjs
Discord CommandHandler for TypeScript or JavaScript

## Table of Contents

* [Classes](#class-commandhandler)
  * [CommandHandler](#class-commandhandler)
    - [prefix](#prefix)
    - [loadCommands(path)](#loadcommandspath)
    - [loadScripts(path)](#loadscriptspath)
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
The extended discord.js Client

##### `prefix`
The prefix for the Commands, `.` is default 

##### `loadCommands(path)`
loads all exported Command-Instances of the given Path

##### `loadScripts(path)`
loads all exported Script-Instances of the given Path and triggers them after the Client had a successful login


## Class: Command
##### `name`
The main trigger for the command (without prefix)

##### `funct`
filled with an function with the parameters `(bot: Client, message: Message, args: string)`

##### `addAlias(name)`
Alternative Names for the Command which should trigger the `Command.funct`

##### `addUserWhitelist(user)`
Limtes the Users that can use the command to those who are described in the whitelist

##### `addUserBlacklist(user)`
Without whitelist: everyone is allowed that isn't in described in the blacklist
With whitelist: only whitelisted are allowed that arent in a blacklist of the command

##### `addRoleWhitelist(role)`
Same as addUserWhitelist but with Roles

##### `addRoleBlacklist(role)`
Same as addUserBlacklist but with Roles

##### `enableHelp()`
adds the .help command

##### `description`
description of the command in the .help command

##### `usage`
usage-description of the command in the .help command

## Class: Script
##### `funct`
filled with an function with the parameters `(bot: Client)`

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
const { CommandHandler } = require("vnft-commandhandler");
const path = require("path");

const client = new CommandHandler();
client.prefix = "!";

client.loadCommands(path.join(__dirname, "commands"));

client.login("Discord Token");
```

##### commands/ping.js
```js
const { Command } = require("vnft-commandhandler");

const pingCommand = new Command();
pingCommand.name = "ping";
pingCommand.funct = (bot, message, args) => {
  message.reply("Pong!");
};

module.exports = pingCommand;
```

##### commands/neko.js
```js
const { Command } = require("vnft-commandhandler");
const axios = require("axios");

const neko = new Command();
neko.name = "neko";
neko.addAlias("cat");
neko.description = "Sends a picture of a cat"
neko.usage = ""
neko.funct = async (bot, message, args) => {
  var meow = await axios.get("http://aws.random.cat/meow");
  message.reply(meow.data.file);
};

module.exports = neko;
```

##### commands/activity.js
```js
const { Command } = require("vnft-commandhandler");

const activity = new Command();
activity.name = "setActivity";
activity.addAlias("activity");
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
import { CommandHandler } from "vnft-commandhandler";
import * as path from "path";

const client = new CommandHandler();
client.prefix = "!";

client.loadCommands(path.join(__dirname, "commands"));

client.login("Discord Token");
```

##### commands/ping.ts
```ts
import { Command } from "vnft-commandhandler";
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
import { Command } from "vnft-commandhandler";
import { Client, Message } from "discord.js";
import axios from "axios";

const neko = new Command();
neko.name = "neko";
neko.addAlias("cat");

// ↓ !help gives out the description "Sends a picture of a cat" and !neko without arguments as usage
neko.description = "Sends a picture of a cat"
neko.usage = ""

neko.funct = async (bot: Client, message: Message, args: string) => {
  let meow = await axios.get("http://aws.random.cat/meow");
  message.reply(meow.data.file);
};

module.exports = neko;
```

##### commands/setActivity.ts
```ts
import { Command } from "vnft-commandhandler";
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
