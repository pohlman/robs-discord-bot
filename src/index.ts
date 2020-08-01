import dotenv from 'dotenv';
import Discord from 'discord.js';
import * as commands from './commands';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('Please provide your discord token as an environment variable named `DISCORD_TOKEN`');
}

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (msg.content.startsWith('%') && msg.content.length > 1) {
    const params = msg.content.trim().split(' ');
    const commandName = params.shift().substr(1).toLowerCase();

    if (commandName in commands) {
      const command = commands[commandName];
      command.action(msg, params);
    } else {
      msg.reply(`sorry, I don't know the command %${commandName}`);
    }
  }
});

client.login(token);

process.on('unhandledRejection', (error) => console.error('Uncaught Promise Rejection', error));
