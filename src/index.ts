import { onPresenceUpdate } from './Events/onPresenceUpdate';
import { onReady } from './Events/onReady';
import { Client, GatewayIntentBits, Presence } from 'discord.js';
import { config } from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';

config();

if (!process.env.API_KEY || !process.env.API_SECRET || !process.env.ACCESS_TOKEN || !process.env.ACCESS_TOKEN_SECRET) {
	console.error('APIキーのいずれかが設定されていません。.envファイルを確認してください。');
	process.exit(1);
}

if (!process.env.USER_ID || !process.env.DISCORD_TOKEN) {
	console.error('DiscordのユーザーIDまたはボットのトークンが設定されていません。.envファイルを確認してください。');
	process.exit(1);
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences]
});

export const twiClient = new TwitterApi({
	appKey: process.env.API_KEY,
	appSecret: process.env.API_SECRET,
	accessToken: process.env.ACCESS_TOKEN,
	accessSecret: process.env.ACCESS_TOKEN_SECRET
});

client
	.on('ready', () => onReady(client))
	.on('presenceUpdate', async (oldPresence: Presence | null, newPresence: Presence) =>
		onPresenceUpdate(oldPresence, newPresence)
	)
	.login(process.env.DISCORD_TOKEN);
