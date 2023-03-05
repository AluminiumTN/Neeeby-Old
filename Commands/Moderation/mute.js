const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require("discord.js");
const ms = require("ms");
const { execute } = require("./ban");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Мутит пользователя")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
        option.setName("target")
        .setDescription("Выберите пользователя которого хотите замутить")
        .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("time")
            .setDescription("Время мута")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
            .setDescription("Причина мута")
            .setRequired(true)
         ),
         
         async execute(interaction) {
            const {guild, options} = interaction;

            const user = options.getUser("target");
            const member = guild.members.cache.get(user.id);
            const time = options.getString("time");
            const convertedTime = ms(time);
            const reason = options.getString("reason") || "Причина не установлена";

            const errEmbed = new EmbedBuilder()
            .setDescription(`Что-то пошло не так. Пожалуйста попробуйте позже`)
            .setColor(`#ff69b4`)

            const succesEmbed = new EmbedBuilder()
            .setTitle("**Замучен**")
            .setDescription(`${user} был замучен`)
            .addFields(
                {name: "Причина", value: `${reason}`, inline: true },
                {name: "Длительность", value: `${time}`, inline: true }
            )
            .setColor(`#ff69b4`)
            .setTimestamp();

            if  (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: false });

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: false });

            if (!convertedTime)
            return interaction.reply({ embeds: [errEmbed], ephemeral: false });

            try {
                await member.timeout(convertedTime, reason);

                interaction.reply({ embeds: [succesEmbed], ephemeral: false});
            } catch (error) {
                console.log(error);
            }
         }
}