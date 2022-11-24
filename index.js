const Discord = require('discord.js'); //import discord.js
const jf = require('jsonfile');
var users = jf.readFileSync('./users.json');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_INTEGRATIONS"] })


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', async interaction => {
  //console.log(interaction);
  if (interaction.type = "MESSAGE_COMPONENT") {
    if (interaction.message.embeds[0].title == `User identification`) {
      if (interaction.customId == "IAMSELLERID") {
        if (interaction.message.embeds[0].fields[0].value == "\`none\`") {
          interaction.reply({ content: `<@${interaction.user.id}> has been set as the seller`, ephemeral: true });
          var edited = interaction.message;
          edited.embeds[0].fields[0].value = `<@${interaction.user.id}>`;
          interaction.message.edit({ content: interaction.message.content, embeds: edited.embeds });
          interaction.disabled = true;
        }
        else {
          interaction.reply({ content: "someone is already marked as the seller.", ephemeral: true })
        }

      }
      if (interaction.customId == "IAMBUYERID") {
        if (interaction.message.embeds[0].fields[1].value == "\`none\`") {
          interaction.reply({ content: `<@${interaction.user.id}> has been set as the buyer`, ephemeral: true });
          var edited = interaction.message;
          edited.embeds[0].fields[1].value = `<@${interaction.user.id}>`;
          interaction.message.edit({ content: interaction.message.content, embeds: edited.embeds });
          interaction.disabled = true;
        }
        else {
          interaction.reply({ content: "someone is already marked as the buyer.", ephemeral: true })
        }
      }
      if (interaction.message.embeds[0].fields[0].value != "\`none\`" && interaction.message.embeds[0].fields[1].value != "\`none\`") {

        PaymentPromt(interaction.message, (await interaction.guild.members.fetch(interaction.message.content.replace("<@", "").replace(">", ""))).user);
      }
    }
  }
})
client.on('messageCreate', async message => {
  users = jf.readFileSync('./users.json');
  if (message.author.bot) {
    return;
  }
  if (users[message.author.id] == undefined) {
    users[message.author.id] = {
      completed: 0,
      canceled: 0,
      totalPur: 0,
      totalSol: 0,
      totalPas: 0
    }
    jf.writeFileSync('./users.json', users)
  }


  if (message.channel.name.startsWith("limiteds") || message.channel.name.startsWith("ticket")) {
    if (message.channel.messages.cache.at(message.channel.messages.cache.size - 2).embeds[0] != undefined) {

    }

    if (message.channel.messages.cache.size > 4) {
      //console.log(message.channel.messageCount);
      return;
    }
    var userName = message.content;
    //console.log(userName);
    //console.log(message.guild.members.cache.toJSON().toString());
    var un = undefined;
    //var un = message.guild.members.cache  .find(user => user.user.username == userName);
    var ut = (await message.guild.members.fetch()).find(user => user.user.tag == userName);
    var ui = (await message.guild.members.fetch()).find(user => user.id == userName);
    console.log(un);
    console.log(ut);
    console.log(ui);

    if (un != undefined) {
      /*
        message.channel.send({
          "channel_id": `${message.channel.id}`,
          "content": "Succesfull",
          "tts": false,
          "embeds": [
            {
              "type": "rich",
              "title":  `User "`+userName+`" found! adding into channel...`,
              "color": 0x3cff00
            }
          ]
        });
    */
      message.channel.send("$add " + un.id)
      Succesfull(message, message.author);
      //setTimeout( function run( ){ message.channel.send(`<@${un.id}> You have been added to the ticket by <@${message.author.id}>`)},1000)
    }
    else if (ut != undefined) {
      /*message.channel.send({
          "channel_id": `${message.channel.id}`,
          "content": "Succesfull",
          "tts": false,
          "embeds": [
            {
              "type": "rich",
              "title":  `User "`+userName+`" found! adding into channel...`,
              "color": 0x3cff00
            }
          ]
        });*/
      message.channel.send("$add " + ut.id)
      Succesfull(message, message.author);
      //setTimeout(function run( ){ message.channel.send(`<@${ut.id}> You have been added to the ticket by <@${message.author.id}>`)},1000)
    }
    else if (ui != undefined) {
      /*message.channel.send({
          "channel_id": `${message.channel.id}`,
          "content": "Succesfull",
          "tts": false,
          "embeds": [
            {
              "type": "rich",
              "title":  `User "`+userName+`" found! adding into channel...`,
              "color": 0x3cff00
            }
          ]
        });*/
      message.channel.send("$add " + ui.id)
      Succesfull(message, message.author);
      //setTimeout(function run( ){ message.channel.send(`<@${ui.id}> You have been added to the ticket by <@${message.author.id}>`)},1000)

    }
    else {
      message.delete();
      var deletable = message.channel.send({
        "channel_id": `${message.channel.id}`,
        "content": " ",
        "tts": false,
        "embeds": [
          {
            "type": "rich",
            "description": "Could not find user - it is likely they are not even in this server",
            "color": 0xff0000
          }
        ]
      });
      setTimeout(async function run() {
        (await deletable).delete();
      }, 3000)
    }
  }
  else {
    var args = message.content.replace("<@", "").replace(">", "").split(" ");
    //console.log(args[1])
    var command = args[0];
    if (command == "$stats") {
      var user = message.author;

      if (args.length > 1) {
        var ut = (await message.guild.members.fetch()).find(user => user.user.tag == args[1]);
        var ui = (await message.guild.members.fetch()).find(user => user.id == args[1]);
        if (ut != undefined) {
          user = ut;
        }
        if (ui != undefined) {
          user = ui;
        }
      }
      if (users[user.id] == undefined) {
        users[user.id] = {
          completed: 0,
          canceled: 0,
          totalPur: 0,
          totalSol: 0,
          totalPas: 0
        }
        jf.writeFileSync('./users.json', users)
      }
      if (args[2] == "set") {
        if (!message.member.permissions.any("MANAGE_MESSAGES")) {
          message.reply(`only users with the "MANAGE_MESSAGES" permission can use this sub-command`)
          return;
        }
        if (args[3] == undefined) {
          message.reply("valid usage: $stats <discordAccount> set **<completed,canceled,totalPur,totalSol>** <value:number>");
          return;
        }
        if (args[4] == undefined) {
          message.reply("valid usage: $stats <discordAccount> set <completed,canceled,totalPurchased,totalSold> **<value:number>**");
          return;
        }
        if (parseInt(args[4]) + parseInt(args[4]) - parseInt(args[4]) != parseInt(args[4])) {
          message.reply("valid usage: $stats <discordAccount> set <completed,canceled,totalPurchased,totalSold> **<value:number>**");
          return;
        }
        else {
          if (args[3] == "completed") {
            users[user.id].completed = parseInt(args[4]);
            message.reply("value `" + args[3] + "` was set to `" + args[4] + "`");
            jf.writeFileSync('./users.json', users)
          }
          else if (args[3] == "canceled") {
            users[user.id].canceled = parseInt(args[4]);
            message.reply("value `" + args[3] + "` was set to `" + args[4] + "`");
            jf.writeFileSync('./users.json', users)
          }
          else if (args[3] == "totalPurchased") {
            users[user.id].totalPur = parseInt(args[4]);
            message.reply("value `" + args[3] + "` was set to `" + args[4] + "`");
            jf.writeFileSync('./users.json', users)
          }
          else if (args[3] == "totalSold") {
            users[user.id].totalSol = parseInt(args[4]);
            message.reply("value `" + args[3] + "` was set to `" + args[4] + "`");
            jf.writeFileSync('./users.json', users)
          }
          else {
            message.reply("valid usage: $stats <discordAccount> set **<completed,canceled,totalPurchased,totalSold>** <value:number>");
            return;
          }
        }

      }
      else if (args[2] == "add") {
        if (!message.member.permissions.any("MANAGE_MESSAGES")) {
          message.reply(`only users with the "MANAGE_MESSAGES" permission can use this sub-command`)
          return;
        }
        if (args[3] == undefined) {
          message.reply("valid usage: $stats <discordAccount> add **<completed,canceled,totalPur,totalSol>** <value:number>");
          return;
        }
        if (args[4] == undefined) {
          message.reply("valid usage: $stats <discordAccount> add <completed,canceled,totalPurchased,totalSold> **<value:number>**");
          return;
        }
        if (parseInt(args[4]) + parseInt(args[4]) - parseInt(args[4]) != parseInt(args[4])) {
          message.reply("valid usage: $stats <discordAccount> add <completed,canceled,totalPurchased,totalSold> **<value:number>**");
          return;
        }
        else {
          if (args[3] == "completed") {
            users[user.id].completed = users[user.id].completed + parseInt(args[4]);
            message.reply("value `" + args[3] + "` was set to `" + users[user.id].completed + "`");
            jf.writeFileSync('./users.json', users)
          }
          else if (args[3] == "canceled") {
            users[user.id].canceled = users[user.id].canceled + parseInt(args[4]);
            message.reply("value `" + args[3] + "` was set to `" + users[user.id].canceled + "`");
            jf.writeFileSync('./users.json', users)
          }
          else if (args[3] == "totalPurchased") {
            users[user.id].totalPur = users[user.id].totalPur + parseInt(args[4]);
            message.reply("value `" + args[3] + "` was set to `" + users[user.id].totalPur + "`");
            jf.writeFileSync('./users.json', users)
          }
          else if (args[3] == "TotalSold") {
            users[user.id].totalSol = users[user.id].totalSol + parseInt(args[4]);
            message.reply("value `" + args[3] + "` was set to `" + users[user.id].totalSol + "`");
            jf.writeFileSync('./users.json', users)
          }
          else {
            message.reply("valid usage: $stats <discordAccount> add **<completed,canceled,totalPurchased,totalSold>** <value:number>");
            return;
          }
        }
      }
      else if (args[2] == "remove") {
        if (!message.member.permissions.any("MANAGE_MESSAGES")) {
          message.reply(`only users with the "MANAGE_MESSAGES" permission can use this sub-command`)
          return;
        }

      }
      else {
        message.reply({
          "channel_id": `${message.channel.id}`,
          "content": ` `,
          "tts": false,
          "embeds": [
            {
              "type": "rich",
              "title": `User statistics`,
              "description": `<@${user.id}>\n\nCompleted: **${users[user.id].completed}**\nCanceled: **${users[user.id].canceled}**\nTotal bought: **${users[user.id].totalPur}**\nTotal sold: **${users[user.id].totalSol}**`,
              "color": 0xff8800,
              "thumbnail": {
                "url": user.displayAvatarURL()
              }
            }
          ]
        })
      }

    }
    if (command == "$pass") {
      var user = message.author;

      if (args.length > 1) {
        var ut = (await message.guild.members.fetch()).find(user => user.user.tag == args[1]);
        var ui = (await message.guild.members.fetch()).find(user => user.id == args[1]);
        if (ut != undefined) {
          user = ut;
        }
        if (ui != undefined) {
          user = ui;
        }
      }
      if (users[user.id] == undefined) {
        users[user.id] = {
          completed: 0,
          canceled: 0,
          totalPur: 0,
          totalSol: 0,
          totalPas: 0
        }
        jf.writeFileSync('./users.json', users)

      }
      if (args[2] == "set") {
        if (!message.member.permissions.any("MANAGE_MESSAGES")) {
          message.reply(`only users with the "MANAGE_MESSAGES" permission can use this sub-command`)
          return;
        }
        if (args[3] == undefined) {
          message.reply('valid usage: $pass <discordAcount> set **<amount:number>**');
          return;
        }
        if (parseInt(args[3]) + parseInt(args[3]) - parseInt(args[3]) != parseInt(args[3])) {
          message.reply('valid usage: $pass <discordAcount> set **<amount:number>**');
          return;
        }
        else {
          users[user.id].totalPas = parseInt(args[3]);
          message.reply('value `passAmount` was set to ' + args[3])
          jf.writeFileSync('./users.json', users);
        }
      }
      else if (args[2] == "add") {
        if (!message.member.permissions.any("MANAGE_MESSAGES")) {
          message.reply(`only users with the "MANAGE_MESSAGES" permission can use this sub-command`)
          return;
        }
        if (args[3] == undefined) {
          message.reply('valid usage: $pass <discordAcount> add **<amount:number>**');
          return;
        }
        if (parseInt(args[3]) + parseInt(args[3]) - parseInt(args[3]) != parseInt(args[3])) {
          message.reply('valid usage: $pass <discordAcount> add **<amount:number>**');
          return;
        }
        else {
          users[user.id].totalPas = users[user.id].totalPas + parseInt(args[3]);
          message.reply('value `passAmount` was set to ' + users[user.id].totalPas)
          jf.writeFileSync('./users.json', users);
        }
      }
      else {
        message.reply({
          "channel_id": `${message.channel.id}`,
          "content": ` `,
          "tts": false,
          "embeds": [
            {
              "type": "rich",
              "title": "",
              "description": `<@${user.id}> Currently has ${users[user.id].totalPas} Middleman Passes`,
              "color": 0xff8800,
            }
          ]
        })
      }

    }
    if (command == "$rawstats") {
      if (!message.member.permissions.any("MANAGE_MESSAGES")) {
        message.reply(`only users with the "MANAGE_MESSAGES" permission can use this command`)
        return;
      }
      var user = message.author;
      if (args.length > 1) {
        var ut = (await message.guild.members.fetch()).find(user => user.user.tag == args[1]);
        var ui = (await message.guild.members.fetch()).find(user => user.id == args[1]);
        if (ut != undefined) {
          user = ut;
        }
        if (ui != undefined) {
          user = ui;
        }
      }
      if (users[user.id] == undefined) {
        users[user.id] = {
          completed: 0,
          canceled: 0,
          totalPur: 0,
          totalSol: 0,
          totalPas: 0
        }
        jf.writeFileSync('./users.json', users)
      }
      message.reply(JSON.stringify(users[user.id]))
    }

  }
})
client.on('channelCreate', async channel => {
  if (channel.name.startsWith("ticket") || channel.name.startsWith("limiteds")) {
    setTimeout(async function run() {
      channel.send({
        "channel_id": `${channel.id}`,
        "content": ` `,
        "tts": false,
        "embeds": [
          {
            "type": "rich",
            "title": `ROBLOX Limiteds Middleman System 3.0`,
            "description": `Welcome to our new & improved Middleman system! \nHere we will handle any deal involving 4 or less Roblox limiteds. \nThe system ensures the security of all our users,\nby taking the item(s) and holding them until the seller has been paid.`,
            "color": 0xff6600,
            "footer": {
              "text": `Version: 3.0 | made and leaked by Low#1337`,
            },
            "thumbnail": {
              "url": `https://cdn.discordapp.com/attachments/994182530137862178/994283418223399014/unknown.png`,
              "height": 0,
              "width": 0
            }
          },
          {
            "type": "rich",
            "title": `Who are you dealing with?`,
            "description": `**The naming system is CaPs SeNsEtIvE**\n\neg: Low#1337\neg: 123456789123456789\n`,
            "color": 0xff6600,

          }

        ]
      })
    }, 1000)
  }
})

