"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onReady = void 0;
const discord_js_1 = require("discord.js");
function onReady(client) {
    console.log(`Logged in as ${client.user?.tag}`);
    client.user?.setActivity('CatHouse Products');
    console.table({
        'Bot User': client.user?.tag,
        'Guild(s)': client.guilds.cache.size + ' Servers',
        Watching: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) + ' Members',
        'Discord.js': discord_js_1.version,
        'Node.js': process.version,
        Plattform: process.platform + ' | ' + process.arch,
        Memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) +
            'MB | ' +
            (process.memoryUsage().rss / 1024 / 1024).toFixed(2) +
            'MB'
        // Quote from: https://github.com/Nich87/Faith
    });
}
exports.onReady = onReady;
