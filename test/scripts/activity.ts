import { Script } from "../../src";

const game = new Script();
game.intervalTime = 5000;

game.funct = async client => {
  let activities = [
    `Hello!`,
    `I am a Test-Script`,
    `My name is ${client.user.username}`,
    `The next activity is "Hello!"`
  ];

  activities.push(activities[0]);
  let game = client.user.presence.game;
  let newIndex = !game ? 0 : activities.indexOf(game.name) + 1;
  client.user.setActivity(activities[newIndex]);
};

module.exports = game;
