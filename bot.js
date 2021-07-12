const { Client, MessageEmbed } = require('discord.js');
const fs = require("fs");
const client = new Client();
const images = JSON.parse(fs.readFileSync("./7ds.json", "utf8"));

var interval;
var spamid = [];
var infoid = [];
var aliveid = [];
var curr = 0;
var testchannel = "445716496526606336";
var count = 0;
var acurr = 0;
var demons = ['melascula', 'drole', 'zeldris', 'galland', 'gloxinia', 'estarossa', 'monspeet', 'derieri']

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setUsername("Test bot");
    //timer = setTimeout(step, interval);
});

client.on('message', message => {

    if (message.content === "$ping") {
        message.reply('pong');
    }

    if (message.content.indexOf('!') === 0 && message.content.length > 3
       && message.author.id !== '313015439188033538') {

        name = message.content.slice(1);

        var showImage = false;
        if (name.startsWith("!")) {
            showImage = true;
            name = name.slice(1);
        }


        var tempEntry = '';
        var found = [];

        Object.entries(images).forEach(([key, value]) => {

            if (value['name'].toLowerCase().includes(name) || key.startsWith(name) ) {
                found.push( '!' + key + ' - [' + value['title'] + '] ' + value['name']);
                tempEntry = key;
            }

        });

        console.log('found: ' + found.length);
        console.log('tempEntry: ' + tempEntry);

        if (found.length > 1) {
            var text = 'Found ' + found.length + ' characters for "' + name + '"\n```';
            found.forEach( function(valor, found) {
                text += valor + '\n';
            });
            text += '```';
            message.channel.send(text);
        }

        else if (found.length===1) {

            title = images[tempEntry]['title'];
            realname = images[tempEntry]['name'];
            color = images[tempEntry]['color'];
            number = images[tempEntry]['number'];
            gears = images[tempEntry]['gears'];
            substats = images[tempEntry]['substats'];
            picture = 'https://rerollcdn.com/SDSGC/portraits/portrait_' + number + '.png';
            pasives = images[tempEntry]['pasives'].split('||')[0];
            extraText = '';
            extra = '';

            if (demons.indexOf(realname.toLowerCase())>-1) {
                extraText = 'Commandment';
                extra = images[tempEntry]['pasives'].split('||')[1];
            }

            if (realname.length > 0) {

                const embed = new MessageEmbed()
                .setThumbnail(picture)
                .setTitle(realname)
                .setDescription(title + "\n")
                .addField("Recommended gears", gears + "\n")
                .addField("Recommended substats", substats + "\n")
                .addField("Pasive", pasives + "\n");

                if (extraText!=='') {
                    embed.addField(extraText, extra)
                }

                if (showImage) {
                    embed.setImage('https://raw.githubusercontent.com/CepiPerez/spammy/master/characters/' + number + '.png')
                }

                console.log('Images:');
                console.log('https://rerollcdn.com/SDSGC/portraits/portrait_' + number + '.png');
                console.log('https://raw.githubusercontent.com/CepiPerez/spammy/master/characters/' + number + '.png')

                embed.setFooter("© cepi");

                message.channel.send(embed);


            }

        }


    }


});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);