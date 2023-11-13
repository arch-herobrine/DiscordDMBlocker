const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");
const fetch = require("@replit/node-fetch");
const Database = require("better-sqlite3-multiple-ciphers");
const fs = require("fs");

const db = new Database("./.data/data.db");

db.pragma('journal_mode = WAL');
db.exec(fs.readFileSync("./init.sql").toString());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.token = process.env.token;

client.on("ready", () => {
    console.log(`Ready to as ${client.user.tag}`);
});

cron.schedule("0 0,12 * * *", async () => {
    const guilds = db.prepare("select * from guilds").all();
    for (const guild of guilds) {
        let option = { "invites_disabled_until": null, "dms_disabled_until": null }
        if (guild.invite == "true") {
            option.invites_disabled_until = new Date(Date.now() + 86400 * 1000).toISOString().replace(/\.[0-9]{3}Z/, "+00:00");
        }
        if (guild.dm == "true") {
            option.dms_disabled_until = new Date(Date.now() + 86400 * 1000).toISOString().replace(/\.[0-9]{3}Z/, "+00:00");
        }
        await fetch(`https://discord.com/api/v9/guilds/${guild.id}/incident-actions`, { method: "put", headers: { authorization: client.token }, body: JSON.stringify(option) });
    }
});

client.on("guildDelete",async(guild)=>{
    db.prepare("delete from guilds where id = ?").run(guild.id);
});

client.on("guildCreate",async(guild)=>{
    db.prepare("insert into guilds values( ? , ? , ? )").run(guild.id,"false","false");
});

client.login();


