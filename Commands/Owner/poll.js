const {SlashCommandBuilder} = require('@discordjs/builders')
const {EmbedBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType} = require('discord.js')
const PollSchema = require('../../Models/poll')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Создайте опрос для голосования')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option.setName('description').setDescription('Укажите, содержание голосования').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Роль для пинга').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('Канал в который хотите отправить голосование.').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute (interaction) {
        const {options, user} = interaction;
        const channel = options.getChannel('channel')
        const role = options.getRole('role')
        const description = options.getString('description')
        const embed = new EmbedBuilder()
        .setColor('#ff69b4')
        .setDescription(description)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        try {
            const m = await channel.send({ embeds: [embed], content: `${role}` })
            await m.react("✅")
            await m.react("↔")
            await m.react("❌")
            await interaction.reply({content: 'Голосование отправлено в канал', ephemeral: true})
            
            
        } catch(err) {
            console.log(err)
            return;
        }
    }
}