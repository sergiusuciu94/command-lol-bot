
const fs = require('fs');
const _commands = JSON.parse(fs.readFileSync('validCommands.json'))

function ChatCommands(commands) {
}

ChatCommands.prototype = {
  do: function () {
    var args = Array.prototype.slice.call(arguments);
    let preCheck = this._check(args);
    return preCheck;
  },
  _check: function(args) {
    
    let found = false;
    let _commands = JSON.parse(fs.readFileSync('validCommands.json'))
    let remaining = [];
    let lastIterated = _commands;
    console.log(lastIterated);
    for(let i = 0, len = args.length; i < len; i++) {
      if(lastIterated[args[i]]) {
        lastIterated = lastIterated[args[i]];
        if(lastIterated && i === len - 1) {
          found = true;
        }
      } else {
        console.log('got here ;)')
        if (!i) {
          found = false;
          break;
        }
        if((lastIterated._params) && (lastIterated._params + 1 + i === len)) {
          found = true;
          remaining = args.slice(i);
          break;
        }
      }
    }
    return {
      ok : found,
      args : remaining,
      command : lastIterated
    }
  },
  _buildCommand: function(args) {
    
  },
  _me: function(id) {

  }
}

module.exports = ChatCommands;