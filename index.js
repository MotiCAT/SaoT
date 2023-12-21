const { TwitterApi } = require('twitter-api-v2');
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({
	intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildPresences]
});
const twiClient = new TwitterApi({
	appKey: process.env.API_KEY,
	appSecret: process.env.API_SECRET,
	accessToken: process.env.ACCESS_TOKEN,
	accessSecret: process.env.ACCESS_TOKEN_SECRET
});
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');

if (!process.env.API_KEY || !process.env.API_SECRET || !process.env.ACCESS_TOKEN || !process.env.ACCESS_TOKEN_SECRET) {
	console.error('APIキーのいずれかが設定されていません。.envファイルを確認してください。');
	process.exit(1);
}

if (!process.env.USER_ID || !process.env.DISCORD_TOKEN) {
	console.error('DiscordのユーザーIDまたはボットのトークンが設定されていません。.envファイルを確認してください。');
	process.exit(1);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});
client.on('presenceUpdate', async (oldPresence, newPresence) => {
	if (newPresence.userId !== process.env.USER_ID) return;
	const spotifyActivity = newPresence.activities.find((activity) => activity.name === 'Spotify');
	if (!spotifyActivity) return;

	const oldActivity = oldPresence.activities.find((activity) => activity.name === 'Spotify');
	const { details: oldSongName, state: oldArtistName } = oldActivity || { details: '', state: '' };

	const { details: songName, state: artistName } = spotifyActivity;
	if (oldSongName === songName && oldArtistName === artistName) return;
	const imageUrl = spotifyActivity.assets.largeImageURL();
	try {
		const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
		const resizedBuffer = await sharp(response.data).resize(500, 500).toBuffer();
		fs.writeFile('image.jpg', resizedBuffer, (err) => {
			if (err) throw err;
		});
	} catch (err) {
		console.error(err);
		return;
	}

	try {
		const media_Id = await twiClient.v1.uploadMedia('./image.jpg');
		await twiClient.v2.tweet(`Now playing on Spotify: ${songName} by ${artistName}`, {
			media: { media_ids: [media_Id] }
		});
	} catch (err) {
		console.error(err);
	}
});

client.login(process.env.DISCORD_TOKEN);
