const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, PermissionsBitField } = require('discord.js');
const { Schema } = require('mongoose');
const warnSchema = require('../../Models/warn.js');
 
module.exports ={
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Выдать предупреждение.')
    .addSubcommand(command => command
        .setName('user')
        .setDescription('Выдать предупреждение пользователю.')
        .addUserOption(option => option
            .setName('warn-user')
            .setDescription('Пользователь которому хотите выдать предупреждение.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Причина.')))
    .addSubcommand(command => command
        .setName('show')
        .setDescription('Посмотреть варны пользователя')
        .addUserOption(option => option
            .setName('warns-user')
            .setDescription('Пользователь у которого вы хотите увидеть количество варнов.')))
    .addSubcommand(command => command
        .setName('remove')
        .setDescription('Убрать варн.')
        .addUserOption(option => option
            .setName('remove-warn-user')
            .setDescription('Пользователь у которого хотите убрать.')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('removed-warn')
            .setDescription('Предупреждение, от которого вы хотите избавиться при выбранном использованииr.')
            .setRequired(true))),
    async execute (interaction)
    {
 
        const command = interaction.options.getSubcommand()
 
        if (command === 'user')
        {
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ReadMessageHistory)) return await interaction.reply({ content: 'Вам нужны права проверенного модератора чтобы использовать эту команду.', ephemeral: true })
 
            const warnedUser = interaction.options.getUser('warn-user');
            const reason = interaction.options.getString('reason') || 'Причина не задана';
 
            if (warnedUser.bot) return await interaction.reply({ content: 'Вы не можете выдать варн боту.', ephemeral: true })
 
            let Data = await warnSchema.findOne({ UserID: interaction.options.getUser('warn-user').id, GuildID: interaction.guild.id })
 
            const unwarnedEmbed = new EmbedBuilder()
            .setTitle('Предупреждения')
            .addFields({ name: 'Предупреждение!', value: `> Вы не предупредили **${warnedUser}** с причиной **${reason}**.\n> \n> Вы закрыли варн.` })
            .setColor('#32CD32')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const warnedEmbed = new EmbedBuilder()
            .setTitle('Предупреждения')
            .addFields({ name: 'Предупреждение!', value: `> **${warnedUser}** вам выдан варн по причине **${reason}**.` })
            .setColor('Red')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const warningEmbed = new EmbedBuilder()
            .setTitle('Предупреждения')
            .addFields({ name: 'Предупреждение!', value: `> Вы выдали варн **${warnedUser}** по причине **${reason}**.\n> \n> Подтверждаете?` })
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const confirmButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Подтвердить')
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel('Отклонить')
                    .setStyle(ButtonStyle.Danger),
                )
            var message = await interaction.reply({ embeds: [warningEmbed], components: [confirmButton] })
 
            const collector = message.createMessageComponentCollector()
 
            collector.on('collect', async i => {
 
                if (i.user.id != interaction.user.id) return await i.reply({ content: 'Это не ваша команда!', ephemeral: true })
 
                if (i.customId == 'confirm')
                {
 
                    if (!Data)
                    {
                        Data = new warnSchema({
                            UserID: warnedUser.id,
                            GuildID: interaction.guild.id,
                        })
 
                    }
 
                    await i.reply({ content: 'Подтверждено!', ephemeral: true })
                    await interaction.editReply({ embeds: [warnedEmbed], components: [] })
                    Data.Warns.push(reason)
 
                    const dmEmbed = new EmbedBuilder()
                    .setTitle('Предупреждение')
                    .addFields({ name: 'Вы получили варн!', value: `Вы получили варн в  ${interaction.guild.name} по причине: ${reason}` })
                    .setColor('Red')
                    .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                    await warnedUser.send({ embeds: [dmEmbed] }).catch(err => {
                        return;
                    })
 
                    await Data.save()
 
                }
                else {
 
                    await i.reply({ content: 'Отклонено!', ephemeral: true })
                    await interaction.editReply({ embeds: [unwarnedEmbed], components: [] })
 
                }
 
            })
 
        }
 
 
        if (command === 'show')
        {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ReadMessageHistory)) return await interaction.reply({ content: 'Вам нужны права проверенного модератора чтобы использовать эту команду.', ephemeral: true })
 
            const warnsUser = interaction.options.getUser('warns-user') || interaction.user;
 
        
            let DataWarns = await warnSchema.findOne({ UserID: warnsUser.id, GuildID: interaction.guild.id })
 
            if ((!DataWarns || DataWarns.Warns.length == 0) && command === 'show')
            {
 
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle('Предупреждений нет!')
                .addFields({ name: '0 предупреждений!', value: `${warnsUser} не имеет предупреждений!` })
                .setColor('Blue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
 
            }
 
            else {
 
                let numberOfWarns1 = 0
                let numberOfWarns = 1
                let warns = ''
 
                for (i in DataWarns.Warns)
                {
 
                    warns += `**Предупреждение** **__${numberOfWarns}__**\n${DataWarns.Warns[numberOfWarns1]}\n\n`
 
                    numberOfWarns += 1
                    numberOfWarns1 += 1
 
                }
 
                const showWarnsEmbed = new EmbedBuilder()
                .setAuthor({ name: `${warnsUser.username} | предупреждение в  ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTitle('Предупреждения')
                .setDescription(warns)
                .setColor('Blue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
 
                await interaction.reply({ embeds: [showWarnsEmbed] })
 
            }
        }
 
        if (command === 'remove')
        {
           // че это за хуйня нахуй?
            // и хули она блять не работает нахуй
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ReadMessageHistory)) return await interaction.reply({ content: 'Вам нужны права проверенного модератора чтобы использовать эту команду.', ephemeral: true })
 
            removeWarnUser = interaction.options.getUser('remove-warn-user');
            warnRemoved = interaction.options.getInteger('removed-warn')
            warnRemoved -= 1
 
            let DataUnwarned = await warnSchema.findOne({ UserID: interaction.options.getUser('remove-warn-user').id, GuildID: interaction.guild.id })
 
            if (!DataUnwarned || DataUnwarned.Warns.length == 0)
            {
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle('Нет предупреждений!')
                .addFields({ name: '0 предупреждений!', value: `${removeWarnUser} не имеет предупреждений!` })
                .setColor('Blue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
            }
 
            if (DataUnwarned.Warns[warnRemoved] == undefined)
            {
                const highWarnEmbed = new EmbedBuilder()
                .setTitle('Предупреждений не обнаружено!')
                .addFields({ name: 'Предупреждений не обнаружено!', value: `Вы не указали предупреждение, которое находится в пределах диапазона ${removeWarnUser}.\nИспользуйте \`/warn show\` чтобы увидеть его предупреждения.` })
                .setColor('Blue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [highWarnEmbed] })
            }
 
 
            const removedWarnEmbed = new EmbedBuilder()
            .setTitle('Предупреждения')
            .addFields({ name: 'Предупреждение убрано!', value: `Вы убрали предупреждение ${removeWarnUser} под названием : **${DataUnwarned.Warns[warnRemoved]}**` })
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            const dmEmbed = new EmbedBuilder()
            .setTitle('Предупреждение убрано!')
            .addFields({ name: 'Ваше предупреждение было убрано!', value: `Ваше предупреждение было убрано в ${interaction.guild.name}!\nВарн убран: ${DataUnwarned.Warns[warnRemoved]}` })
            .setColor('Red')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            await removeWarnUser.send({ embeds: [dmEmbed] }).catch(err => {
                return;
            })
            DataUnwarned.Warns.splice(DataUnwarned.Warns[warnRemoved], 1)
            DataUnwarned.save()
            return await interaction.reply({ embeds: [removedWarnEmbed] })
        }
 
    }
}