'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Client = require('node-xmpp-client');
const RiotApi = require('riot-api');
const comandsApi = require('./lib/chat-comands.js');
const fs = require('fs');
const _commands = JSON.parse(fs.readFileSync('validCommands.json'))
const ChatComands = new comandsApi(_commands);



const envOptions = {
  lolId: process.env.LOL_ID + "@pvp.net/xiff",
  lolPassword: "AIR_" + process.env.LOL_PASSWORD,
  lolPort: process.env.LOL_PORT || 5223,
  lolServer: process.env.LOL_SERVER || "chat.eun1.lol.riotgames.com",
};

const app = express();

app.set('port', (process.env.PORT || 5000));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send(JSON.stringify(ChatComands.do('me','1234')));
})

app.listen(app.get('port'), function () {
  console.log("running: port");
})











