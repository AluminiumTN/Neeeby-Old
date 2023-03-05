const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Забанить пользователя.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => 
        option.setName("target")
        .setDescription("Пользователя которого хотите забанить.")
        .setRequired(true)
        )
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("Причина бана.")
        ),
        
        async execute(interaction) {
            const {channel, options} = interaction;

            const user = options.getUser("target");
            const reason = options.getString("reason") || "Причина не установлена.";

            const member = await interaction.guild.members.fetch(user.id);

            const errEmbed = new EmbedBuilder()
            .setDescription(`Вы не можете забанить ${user.username}, потому что у него выше роль.`)
            .setColor(`#ff69b4`);

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [errEmbed], ephemeral: true});

            await member.ban({reason});

            const embed = new EmbedBuilder()
            .setDescription(`${user} забанен по причине: ${reason}`)
            .setColor(`#ff69b4`)
            .setTimestamp()

            await interaction.reply({
                embeds: [embed]
            });
        }
}