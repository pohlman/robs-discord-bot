import { Command } from '../types';
import connectionCache from '../helpers/connectionCache';

const stop: Command = {
  help: 'Stop playing audio',
  action: async (msg, params) => {
    const { connection, dispatcher } = connectionCache[msg.guild.id] || {};
    if (!connection || !dispatcher) {
      return;
    }

    dispatcher.end();
    connectionCache[msg.guild.id].dispatcher = undefined;
  },
};

export default stop;
