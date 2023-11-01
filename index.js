const {Client,GatewayIntentBits} = require("discord.js");
const cron = require("node-cron");
const fetch = require("@replit/node-fetch");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.token = process.env.token;

client.on("ready",()=>{
    console.log(`Ready to as ${client.user.tag}`);
});

cron.schedule("0 0,12 * * *",async()=>{
    let option = {"invites_disabled_until":null,"dms_disabled_until":null}
    if(guild.disableInvite == "true"){
        option.invites_disabled_until = new Date(Date.now()+86400*1000).toISOString().replace(/\.[0-9]{3}Z/,"+00:00");
    }
    if(guild.disableDM == "true"){
        option.dms_disabled_until = new Date(Date.now()+86400*1000).toISOString().replace(/\.[0-9]{3}Z/,"+00:00");
    }
    fetch(`https://discord.com/api/v9/guilds/${guild.id}/incident-actions`,{method:"put",headers:{authorization:client.token},body:JSON.stringify(option)});
});

client.login();


