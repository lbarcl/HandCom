import { Client } from "discord.js";

export type ScriptFunction = (bot: Client) => any;

export class Script {
  funct: ScriptFunction;
  intervalTime: number;
  interval: NodeJS.Timeout;
  type: String;
  triggered: boolean;

  constructor() {
    this.intervalTime = -1;
    this.type = "Script";
    this.triggered = false;
  }

  /**
   * executes the function its holding, repeats in a interval if intervalTime is given 
   * @param {Client} bot the bot that should be passed the function as a parameter
   */
  trigger(bot: Client) {
    if (this.triggered == false && this.funct) {
      this.funct(bot);
      if (this.intervalTime >= 0) {
        this.interval = setInterval(this.funct, this.intervalTime, bot);
      }
      this.triggered = true;
    }
  }
}
