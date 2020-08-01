import Giphy from 'giphy-api';
import { Command } from '../types';

const giphyClient = Giphy();

const giphy: Command = {
  help: 'Search giphy',
  action: async (msg, params) => {
    const search = params.join(' ');
    giphyClient.random({ tag: search, rating: 'r', fmt: 'json' }, (err, res) => {
      if (err) {
        msg.channel.send('Failed to reach giphy');
        return;
      }
      if (res.data && res.data.image_url) {
        msg.channel.send(res.data.image_url);
      } else {
        msg.channel.send(`Unable to find any cool gifs for: **${params.join(' ')}**.`);
      }
    });
  },
};

export default giphy;
