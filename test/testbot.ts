import * as assert from "assert";
import { CommandHandler } from "../src";
import * as path from "path";

describe("setup", async () => {
  const client = new CommandHandler();

  before(async () => {
    client.prefix = "!";
    client.enableDebug();
    client.enableHelp();
    client.helpColor = "RED";

    client.loadCommands(path.join(__dirname, "commands"));
    client.loadScripts(path.join(__dirname, "scripts"));

    await client.login(process.env.test_token);
  });

  it("login success", done => {
    assert.notEqual(client, "undefined");
    done();
  });

  it("help command is in", done => {
    assert.equal(client.commands.some(c => c.name == "help"), true);
    done();
  });

  it("ping command is in", done => {
    assert.equal(client.commands.some(c => c.name == "ping"), true);
    done();
  });

  after(() => {
    client.full_destroy();
  });
});
