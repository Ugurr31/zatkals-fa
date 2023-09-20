const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle } = require("discord.js");
//lourity
module.exports = {
    name: "send",
    description: 'Sistem mesajını gönderirsin.',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const perm = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Yeterli yetkiye sahip değilsiniz.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [perm], ephemeral: true })

        interaction.reply({ content: "Başarıyla kuruldu!", ephemeral: true })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("💼")
                    .setLabel("Başvuru Yap")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("basvuru_button")
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🛡️")
                    .setLabel("Öneri Yap")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("oneri_button")
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("⚒️")
                    .setLabel("Şikayet Yap")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("sikayet_button")
            )

        interaction.channel.send({ content: "> ⭐ Aşağıdaki menü üzerinden **Yetkili Başvurusu** veya **Öneri ve Şikayet** yapabilirsiniz!", components: [row] })


        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("📞")
                    .setLabel("Mod Yetkilisi Çağır")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("yetkilicagir_button")
            )

        interaction.channel.send({ content: `> 👤 Merhaba **${interaction.guild.name}**\n> Sorun çözücü yetkilimize itiraz mı etmek istiyorsunuz? **Mod Yetkilisi Çağır** butonu ile bildirebilirsiniz!`, components: [row1] })

//lourity
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("⚖️")
                    .setLabel("Helper Başvurusu Yap")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("helperbasvuru_button")
            )

        interaction.channel.send({ content: `> 🏠 Aşağıdaki buton üzerinden **Helper Başvurusu** yapabilirsiniz!`, components: [row2] })
    }
}