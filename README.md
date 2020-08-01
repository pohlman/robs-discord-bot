# Rob's Discord Bot

This is my Discord bot based on [Discord.js].
It was built for personal use in my Discord server, and comes with no guarantees, however you are free to use, abuse, copy, and reference the code at will.

### Setup

1. Clone the repo to your server
2. Create a new application here: https://discord.com/developers/applications/
3. Create a `.env` file to store the token from your new Discord application

   ```bash
   $ echo DISCORD_TOKEN=token > .env
   ```

4. Starting the server

   ```bash
   $ npm install

   # run once
   $ npm start

   # or run as a service
   $ npm i -g forever
   $ npm run start:service
   ```

5. Add the bot to your server by replacing the `client_id` with the one from your new Discord application and visiting this URL: https://discord.com/oauth2/authorize?client_id=123&scope=bot

### License

MIT License

Copyright (c) 2020 Rob Pohlman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[discord.js]: https://github.com/discordjs/discord.js
