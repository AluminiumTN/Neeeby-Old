const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Кикнуть пользователя с сервера.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => 
        option.setName("target")
        .setDescription("Пользоваель которого нужно кикнуть.")
        .setRequired(true)
        )

        .addStringOption(option =>
            option.setName("reason")
            .setDescription("Причина кика")
            
        ),

        async execute(interaction) {
            const {channel, options} = interaction;

            const user = options.getUser("target");
            const reason = options.getString("reason") || "Причина не установлена";

            const member = await interaction.guild.members.fetch(user.id);

            const errEmbed = new EmbedBuilder()
            .setDescription(`Вы не можете кикнуть ${user.username} потому что у него выше роль!`)
            .setColor(`#ff69b4`)
            
            if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true});

            await member.kick(reason);

            const embed = new EmbedBuilder()
            .setDescription(`${user} был кикнут по причине: ${reason}`)
            .setColor(`#ff69b4`);

            await interaction.reply({
                embeds: [embed],
            });
        }
}
