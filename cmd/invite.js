const Database = require("better-sqlite3-multiple-ciphers");
const fetch = require("@replit/node-fetch");
const { ApplicationCommandOptionType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, OverwriteType, CommandInteraction, Client } = require("discord.js");
module.exports = {
    data: {
        name: "invite",
        description: "招待リンクの有効化/無効化の切り替え",
        defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "enable",
                description: "招待リンクの停止/セキュリティ措置の有効化",
                options: []
            }, {
                type: ApplicationCommandOptionType.Subcommand,
                name: "disable",
                description: "招待リンクの再開/セキュリティ措置の無効化",
                options: []
            }
        ],
    },
    /**
    * 
    * @param {CommandInteraction} int 
    * @param {Client} client 
    * @param {Database} db
    * @returns 
    */
    async execute(int, client, db) {
        await int.deferReply({ ephemeral: true });
        if (!int.inGuild()) {
            return int.editReply("DMでは実行できません");
        }
        let current = db.prepare("select * from guilds where id = ?").get(int.guild.id);
        if (!current) {
            db.prepare("insert into guilds values( ? , ? , ? )").run(int.guild.id, "false", "false");
            current = {
                id: int.guild.id,
                dm: "false",
                invite: "false"
            };
        }
        if (int.options.getSubcommand() == "enable") {
            if (current.invite == "true") {
                int.editReply("すでにこのサーバーの招待URLの無効化は__ON__です");
            } else {
                int.editReply("招待URLを停止します");
                db.prepare("update guilds set invite = 'true' where id = ?").run(int.guild.id);
                current.invite = "true";
            }
        } else if (int.options.getSubcommand() == "disable") {
            if (current.invite == "false") {
                int.editReply("すでにこのサーバーの招待URLの無効化は__OFF__です");
            } else {
                int.editReply("招待URLを有効化します");
                db.prepare("update guilds set invite = 'false' where id = ?").run(int.guild.id);
                current.invite = "false";
            }
        }
        let option = { "invites_disabled_until": null, "dms_disabled_until": null }
        if (current.invite == "true") {
            option.invites_disabled_until = new Date(Date.now() + 86400 * 1000).toISOString().replace(/\.[0-9]{3}Z/, "+00:00");
        }
        if (current.dm == "true") {
            option.dms_disabled_until = new Date(Date.now() + 86400 * 1000).toISOString().replace(/\.[0-9]{3}Z/, "+00:00");
        }
        await fetch(`https://discord.com/api/v9/guilds/${int.guild.id}/incident-actions`, { "method": "put", "headers": { "content-type": "application/json", "authorization": `Bot ${client.token}` }, "body": JSON.stringify(option) });
    }
}