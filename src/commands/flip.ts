import { Command } from '../types';

const flip: Command = {
  help: 'Flip a coin',
  action: (msg, params) => {
    const dict = {
      true: 'Heads',
      false: 'Tails',
    };
    const choice = params[0] === 'heads';
    const res = Math.random() >= 0.5;
    const victoryStr = res === choice ? 'Congrats! :+1:' : 'Sorry for your loss. :ghost:';
    msg.reply(`**${dict[res + '']}** was flipped. You guessed **${dict[choice + '']}**. ${victoryStr}`);
  },
};

export default flip;
