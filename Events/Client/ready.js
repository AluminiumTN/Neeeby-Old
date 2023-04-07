const {Client} = require('discord.js')
const mongoose = require('mongoose')
const { ActivityType } = require("discord.js")
const config = require('../../config.json')

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        try {
            mongoose.set('strictQuery', false);
            await mongoose.connect(config.mongodb)

            if (mongoose.connect) {
                console.log('База данных MongoDB подключена.')
            }

            client.user.setPresence({
                activities: [{ name: config.status, type: ActivityType.Watching}],
            });
            console.log(`${client.user.username} онлайн.`)
        }
        catch (error) {
            console.log(`Ошибка ${error}`)
        }
    },
};