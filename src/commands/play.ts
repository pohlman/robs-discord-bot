import { Command } from '../types';
import connectionCache from '../helpers/connectionCache';
import ytdl from 'ytdl-core-discord';

const play: Command = {
  help: 'Play audio from a passed url',
  action: async (msg, params) => {
    const { connection } = connectionCache[msg.guild.id] || {};
    if (!connection) {
      return msg.reply('Use %join first!');
    }

    const url = params[0];
    if (!url) {
      return msg.reply('Please provide a url');
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return msg.reply('sorry, only YouTube links are accepted!');
    }

    const stream = await getYoutubeStream(url);
    connectionCache[msg.guild.id].dispatcher = connection.play(stream, { type: 'opus' });
  },
};

const getYoutubeStream = async (url: string) => {
  const t = url.match(/\?.*t=(\d+)/);
  let seek = NaN;
  if (t && t.length > 1) {
    seek = parseInt(t[1]);
  }

  return await ytdl(url, {
    highWaterMark: 24,
    begin: isNaN(seek) ? undefined : `${seek}s`,
  });
};

export default play;
