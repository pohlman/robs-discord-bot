import fetch from 'node-fetch';
import { Command } from '../types';

const pugs: Command = {
  help: 'Pug bomb',
  action: async (msg, params) => {
    try {
      const response = await fetch('https://pugme.herokuapp.com/bomb?count=3');
      const json = await response.json();
      msg.channel.send(json.pugs.join('\n'));
    } catch (e) {
      msg.reply('failed to get pugs, try again later');
    }
  },
};

export default pugs;
