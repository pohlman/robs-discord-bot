import { Command } from '../types';

const roll: Command = {
  help: 'Roll dice',
  action: (msg, params) => {
    const sides = parseInt(params[0]) || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    msg.reply(`you rolled: **${result}** out of ${sides}.`);
  },
};

export default roll;
