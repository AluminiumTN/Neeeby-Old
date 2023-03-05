const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Разбанить пользователя")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("userid")
        .setDescription("Discord ID пользователя которого хотите разбанить.")
        .setRequired(true)
        ),
 
        async execute(interaction) {
            const{channel, options} = interaction;
 
            const userId = options.getString("userid");
 
            try {
                await interaction.guild.members.unban(userId);
 
                const embed = new EmbedBuilder()
                .setDescription(`${userId} разбанен`)
                .setColor(`#ff69b4`)
                .setTimestamp();
 
                await interaction.reply({
                    embeds: [embed],
                });
            } catch(error) {
                console.log(error);
 
 
                const errEmbed = new EmbedBuilder()
                .setDescription(`Пожалуйста напишите действуйщий ID.`)
                .setColor(`#ff69b4`);
 
                interaction.reply({ embeds: [errEmbed], ephemeral: true});
            }
        }
}
