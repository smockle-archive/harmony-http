#!/usr/bin/env node
require("dotenv-safe").config();

const { HarmonyHub } = require("harmonyhub-api");
const hub = new HarmonyHub(process.env.IP_ADDRESS, process.env.REMOTE_ID);

const Command = new Map([
  ["VolumeUp", { command: "VolumeUp", times: 3 }],
  ["VolumeDown", { command: "VolumeDown", times: 3 }],
  ["Mute", { command: "Mute" }]
]);
const sendCommand = key => {
  return hub.connect().then(() => {
    let { command, times = 1 } = Command.get(key);
    do {
      hub.sendCommand(command, process.env.DEVICE_ID);
      times--;
    } while (times > 0);
    setTimeout(() => hub.disconnect(), 300);
  });
};

const express = require("express");
const app = express();

for (const [command, _] of Command) {
  app.get(`/${command.toLowerCase()}`, (_, res) => {
    sendCommand(command)
      .then(() => res.json({ message: "Success", code: 200 }))
      .catch(() => res.json({ message: error, code: 500 }));
  });
}
const port = process.env.PORT;
app.listen(port, () => console.log(`Harmony-HTTP listening on port ${port}`));
