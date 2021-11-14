const { Client, MessageEmbed } = require('discord.js');
const fs = require("fs");
const client = new Client();
const images = JSON.parse(fs.readFileSync("./database.json", "utf8"));

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setUsername("Hawk");
    //timer = setTimeout(step, interval);
});

client.on('message', message => {

    if (message.content === "$ping") {
        message.reply('pong');
    }

    if (message.content.indexOf('!') === 0 && message.content.length > 3
       && message.author.id !== '313015439188033538') {

        nombre = message.content.slice(1);

        var showImage = false;
        if (nombre.startsWith("!")) {
            showImage = true;
            nombre = nombre.slice(1);
        }


        var tempEntry = '';
        var found = [];
        var exact = '';

        Object.entries(images).forEach(([key, value]) => {

            if (value['name'].toLowerCase().includes(nombre) || key.startsWith(nombre) ) {
                found.push( '!' + key + ' - [' + value['fullname'] + '] ' + value['name']);
                tempEntry = key;
            }
            if (key.toLowerCase()===nombre.toLowerCase()){
                exact = key;
            }

        });

        console.log('found: ' + found.length);
        console.log('tempEntry: ' + tempEntry);
        console.log('exactMatch: ' + exact);

        if (found.length > 1 && exact==='') {
            var text = 'Se encontraron ' + found.length + ' personajes para "' + nombre + '"\n```';
            found.forEach( function(valor, found) {
                text += valor + '\n';
            });
            text += '```';
            message.channel.send(text);
        }

        else if (found.length===1 || exact!='') {
            if (exact!='') tempEntry = exact;
            title = images[tempEntry]['fullname'];
            realname = images[tempEntry]['name'];
            color = images[tempEntry]['attribute'];
            number = images[tempEntry]['number'];
            gears = images[tempEntry]['stats'];
            substats = images[tempEntry]['substats'];
            picture = 'https://raw.githubusercontent.com/CepiPerez/discord-7ds-bot/master/icons/' + number + '.png';
            pasives = images[tempEntry]['passive']
            grace = images[tempEntry]['grace']
            commandment = images[tempEntry]['commandment']
            reliq = images[tempEntry]['reliq']

            
            if (realname.length > 0) {

                const embed = new MessageEmbed()
                .setThumbnail(picture)
                .setTitle(realname)
                .setDescription(title + "\n")
                .addField("Stats recomendados", gears + "\n")
                .addField("Substats recomendados", substats + "\n")
                .addField("Pasiva", pasives + "\n");

                if (grace!=='')
                    embed.addField('Gracia', grace)

                if (commandment!=='')
                    embed.addField('Mandamiento', commandment)

                if (reliq!=='')
                    embed.addField('Reliquia Sagrada', reliq)


                if (showImage) {
                    console.log("ADDING IMAGE: " + "https://raw.githubusercontent.com/CepiPerez/discord-7ds-bot/master/images/" + number + ".png")
                    embed.setImage('https://raw.githubusercontent.com/CepiPerez/discord-7ds-bot/master/images/' + number + '.png')
                }

                //console.log('Images:');
                //console.log('https://rerollcdn.com/SDSGC/portraits/portrait_' + number + '.png');
                //console.log('https://raw.githubusercontent.com/CepiPerez/spammy/master/characters/' + number + '.png')

                embed.setFooter("© cepi");

                message.channel.send(embed);


            }

        }


    }


});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
