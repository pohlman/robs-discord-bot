'use strict';
const fs = require('fs');
const youtubedl = require('youtube-dl');
const spawnSync = require('child_process').spawnSync;

let voiceConnection = false;
let encoder = null;


const play = (msg, params) => {
  try {
    youtubedl.getInfo(params[0], ['--format=bestaudio/best'], (err, info) => {
      if (!err && info) {
        let t = params[0].match(/\?.*t=(\d+)/);
        if (t && t.length > 1) t = +t[1];
        if (isNaN(t)) t = undefined;
        encoder = voiceConnection.createExternalEncoder({
          type: 'ffmpeg',
          source: info.url,
          inputArgs: ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '2'],
          outputArgs: buildOutputArgs(msg, 44100, params[1], params[2], t),
          debug: true
        });
        encoder.play();
      }
    });
  } catch (e) {
    msg.reply('Failed to Play: ' + e.toString());
  }
};


function buildOutputArgs(msg, path, rate, tempo, seek) {
  const outputArgs = [];
  let filter = '';
  
  if (rate) {
    let num = +rate;
    if (isNaN(num)) msg.reply('Rate is not a number');
    else {
      let probe = path;
      if (typeof path !== 'number') {
        probe = spawnSync('avprobe', [path]).stderr.toString();
        if (typeof probe === 'string') {
          probe = probe.match(/(\d+) Hz/);
          if (probe && probe.length > 1) {
            probe = +probe[1];
          }
        } else {
          probe = null;
        }
      }
      if (probe) {
        filter += 'asetrate=' + (probe * num);
      }
    }
  }
  if (tempo) {
    let num = +tempo;
    if (isNaN(num) || num < 0.5 || num > 2.0) msg.reply('Tempo needs to be between 0.5 and 2.0');
    else {
      if (filter) {
        filter += ', ';
      }
      filter += 'atempo=' + num;
    }
  }
  if (filter) {
    outputArgs.push('-filter_complex');
    outputArgs.push(filter);
  }
  if (seek) {
    outputArgs.push('-ss');
    outputArgs.push(seek);
  }
  return outputArgs;
}



