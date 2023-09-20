// Discord
const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent } = require("discord.js");

// İNTENTS
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });

const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const config = require("./config.json")
// Database
const db = require("croxydb")

global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });

    console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} eventi yüklendi.`)
});


client.login(TOKEN)

// Bir Hata Oluştu
process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p);
})

process.on("unhandledRejection", async (error) => {
    return console.log("Bir hata oluştu! " + error)
})
//
//
//

client.on("interactionCreate", async (interaction) => {

    //lourity
    const basvuru_form_modal = new ModalBuilder().setCustomId('basvuru_modal').setTitle('Yetkili Başvuru')
    const basvuru_form_modal_plugin = new TextInputBuilder().setCustomId('question').setLabel('İsim Yaş').setStyle(TextInputStyle.Short).setRequired(true)
    const basvuru_form_modal_plugin1 = new TextInputBuilder().setCustomId('question1').setLabel('Sunucuda Ne Kadar Aktifsiniz').setStyle(TextInputStyle.Short).setRequired(true)
    const basvuru_form_modal_plugin2 = new TextInputBuilder().setCustomId('question2').setLabel('Sunucu için Neler Yapabilirsiniz').setStyle(TextInputStyle.Short).setRequired(true)
    const basvuru_form_modal_plugin3 = new TextInputBuilder().setCustomId('question3').setLabel('Daha Önce Sunucularda Yetkili Oldun Mu').setStyle(TextInputStyle.Short).setRequired(true)
    const basvuru_form_modal_plugin4 = new TextInputBuilder().setCustomId('question4').setLabel('Neden Bizi Tercih Ediyorsun').setStyle(TextInputStyle.Short).setRequired(true)

    const basvuru_form_modal_row = new ActionRowBuilder().addComponents(basvuru_form_modal_plugin);
    const basvuru_form_modal_row1 = new ActionRowBuilder().addComponents(basvuru_form_modal_plugin1);
    const basvuru_form_modal_row2 = new ActionRowBuilder().addComponents(basvuru_form_modal_plugin2);
    const basvuru_form_modal_row3 = new ActionRowBuilder().addComponents(basvuru_form_modal_plugin3);
    const basvuru_form_modal_row4 = new ActionRowBuilder().addComponents(basvuru_form_modal_plugin4);
    basvuru_form_modal.addComponents(basvuru_form_modal_row, basvuru_form_modal_row1, basvuru_form_modal_row2, basvuru_form_modal_row3, basvuru_form_modal_row4);


    if (interaction.customId === "basvuru_button") {
        await interaction.showModal(basvuru_form_modal);
    }

    if (interaction.type === InteractionType.ModalSubmit) {

        if (interaction.customId === "basvuru_modal") {
            const question = interaction.fields.getTextInputValue("question");
            const question1 = interaction.fields.getTextInputValue("question1");
            const question2 = interaction.fields.getTextInputValue("question2");
            const question3 = interaction.fields.getTextInputValue("question3");
            const question4 = interaction.fields.getTextInputValue("question4");

            const log_button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Onayla")
                        .setStyle(ButtonStyle.Success)
                        .setCustomId("approve_logForm")
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Reddet")
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("deny_logForm")
                )


            //lourity
            const log = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${interaction.user} adlı kullanıcı yetkili olmak için başvurdu!`)
                .addFields(
                    { name: "İsim Yaş", value: `${question}` },
                    { name: "Sunucuda Ne Kadar Aktifsiniz", value: `${question1}` },
                    { name: "Sunucu için Neler Yapabilirsiniz", value: `${question2}` },
                    { name: "Daha Önce Sunucularda Yetkili Oldun Mu", value: `${question3}` },
                    { name: "Neden Bizi Tercih Ediyorsun", value: `${question4}` },
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild?.iconURL() })
                .setTimestamp()

            interaction.reply({ content: "Başvurunuz yetkililerimize gönderildi, sonuçlandığında size dm üzerinden bilgi verilecektir.", ephemeral: true });
            client.channels.cache.get(config.BASVURU_LOG).send({ content: `${interaction.user.id}`, embeds: [log], components: [log_button] })
        }
    }

    //lourity

    //
    if (interaction.customId === "approve_logForm") {
        const member = await interaction.guild.members.fetch(interaction.message.content);
        if (!member) return await interaction.deferUpdate();

        member.roles.add(config.BASVURU_ROLE).catch(e => { })

        const log_update_button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Onaylandı")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("approve_logForm")
                    .setDisabled(true)
            )

        const approve_embed = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${member.user.username}`, iconURL: member.displayAvatarURL() })
            .setDescription(`${member} yapmış olduğun yetkili başvurusu yetkilimiz (**${interaction.user.username}**) tarafından onaylandı!`)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() }).setTimestamp()

        interaction.update({ components: [log_update_button] })
        await member.send({ embeds: [approve_embed] }).catch(e => { })
    }

    if (interaction.customId === "deny_logForm") {
        const member = await interaction.guild.members.fetch(interaction.message.content);
        if (!member) return await interaction.deferUpdate();

        const log_update_button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Reddedildi")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("deny_logForm")
                    .setDisabled(true)
            )

        const deny_embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: `${member.user.username}`, iconURL: member.displayAvatarURL() })
            .setDescription(`${member} yapmış olduğun yetkili başvurusu yetkilimiz (**${interaction.user.username}**) tarafından reddedildi!`)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() }).setTimestamp()

        interaction.update({ components: [log_update_button] })
        await member.send({ embeds: [deny_embed] }).catch(e => { })
    }
    //



    //lourity

    const oneri_form_modal = new ModalBuilder().setCustomId('oneri_modal').setTitle('Öneri')
    const oneri_form_modal_plugin = new TextInputBuilder().setCustomId('question').setLabel('Öneriniz Nedir').setStyle(TextInputStyle.Short).setRequired(true)

    const oneri_form_modal_row = new ActionRowBuilder().addComponents(oneri_form_modal_plugin);
    oneri_form_modal.addComponents(oneri_form_modal_row);


    if (interaction.customId === "oneri_button") {
        await interaction.showModal(oneri_form_modal);
    }

    if (interaction.type === InteractionType.ModalSubmit) {

        if (interaction.customId === "oneri_modal") {
            const question = interaction.fields.getTextInputValue("question");

            const log = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${interaction.user} adlı kullanıcı bir **öneride** bulundu!`)
                .addFields(
                    { name: "Öneri", value: `${question}` },
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild?.iconURL() })
                .setTimestamp()

            interaction.reply({ content: "Öneriniz yetkililerimize gönderildi.", ephemeral: true });
            client.channels.cache.get(config.ONERİ_LOG).send({ embeds: [log] })
        }
    }



    //lourity

    const sikayet_form_modal = new ModalBuilder().setCustomId('sikayet_modal').setTitle('Şikayet')
    const sikayet_form_modal_plugin = new TextInputBuilder().setCustomId('question').setLabel('Şikayetiniz Nedir').setStyle(TextInputStyle.Short).setRequired(true)

    const sikayet_form_modal_row = new ActionRowBuilder().addComponents(sikayet_form_modal_plugin);
    sikayet_form_modal.addComponents(sikayet_form_modal_row);


    if (interaction.customId === "sikayet_button") {
        await interaction.showModal(sikayet_form_modal);
    }

    if (interaction.type === InteractionType.ModalSubmit) {

        if (interaction.customId === "sikayet_modal") {
            const question = interaction.fields.getTextInputValue("question");

            const log = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${interaction.user} adlı kullanıcı bir **şikayette** bulundu!`)
                .addFields(
                    { name: "Şikayet", value: `${question}` },
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild?.iconURL() })
                .setTimestamp()

            interaction.reply({ content: "Şikayetiniz yetkililerimize gönderildi.", ephemeral: true });
            client.channels.cache.get(config.SİKAYET_LOG).send({ embeds: [log] })
        }
    }



    //lourity

    const ytcagir_form_modal = new ModalBuilder().setCustomId('ytcagir_modal').setTitle('Yetkili Çağır')
    const ytcagir_form_modal_plugin = new TextInputBuilder().setCustomId('question').setLabel('Bildirim Sebebiniz Nedir').setStyle(TextInputStyle.Short).setRequired(true)

    const ytcagir_form_modal_row = new ActionRowBuilder().addComponents(ytcagir_form_modal_plugin);
    ytcagir_form_modal.addComponents(ytcagir_form_modal_row);


    if (interaction.customId === "yetkilicagir_button") {
        await interaction.showModal(ytcagir_form_modal);
    }

    if (interaction.type === InteractionType.ModalSubmit) {

        if (interaction.customId === "ytcagir_modal") {
            const question = interaction.fields.getTextInputValue("question");

            const log = new EmbedBuilder()
                .setColor("Yellow")
                .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${interaction.user} adlı kullanıcı bir **yetkili çağırdı**!`)
                .addFields(
                    { name: "Sorunu", value: `${question}` },
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild?.iconURL() })
                .setTimestamp()

            interaction.reply({ content: "Bildiriminiz yetkililerimize gönderildi.", ephemeral: true });
            client.channels.cache.get(config.MODYT_LOG).send({ content: `<@&${config.MODYT_YETKİLİ_ROLE}>`, embeds: [log] })
        }
    }



    //lourity


    const helper_form_modal = new ModalBuilder().setCustomId('helper_modal').setTitle('Helper Başvuru')
    const helper_form_modal_plugin = new TextInputBuilder().setCustomId('question').setLabel('İsim Yaş').setStyle(TextInputStyle.Short).setRequired(true)
    const helper_form_modal_plugin1 = new TextInputBuilder().setCustomId('question1').setLabel('Sunucuda Ne Kadar Aktifsiniz').setStyle(TextInputStyle.Short).setRequired(true)
    const helper_form_modal_plugin2 = new TextInputBuilder().setCustomId('question2').setLabel('Sunucu için Neler Yapabilirsiniz').setStyle(TextInputStyle.Short).setRequired(true)

    const helper_form_modal_row = new ActionRowBuilder().addComponents(helper_form_modal_plugin);
    const helper_form_modal_row1 = new ActionRowBuilder().addComponents(helper_form_modal_plugin1);
    const helper_form_modal_row2 = new ActionRowBuilder().addComponents(helper_form_modal_plugin2);
    helper_form_modal.addComponents(helper_form_modal_row, helper_form_modal_row1, helper_form_modal_row2);


    if (interaction.customId === "helperbasvuru_button") {
        await interaction.showModal(helper_form_modal);
    }

    //lourity
    if (interaction.type === InteractionType.ModalSubmit) {

        if (interaction.customId === "helper_modal") {
            const question = interaction.fields.getTextInputValue("question");
            const question1 = interaction.fields.getTextInputValue("question1");
            const question2 = interaction.fields.getTextInputValue("question2");

            const log_button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Onayla")
                        .setStyle(ButtonStyle.Success)
                        .setCustomId("approve_logForm2")
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Reddet")
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("deny_logForm2")
                )


            const log = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${interaction.user} adlı kullanıcı **helper** olmak için başvurdu!`)
                .addFields(
                    { name: "İsim Yaş", value: `${question}` },
                    { name: "Sunucuda Ne Kadar Aktifsiniz", value: `${question1}` },
                    { name: "Sunucu için Neler Yapabilirsiniz", value: `${question2}` },
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild?.iconURL() })
                .setTimestamp()

            interaction.reply({ content: "Başvurunuz yetkililerimize gönderildi, sonuçlandığında size dm üzerinden bilgi verilecektir.", ephemeral: true });
            client.channels.cache.get(config.HELPERBS_LOG).send({ content: `${interaction.user.id}`, embeds: [log], components: [log_button] })
        }
    }


    //lourity
    //
    if (interaction.customId === "approve_logForm2") {
        const member = await interaction.guild.members.fetch(interaction.message.content);
        if (!member) return await interaction.deferUpdate();

        member.roles.add(config.HELPERS_ROLE).catch(e => { })

        const log_update_button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Onaylandı")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("approve_logForm")
                    .setDisabled(true)
            )

        const approve_embed = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${member.user.username}`, iconURL: member.displayAvatarURL() })
            .setDescription(`${member} yapmış olduğun **helper** başvurusu yetkilimiz (**${interaction.user.username}**) tarafından onaylandı!`)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() }).setTimestamp()

        interaction.update({ components: [log_update_button] })
        await member.send({ embeds: [approve_embed] }).catch(e => { })
    }

    if (interaction.customId === "deny_logForm2") {
        const member = await interaction.guild.members.fetch(interaction.message.content);
        if (!member) return await interaction.deferUpdate();

        const log_update_button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Reddedildi")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("deny_logForm")
                    .setDisabled(true)
            )

        //lourity
        const deny_embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: `${member.user.username}`, iconURL: member.displayAvatarURL() })
            .setDescription(`${member} yapmış olduğun **helper** başvurusu yetkilimiz (**${interaction.user.username}**) tarafından reddedildi!`)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() }).setTimestamp()

        interaction.update({ components: [log_update_button] })
        await member.send({ embeds: [deny_embed] }).catch(e => { })
    }
    //
})

//lourity
//lourity
