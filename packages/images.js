'use strict';
const googleImages = require('google-images');
const giphy = require('giphy-api')();
const request = require('request');

const config = require('../config');


module.exports = {
    name: 'Images',
    commands: [

        // Giphy
        {
            alias: ['gif', 'g', 'giphy'],
            params: 'tags',
            help: 'Get a random gif',
            action: (bot, msg, params) => {
                giphy.random({tag: params.join(' '), rating: 'r', fmt: 'json'}, (err, res) => {
                    if (err) msg.channel.sendMessage('Error connecting to giphy.');
                    else {
                        if (res.data && res.data.image_url) {
                            msg.channel.sendMessage(res.data.image_url);
                        } else {
                            msg.channel.sendMessage('Unable to find gif for: **' + params.join(' ') + '**.');
                        }
                    }
                });
            }
        },

        // Google Images
        {
            alias: ['gi', 'google', 'images'],
            params: 'tags',
            help: 'Search Google images',
            action: (bot, msg, params) => {
                const client = googleImages(config.googleCseId, config.googleApiKey);
                client.search(params.join(' ')).then(function(results){
                    let res = 'Failed to find results.';
                    if (results.length !== 0) {
                        res = '';
                        for (let i = 0; i < results.length && i < 3; i++) {
                            res += results[i].url + '\n';
                        }
                    }
                    msg.channel.sendMessage(res);
                });
            }
        },

        // Pugbomb
        {
            alias: ['pug', 'pugs', 'pugbomb'],
            help: ':)',
            action: (bot, msg, params) => {
                const options = {
                    url: 'https://pugme.herokuapp.com/bomb?count=5',
                    headers: {
                        Accept: 'application/json'
                    },
                    json: true,
                };
                request.get(options, (err, res, body) => {
                    if (err || !body.pugs || body.pugs.length < 1) msg.channel.sendMessage('Error getting pugs. :cry:');
                    else {
                        msg.channel.sendMessage(body.pugs.join('\n'));
                    }
                });
            }
        },


    ]
};
