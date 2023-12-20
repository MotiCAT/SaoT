"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPresenceUpdate = void 0;
const index_1 = require("../index");
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const sharp_1 = __importDefault(require("sharp"));
async function onPresenceUpdate(oldPresence, newPresence) {
    if (newPresence.userId !== process.env.USER_ID)
        return;
    const spotifyActivity = newPresence.activities.find((activity) => activity.name === 'Spotify');
    if (!spotifyActivity)
        return;
    const oldActivity = oldPresence?.activities.find((activity) => activity.name === 'Spotify');
    const { details: oldSongName, state: oldArtistName } = oldActivity || { details: '', state: '' };
    const { details: songName, state: artistName } = spotifyActivity;
    if (oldSongName === songName && oldArtistName === artistName)
        return;
    const imageUrl = spotifyActivity?.assets?.largeImageURL();
    try {
        const response = await axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
        const compressedImageBuffer = await (0, sharp_1.default)(response.data)
            .png({ quality: 80 })
            .toBuffer();
        (0, fs_1.writeFile)('image.png', compressedImageBuffer, (err) => {
            if (err)
                throw err;
        });
    }
    catch (err) {
        console.error(err);
        return;
    }
    try {
        const media_Id = await index_1.twiClient.v1.uploadMedia('./image.png');
        await index_1.twiClient.v2.tweet(`Now playing on Spotify: ${songName} by ${artistName}`, {
            media: { media_ids: [media_Id] }
        });
        (0, fs_1.unlink)('./image.png', (err) => {
            if (err)
                throw err;
        });
    }
    catch (err) {
        console.error(err);
    }
}
exports.onPresenceUpdate = onPresenceUpdate;
