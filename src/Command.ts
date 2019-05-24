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

  /**
   * Adds a user to the whitelist of the command.
   * Once an entry is added to the whitelist, only those in the whitelist are allowed to use the command.
   * If a user on the whitelist is blacklisted in any way, that user cannot use the command.
   * @param {userFindFunction} user Function with user as parameter, those that make this function return true are on the whitelist.
   * @param {User} user The user to be added.
   * @example
   * command.addUserWhitelist(u => u.id == "397063436049186818");
   * @example
   * // not recommendable, but better understandable
   * const jeff = client.users.find(u => u.id == "397063436049186818");
   * command.addUserWhitelist(jeff);
   */
  addUserWhitelist(user: userFindFunction | User) {
    if(user instanceof User){
      let targetId:string = user.id
      user = u => u.id == targetId
    }
    this.whitelist.users.push(user);
  }

  /**
   * Adds a user to the blacklist of the command.
   * Any user on the blacklist is not allowed to use the command, even if they are whitelisted in any way.
   * @param {userFindFunction} user Function with user as parameter, those that make this function return true are on the blacklist.
   * @param {User} user The user to add.
   * @example
   * command.addUserBlacklist(u => u.id == "397063436049186818");
   * @example
   * // not recommendable, but better understandable
   * const jeff = client.users.find(u => u.id == "397063436049186818");
   * command.addUserBlacklist(jeff);
   */
  addUserBlacklist(user: userFindFunction | User) {
    if(user instanceof User){
      let targetId:string = user.id
      user = u => u.id == targetId
    }
    this.blacklist.users.push(user);
  }
  
  /**
   * Adds a role to the whitelist of the command.
   * Once an entry is added to the whitelist, only those in the whitelist are allowed to use the command.
   * If a user on the whitelist is blacklisted in any way, that user cannot use the command.
   * @param {roleFindFunction} role Function with role as parameter, those with a role that make this function return true are on the whitelist.
   * @param {Role} role The role that is to be added.
   * @example
   * command.addRoleWhitelist(r => r.id == "397063436049186818");
   */
  addRoleWhitelist(role: roleFindFunction | Role) {
    if(role instanceof Role){
      let targetId:string = role.id
      role = r => r.id == targetId
    }
    this.whitelist.roles.push(role);
  }
  
  /**
   * Adds a role to the blacklist of the command.
   * Any user with a blacklisted role is not allowed to use the command, even if they are whitelisted in any way.
   * @param {roleFindFunction} role Function with role as parameter, those with role that make this function return true are on the blacklist.
   * @param {Role} role The role that is to be added.
   * @example
   * command.addRoleBlacklist(r => r.id == "397063436049186818");
   */
  addRoleBlacklist(role: roleFindFunction | Role) {
    if(role instanceof Role){
      let targetId:string = role.id
      role = r => r.id == targetId
    }
    this.blacklist.roles.push(role);
  }
}
