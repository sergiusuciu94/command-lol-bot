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

app.get('/:command', function (req, res) {
  let command =  req.params.command.split(' ').filter(arg => arg ? true : false);
  console.log(command);
  res.send(JSON.stringify(ChatComands.do(command)));
})

app.listen(app.get('port'), function () {
  console.log("running: port");
})

var client = new Client({
  jid: envOptions.lolId,
  password: envOptions.lolPassword,
  host: envOptions.lolServer,
  port: envOptions.lolPort,
  reconnect: true,
  autostart: true,
  legacySSL: true
})

client.on('online', function () {
  console.log('Client is online')
  client.send('<presence/>')
})

client.on('offline', function () {
  console.log('Client is offline')
})

client.on('connect', function () {
  console.log('Client is connected')
})

client.on('reconnect', function () {
  console.log('Client reconnects …')
})

client.on('disconnect', function (e) {
  console.log('Client is disconnected', client.connection.reconnect, e)
})

client.on('error', function (e) {
  console.error(e)
  process.exit(1)
})

process.on('exit', function () {
  client.end()
})

client.on('stanza', function (stanza) {
  if (stanza.is('message') && stanza.attrs.type === 'chat') {
    var message = stanza.getChildText('body');
    console.log(stanza.getChildText('body'));
    if (message && message.length > 0) {
      var reply = new Client.Stanza('message', {
        to: stanza.attrs.from,
        from: stanza.attrs.to,
        type: 'chat'
      })
      reply.c('body').t(ChatComands.do(message.split(' ').filter(arg => arg ? true : false)));
      setTimeout(function () {
        client.send(reply)
      }, 1000)
    }
  }
})













