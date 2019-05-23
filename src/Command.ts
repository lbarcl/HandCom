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

  /**
   * checks if a author is permitted to use the command
   * @param author the user that wants to execute the command
   * @param roles roles of the user that wants to execute the command
   * @returns {boolean} if the user is permitted to use the command
   */
  isPermitted(author: User, roles?: Role[]): boolean {
    if (roles) {
      let hasWhitelist = this.whitelist.users.length > 0 || this.whitelist.roles.length > 0;
      let hasBlacklist = this.blacklist.users.length > 0 || this.blacklist.roles.length > 0;

      if (hasWhitelist && !hasBlacklist) {
        return this.whitelist.users.some(w => w(author)) || this.whitelist.roles.some(w => roles.some(r => w(r)));
      }
      if (!hasWhitelist && hasBlacklist) {
        return !(this.blacklist.users.some(w => w(author)) || this.blacklist.roles.some(w => roles.some(r => w(r))));
      }
      if (hasWhitelist && !hasBlacklist) {
        return (
          (this.whitelist.users.some(w => w(author)) || this.whitelist.roles.some(w => roles.some(r => w(r)))) &&
          !(this.blacklist.users.some(w => w(author)) || this.blacklist.roles.some(w => roles.some(r => w(r))))
        );
      }
      if (!hasWhitelist && !hasBlacklist) {
        return true;
      }
    }

    if (!roles) {
      let hasWhitelist = this.whitelist.users.length > 0;
      let hasBlacklist = this.blacklist.users.length > 0;

      if (hasWhitelist && !hasBlacklist) {
        return this.whitelist.users.some(w => w(author));
      }
      if (!hasWhitelist && hasBlacklist) {
        return !this.blacklist.users.some(w => w(author));
      }
      if (hasWhitelist && hasBlacklist) {
        return this.whitelist.users.some(w => w(author)) && !this.blacklist.users.some(w => w(author));
      }
      if (!hasWhitelist && !hasBlacklist) {
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

  addUserWhitelist(user: userFindFunction | User) {
    if(user instanceof User){
      user = u => u.id == user.id
    }
    this.whitelist.users.push(user);
  }
  addUserBlacklist(user: userFindFunction | User) {
    if(user instanceof User){
      user = u => u.id == user.id
    }
    this.blacklist.users.push(user);
  }
  addRoleWhitelist(role: roleFindFunction | Role) {
    if(role instanceof Role){
      role = r => r.id == role.id
    }
    this.whitelist.roles.push(role);
  }
  addRoleBlacklist(role: roleFindFunction | Role) {
    if(role instanceof Role){
      role = r => r.id == role.id
    }
    this.blacklist.roles.push(role);
  }
}