function Succesfull(message, uid) {
  message.channel.send({
    "channel_id": `${message.channel.id}`,
    "content": `<@${uid.id}>`,
    "tts": false,
    "components": [
      {
        "type": 1,
        "components": [
          {
            "style": 2,
            "label": `I am seller`,
            "custom_id": `IAMSELLERID`,
            "disabled": false,
            "type": 2
          },
          {
            "style": 2,
            "label": `I am buyer`,
            "custom_id": `IAMBUYERID`,
            "disabled": false,
            "type": 2
          }
        ]
      }
    ],
    "embeds": [
      {
        "type": "rich",
        "title": `User identification`,
        "description": "",
        "color": 0x0080ff,
        "fields": [
          {
            "name": `Seller:`,
            "value": `\`none\``
          },
          {
            "name": `Buyer:`,
            "value": `\`none\``
          }
        ]
      }
    ]
  })
}
function PaymentPromt(message, uid) {
  if (users[uid.id] != undefined && users[uid.id].totalPas > 0) {
    var deletable = message.channel.send({
      "channel_id": `${message.channel.id}`,
      "content": `<@${uid.id}>`,
      "tts": false,
      "embeds": [

        {
          "type": "rich",
          "description": `Proccessing...`,
          "color": 0xff8800
        }
      ]
    })
    setTimeout(async function run() {
      users[uid.id].totalPas--;
      jf.writeFileSync('./users.json', users);
      (await deletable).delete();
      message.channel.send({
        content: " ",
        embeds: [{
          title: "Send Trade to Middleman",
          description: `${message.embeds[0].fields[0].value}` + "you must now provide the limited items to the account specified below",
          color: 14971935,
          "fields": [
            {
              name: "Username",
              value: "enter your roblox username here"
            },
            {
              name: "Trade URL",
              value: "https://www.roblox.com/users/your roblox id here/profile"
            },
            {
              name: "Profile URL",
              value: "https://www.roblox.com/users/your roblox id here/trade"
            }
          ]

        }]
      })
    }, 12000)

  }
  else {
    message.channel.send({
      "channel_id": `${message.channel.id}`,
      "content": `<@${uid.id}>`,
      "tts": false,
      "embeds": [
        {
          "type": "rich",
          "title": `Bitcoin fee payment`,
          "description": `if you do not send the **exact** amount it will not be detected\n\n**Address:** (your bitcoin address)\n\n**Amount:** 0.00021321`,
          "color": 0xff8800
        },
        {
          "type": "rich",
          "description": `Awaiting bitcoin blockchain for fee...`,
          "color": 0xff8800
        }
      ]
    })
  }



}
var token = require('./token.json');
client.login(token.token); //login bot using token

