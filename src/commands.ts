import { Commands } from './types';
import status from './commands/status';
import roll from './commands/roll';
import flip from './commands/flip';
import pugs from './commands/pugs';
import giphy from './commands/giphy';
import join from './commands/audio/join';
import leave from './commands/audio/leave';
import play from './commands/audio/play';
import stop from './commands/audio/stop';

const commands: Commands = {
  status,
  roll,
  flip,
  pugs,
  giphy,
  join,
  leave,
  play,
  stop,
};

export default commands;
