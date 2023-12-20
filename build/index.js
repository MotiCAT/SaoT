"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twiClient = void 0;
const onPresenceUpdate_1 = require("./Events/onPresenceUpdate");
const onReady_1 = require("./Events/onReady");
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const twitter_api_v2_1 = require("twitter-api-v2");
(0, dotenv_1.config)();
if (!process.env.API_KEY || !process.env.API_SECRET || !process.env.ACCESS_TOKEN || !process.env.ACCESS_TOKEN_SECRET) {
    console.error('APIキーのいずれかが設定されていません。.envファイルを確認してください。');
    process.exit(1);
}
if (!process.env.USER_ID || !process.env.DISCORD_TOKEN) {
    console.error('DiscordのユーザーIDまたはボットのトークンが設定されていません。.envファイルを確認してください。');
    process.exit(1);
}
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildPresences]
});
exports.twiClient = new twitter_api_v2_1.TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET
});
client
    .on('ready', () => (0, onReady_1.onReady)(client))
    .on('presenceUpdate', async (oldPresence, newPresence) => (0, onPresenceUpdate_1.onPresenceUpdate)(oldPresence, newPresence))
    .login(process.env.DISCORD_TOKEN);
