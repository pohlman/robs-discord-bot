import fs from 'fs';
import path from 'path';
import { Command } from '../types';
import connectionCache from '../helpers/connectionCache';

const join: Command = {
  help: 'Join a voice channel',
  action: async (msg, params) => {
    const authorChannel = msg.member.voice.channel;
    if (!authorChannel) {
      msg.reply('Join a voice channel first!');
      return;
    }
    const connection = await authorChannel.join();

    const joinSound = path.join(__dirname, '../../../join.mp3');
    let dispatcher;
    if (fs.existsSync(joinSound)) {
      dispatcher = connection.play(joinSound);
    }
    connectionCache[msg.guild.id] = {
      connection,
      dispatcher,
    };
  },
};

export default join;
