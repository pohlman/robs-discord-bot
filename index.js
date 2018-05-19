'use strict';
const Discordie = require("discordie");
const Events = Discordie.Events;

const config = require('./config');


// Initialize Packages
const pkgs = [];
for (let i = 0; i < config.packages.length; i++) {
    pkgs.push(require('./packages/' + config.packages[i]));
}

function help(bot, msg, params) {
  let help = "\nAvailable Commands:";
  pkgs.forEach(pkg => {
      help += '\n\n***' + pkg.name.toUpperCase() + '***';
      pkg.commands.forEach(command => {
          help += '\n**'
          let aliases = command.alias instanceof Array ? command.alias : [command.alias];
          help += aliases.map(a => '!' + a).join(', ');
          help += '**';
          if (command.params) help += '\tParams: *' + command.params + '*';
          if (command.help) help += '\t' + command.help;          
      });
  });
  msg.reply(help);
}

function commands(bot, msg, command, params) {
    if (command === 'help') {
        help(bot, msg, params);
        return;
    }
    let cmd;
    for (let i = 0; i < pkgs.length; i++) {
        for (let j = 0; j < pkgs[i].commands.length; j++) {
            cmd = pkgs[i].commands[j];
            if (cmd.alias.indexOf(command) !== -1) {
                console.log(`command\t${command}\tparams\t${params}`);
                cmd.action(bot, msg, params);
                return;
            }
        }
    }
    msg.reply("Unknown command: **" + command + "**");
};




// Discordie Init
const client = new Discordie({autoReconnect: true});

client.connect({token: config.token});

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  if(e && e.message && e.message.content && e.message.content[0] === "!") {
    // !command argument argument argument ...
    const params = e.message.content.split(" ");
    const command = params.shift().substr(1).toLowerCase();
    commands(client, e.message, command, params);
  }
});


// Don't break on connection reset
process.on('uncaughtException', function(err) {
  if (err.code !== 'ECONNRESET') {
    throw err;
  } else {
    console.error(err);
  }
});
