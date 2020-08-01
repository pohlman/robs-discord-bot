import { Command } from '../types';
import * as commands from '.';

const help: Command = {
  help: 'This command',
  action: (msg, params) => {
    const helpMsg = Object.keys(commands).map((cmd) => `**%${cmd}**: ${commands[cmd].help}`);
    msg.reply('\n' + helpMsg.join('\n'));
  },
};

export default help;