module.exports = {
  name: 'Voice',
  commands: [
    
    // Join
    {
      alias: ['join', 'vjoin'],
      help: 'Join your voice channel',
      action: (bot, msg, params) => {
        const authorChannel = msg.author.getVoiceChannel(msg.guild);
        if (!authorChannel) {
          msg.reply('You\'re not in a voice channel.');
        } else {
          authorChannel.join().then((info) => {
            voiceConnection = info.voiceConnection;
            
            if (params.length) {
              play(msg, params);
            } else {
              encoder = voiceConnection.createExternalEncoder({
                type: 'ffmpeg',
                source: 'join.mp3',
              });
              encoder.play();
            }
            
          }).catch((err) => {msg.reply(err);});
        }
      }
    },
    
    // leave
    {
      alias: ['leave', 'vleave'],
      help: 'Leave the voice channel',
      action: (bot, msg, params) => {
        bot.Dispatcher.removeAllListeners('VOICE_CHANNEL_JOIN');
        if (voiceConnection) {
          encoder = voiceConnection.createExternalEncoder({
            type: 'ffmpeg',
            source: 'leave.mp3',
          });
          if (encoder) encoder.play();
          setTimeout(() => {
            voiceConnection.disconnect();
            voiceConnection = false;
          }, 2500);
        }
      }
    },
    
    // Play Sound
    {
      alias: ['play', 'vplay', 'p'],
      params: 'url, rate (ratio, optional), tempo (0.5-2.0, optional)',
      help: 'Play a YouTube url or a url that contains an audio file.',
      action: (bot, msg, params) => {
        if (!voiceConnection) msg.reply('I\'m not in a voice channel, use !join first.');
        else if (params.length) {
          play(msg, params);
        }
        else msg.reply('Pass a URL to play.');
      }
    },
    
    
    // Play Awol
    {
      alias: ['pawol'],
      params: 'url, rate, tempo',
      help: 'RUN',
      action: (bot, msg, params) => {
        if (params.length < 1) {
          msg.reply('Please pass a filename');
        } else if (!voiceConnection) {
          msg.reply('I\'m not in a voice channel, use !join first.');
        } else {
          
          youtubedl.getInfo(params[0], ['--format=bestaudio/best'], (err, info) => {
            if (!err && info) {
              let t = params[0].match(/\?.*t=(\d+)/);
              if (t && t.length > 1) t = +t[1];
              if (isNaN(t)) t = undefined;
              
              encoder = voiceConnection.createExternalEncoder({
                type: 'ffmpeg',
                source: 'sfx/awol_beginning.mp3',
                outputArgs: buildOutputArgs(msg, 'sfx/awol_beginning.mp3', params[1], params[2]),
              });
              if (encoder) encoder.play();
              
              setTimeout(() => {
                encoder = voiceConnection.createExternalEncoder({
                  type: 'ffmpeg',
                  source: info.url,
                  outputArgs: buildOutputArgs(msg, 44100, params[1], params[2], t),
                  debug: true
                });
                encoder.play();
                setTimeout(() => {
                  encoder = voiceConnection.createExternalEncoder({
                    type: 'ffmpeg',
                    source: 'sfx/awol_end.mp3',
                    outputArgs: buildOutputArgs(msg, 'sfx/awol_end.mp3', params[1], params[2]),
                  });
                  if (encoder) encoder.play();
                }, 1000);
              }, 4600);
            }
          });
        }
      }
    },
    
    // Stop
    {
      alias: ['stop', 's', 'vstop'],
      help: 'Stop playing',
      action: (bot, msg, params) => {
        if (encoder) {
          encoder.stop();
          encoder = false;
        }
      }
    },
    
    
    // SFX
    {
      alias: ['sfx', 'file', 'audio'],
      params: 'filename',
      help: 'Try to play a file with the supplied filename',
      action: (bot, msg, params) => {
        if (params.length < 1) {
          msg.reply('Please pass a filename');
        } else if (!voiceConnection) {
          msg.reply('I\'m not in a voice channel, use !join first.');
        } else {
          encoder = voiceConnection.createExternalEncoder({
            type: 'ffmpeg',
            source: 'sfx/' + params[0] + '.mp3',
            outputArgs: buildOutputArgs(msg, 'sfx/' + params[0] + '.mp3', params[1], params[2]),
          });
          if (encoder) encoder.play();
        }
      }
    },
    
    // SFX list
    {
      alias: ['sfxlist', 'audiolist'],
      help: 'List files in sfx directory',
      action: (bot, msg, params) => {
        let res = 'Sfx options: ';
        const files = fs.readdirSync('sfx/');
        for (let i = 0; i < files.length; i++) {
          files[i] = files[i].substring(0, files[i].length - 4);
        }
        res += files.join(', ');
        msg.reply(res);
      }
    },
    
    // SFX Awol
    {
      alias: ['sfxawol'],
      params: 'filename',
      help: 'RUN',
      action: (bot, msg, params) => {
        if (params.length < 1) {
          msg.reply('Please pass a filename');
        } else if (!voiceConnection) {
          msg.reply('I\'m not in a voice channel, use !join first.');
        } else {
          
          encoder = voiceConnection.createExternalEncoder({
            type: 'ffmpeg',
            source: 'sfx/awol_beginning.mp3',
            outputArgs: buildOutputArgs(msg, 'sfx/awol_beginning.mp3', params[1], params[2]),
          });
          if (encoder) encoder.play();
          setTimeout(() => {
            encoder = voiceConnection.createExternalEncoder({
              type: 'ffmpeg',
              source: 'sfx/' + params[0] + '.mp3',
              outputArgs: buildOutputArgs(msg, 'sfx/' + params[0] + '.mp3', params[1], params[2]),
            });
            if (encoder) encoder.play();
            setTimeout(() => {
              encoder = voiceConnection.createExternalEncoder({
                type: 'ffmpeg',
                source: 'sfx/awol_end.mp3',
                outputArgs: buildOutputArgs(msg, 'sfx/awol_end.mp3', params[1], params[2]),
              });
              if (encoder) encoder.play();
            }, 1000);
          }, 4600);
        }
      }
    },
    
  ]
};


