import { twiClient } from '../index';
import axios from 'axios';
import { Presence } from 'discord.js';
import { writeFile, unlink } from 'fs';
import sharp from 'sharp';

export async function onPresenceUpdate(oldPresence: Presence | null, newPresence: Presence) {
	if (newPresence.userId !== process.env.USER_ID) return;
	const spotifyActivity = newPresence.activities.find((activity) => activity.name === 'Spotify');
	if (!spotifyActivity) return;

	const oldActivity = oldPresence?.activities.find((activity) => activity.name === 'Spotify');
	const { details: oldSongName, state: oldArtistName } = oldActivity || { details: '', state: '' };

	const { details: songName, state: artistName } = spotifyActivity;
	if (oldSongName === songName && oldArtistName === artistName) return;
	const imageUrl = spotifyActivity?.assets?.largeImageURL();
	try {
		const response = await axios.get(imageUrl!, { responseType: 'arraybuffer' });
		const compressedImageBuffer = await sharp(response.data).png({ quality: 80 }).toBuffer();

		writeFile('image.png', compressedImageBuffer, (err) => {
			if (err) throw err;
		});
	} catch (err) {
		console.error(err);
		return;
	}

	try {
		const media_Id = await twiClient.v1.uploadMedia('./image.png');
		await twiClient.v2.tweet(`Now playing on Spotify: ${songName} by ${artistName}`, {
			media: { media_ids: [media_Id] }
		});
		unlink('./image.png', (err) => {
			if (err) throw err;
		});
	} catch (err) {
		console.error(err);
	}
}
