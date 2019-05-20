import { Client, Message, User, Role } from "discord.js";

export type CommandFunction = (bot: Client, message: Message, args: string) => any;

export interface permissionlist {
  users: userFindFunction[];
  roles: roleFindFunction[];
}

type userFindFunction = (User: User) => boolean;
type roleFindFunction = (Role: Role) => boolean;

export class Command {
  _name: string;
  alias: string[];
  _funct: CommandFunction;
  type: string;
  description: string;
  usage: string;

  whitelist: permissionlist;
  blacklist: permissionlist;

  constructor() {
    this.alias = [];
    this.type = "Command";
    this.description = "*(no description)*";
    this.usage = "*(no description)*";

    this.whitelist = {
      users: [],
      roles: []
    };
    this.blacklist = {
      users: [],
      roles: []
    };
  }

  set name(name: string) {
    this._name = name;
  }
  get name(): string {
    return this._name;
  }

  addAlias(name: string) {
    this.alias.push(name);
  }

  set funct(funct: CommandFunction) {
    this._funct = funct;
  }
  get funct(): CommandFunction {
    return this._funct;
  }

  isPermitted(author: User, roles?: Role[]): boolean {
    if (roles) {
      let hasWhitelist = this.whitelist.users.length > 0 || this.whitelist.roles.length > 0;
      let hasBlacklist = this.blacklist.users.length > 0 || this.blacklist.roles.length > 0;

      if (hasWhitelist == true && hasBlacklist == false) {
        return this.whitelist.users.some(w => w(author)) || this.whitelist.roles.some(w => roles.some(r => w(r)));
      }
      if (hasWhitelist == false && hasBlacklist == true) {
        return !(this.blacklist.users.some(w => w(author)) || this.blacklist.roles.some(w => roles.some(r => w(r))));
      }
      if (hasWhitelist == true && hasBlacklist == true) {
        return (
          (this.whitelist.users.some(w => w(author)) || this.whitelist.roles.some(w => roles.some(r => w(r)))) &&
          !(this.blacklist.users.some(w => w(author)) || this.blacklist.roles.some(w => roles.some(r => w(r))))
        );
      }
      if (hasWhitelist == false && hasBlacklist == false) {
        return true;
      }
    }

    if (!roles) {
      let hasWhitelist = this.whitelist.users.length > 0;
      let hasBlacklist = this.blacklist.users.length > 0;

      if (hasWhitelist == true && hasBlacklist == false) {
        return this.whitelist.users.some(w => w(author));
      }
      if (hasWhitelist == false && hasBlacklist == true) {
        return !this.blacklist.users.some(w => w(author));
      }
      if (hasWhitelist == true && hasBlacklist == true) {
        return this.whitelist.users.some(w => w(author)) && !this.blacklist.users.some(w => w(author));
      }
      if (hasWhitelist == false && hasBlacklist == false) {
        return true;
      }
    }

    return false;
  }

  execute(bot: Client, message: Message) {
    if (this.funct) {
      let permitted: boolean = false;
      if (message.channel.type == "dm") {
        permitted = this.isPermitted(message.author);
      } else if (message.channel.type == "text") {
        permitted = this.isPermitted(message.member.user, message.member.roles.array());
      }
      if (permitted) {
        console.log(`Executing: `, this);
        let params = message.content.match(/.*?\s(.*$)/);
        let args: string = params ? params[1] : "";
        this.funct(bot, message, args);
      } else {
        console.log(`${message.author.username} is not permitted to use command ${this.name}`);
      }
    } else {
      console.log(`Can't Execute ${this.name}, because it hasn't funct set.`);
    }
  }

  addUserWhitelist(userFind: userFindFunction) {
    this.whitelist.users.push(userFind);
  }
  addUserBlacklist(userFind: userFindFunction) {
    this.blacklist.users.push(userFind);
  }
  addRoleWhitelist(roleFind: roleFindFunction) {
    this.whitelist.roles.push(roleFind);
  }
  addRoleBlacklist(roleFind: roleFindFunction) {
    this.blacklist.roles.push(roleFind);
  }
}
