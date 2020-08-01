import { Command } from '../../types';
import connectionCache from '../../helpers/connectionCache';
import ytdl from 'ytdl-core-discord';

const play: Command = {
  help: 'Play audio from a passed url',
  action: async (msg, params) => {
    const { connection } = connectionCache[msg.guild.id] || {};
    if (!connection) {
      msg.reply('Use %join first!');
      return;
    }

    if (!params[0]) {
      msg.reply('Please provide a url');
      return;
    }

    const t = params[0].match(/\?.*t=(\d+)/);
    let seek = NaN;
    if (t && t.length > 1) {
      seek = parseInt(t[1]);
    }

    const stream = await ytdl(params[0], {
      highWaterMark: 24,
      begin: isNaN(seek) ? undefined : `${seek}s`,
    });

    connectionCache[msg.guild.id].dispatcher = connection.play(stream, {
      type: 'opus',
      highWaterMark: 24,
    });
  },
};

export default play;
