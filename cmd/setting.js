const Database = require("better-sqlite3-multiple-ciphers");
const { ApplicationCommandOptionType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, OverwriteType, CommandInteraction, Client } = require("discord.js");
module.exports = {
    data: {
        name: "settings",
        description: "現在の設定の表示",
        defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
        options: [],
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
        int.editReply({
            embeds: [
                {
                    "title": "現在の設定",
                    "fields": [
                        {
                            "name": "DMの制限",
                            "value": current.dm == "true" ? "__ON__" : "__OFF__"
                        },
                        {
                            "name": "招待の無効化",
                            "value": current.invite == "true" ? "__ON__" : "__OFF__"
                        }
                    ]
                }
            ]
        });
    }
}
