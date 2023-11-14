const Database = require("better-sqlite3-multiple-ciphers");
const { ApplicationCommandOptionType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, OverwriteType, CommandInteraction, Client } = require("discord.js");
module.exports = {
    "data": {
        name: "help",
        description: "このBotの概要/コマンド一覧の表示",
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
        await int.deferReply({ "ephemeral": true });
        int.editReply({
            "embeds":[
                {
                    "description":"## このBotの概要\n"+
                    "このBotは設定した通りにセキュリティ措置を12時間ごとに更新し続けるBotです。\n"+
                    "導入リンクは[__こちら__](https://discord.com/api/oauth2/authorize?client_id=1173430906564911134&permissions=32&scope=applications.commands%20bot)。\n"+
                    "このBotはオープンソースです。\n"+
                    "GitHubのリポジトリ: [__arch-herobrine/DiscordDMBlocker__](https://github.com/arch-herobrine/DiscordDMBlocker)\n"+
                    "## コマンド一覧\n"+
                    "`/help`以外は「サーバーの管理」の権限が必要です。",
                    "fields":[
                        {
                            "name":"/help",
                            "value":"このBotの概要/コマンド一覧を表示"
                        },{
                            "name":"/invite enable",
                            "value":"招待URLの無効化を開始"
                        },
                        {
                            "name":"/invite disable",
                            "value":"招待URLの無効化を終了/招待URLの再開"
                        },
                        {
                            "name":"/dm enable",
                            "value":"DMの制限を開始"
                        },
                        {
                            "name":"/dm disable",
                            "value":"DMの制限を終了/メンバーによるDMの解放"
                        },{
                            "name":"/settings",
                            "value":"現在の設定を表示"
                        },
                    ]
                }
            ]
        });
    }
}