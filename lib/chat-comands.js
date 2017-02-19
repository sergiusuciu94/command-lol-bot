
const fs = require('fs');
const _commands = JSON.parse(fs.readFileSync('validCommands.json'))

function ChatCommands(commands) {
}

ChatCommands.prototype = {
  do: function () {
    var args = arguments[0];
    console.log(args);
    let preCheck = this._check(args);
    if (!preCheck.ok) {
      return this._showError(preCheck);
    } else {

    };
  },

  _check: function (args) {
    let commandStack = [];
    let lastArgument = false;
    let found = false;
    let _commands = JSON.parse(fs.readFileSync('validCommands.json'))
    let remaining = [];
    let lastIterated = _commands;
    for (let i = 0, len = args.length; i < len; i++) {
      lastArgument = args[i];
      if (lastIterated[args[i]]) {
        commandStack.push(args[i]);
        lastIterated = lastIterated[args[i]];
        if (lastIterated && i === len - 1 && lastIterated._params === 0) {
          console.log('valid last command')
          found = true;
        }
      } else {
        if (!i) {
          console.log('invalid first command')
          found = false;
          break;
        }
        if ((lastIterated._params) && (lastIterated._params + i === len)) {
          console.log('found with params')
          found = true;
          remaining = args.slice(i);
          break;
        } else {
          console.log('invalid param')
          found = false;
          remaining = args.slice(i);
          break
        }
      }
    }
    return {
      ok: found,
      args: remaining,
      stack: commandStack,
      command: lastIterated,
      lastArg: lastArgument
    }
  },

  _showError: function (preCheck) {
    if (preCheck.stack.length === 0) {
      return "Invalid command '" + preCheck.lastArg + "'. \nUse 'help' for a valid command list";
    } else if (preCheck.command._func && preCheck.args.length !== preCheck.command._params) {
      return "Command '" + preCheck.stack.join(' ') + "' expected " + preCheck.command._params + " param(s) and got " + preCheck.args.length;
    } else {
      if (preCheck.args.length === 0) {
        return "Subcommand required for '" + preCheck.lastArg + "' use 'help " + preCheck.stack.join(' ') + "'";
      } else {
        return "Unknown subcommand '" + preCheck.lastArg + "' use 'help " + preCheck.stack.join(' ') + "'";
      }
    }
  },

  _buildCommand: function (args) {

  },
  _me: function (id) {

  }
}

module.exports = ChatCommands;