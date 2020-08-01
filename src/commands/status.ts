import { Command } from '../types';

const status: Command = {
  help: 'Change the bot status, provide no parameters to reset',
  action: (msg, params) => {
    const statusText = params.length ? params.join(' ') : '';
    msg.client.user.setActivity(statusText);
  },
};

export default status;
