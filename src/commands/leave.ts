import fs from 'fs';
import path from 'path';
import { Command } from '../types';
import connectionCache from '../helpers/connectionCache';

const leave: Command = {
  help: 'Leave a voice channel',
  action: async (msg, params) => {
    const { connection } = connectionCache[msg.guild.id] || {};
    delete connectionCache[msg.guild.id];

    if (connection) {
      const leaveSound = path.join(__dirname, '../../../leave.mp3');
      if (fs.existsSync(leaveSound)) {
        const dispatcher = connection.play(leaveSound);
        dispatcher.on('finish', () => {
          connection.disconnect();
        });
      } else {
        connection.disconnect();
      }
    }
  },
};

export default leave;
