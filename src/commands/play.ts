import { Command } from '../types';
import connectionCache from '../helpers/connectionCache';
import youtubedl from 'youtube-dl';

const play: Command = {
  help: 'Play audio from a passed url',
  action: async (msg, params) => {
    const { connection } = connectionCache[msg.guild.id] || {};
    if (!connection) {
      return msg.reply('Use !join first!');
    }

    const url = params[0];
    if (!url) {
      return msg.reply('Please provide a url');
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return msg.reply('sorry, only YouTube links are accepted!');
    }

    const stream = await getYoutubeStream(url);
    connectionCache[msg.guild.id].dispatcher = connection.play(stream, { highWaterMark: 50, volume: false });
  },
};

const getYoutubeStream = async (url: string): Promise<string> => {
  const t = url.match(/\?.*t=(\d+)/);
  let seek = NaN;
  if (t && t.length > 1) {
    seek = parseInt(t[1]);
  }

  return new Promise((resolve, reject) => {
    youtubedl.getInfo(url, ['--format=bestaudio/best'], (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info?.url || '');
      }
    });
  });
};

export default play;
