import { Message, VoiceConnection, StreamDispatcher } from 'discord.js';

export interface Command {
  help: string;
  action: (msg: Message, params: string[]) => void;
}

export interface ConnectionCache {
  [serverId: string]: {
    connection: VoiceConnection;
    dispatcher?: StreamDispatcher;
  };
}
