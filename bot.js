const { Client, MessageEmbed } = require('discord.js');
const fs = require("fs");
const client = new Client();
const database = JSON.parse(fs.readFileSync("./database.json", "utf8"));

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

        nombre = message.content.slice(1).toLocaleLowerCase();

        var showImage = false;
        if (nombre.startsWith("!")) {
            showImage = true;
            nombre = nombre.slice(1);
        }


        var numeral = nombre.substr(nombre.length - 1);
        if (isNaN(numeral)) {
            numeral = '';
        } else {
            nombre = nombre.slice(0, - 1);
        }

        console.log('nombre: ' + nombre);
        console.log('numeral: ' + numeral);


        var tempEntry = '';
        var found = [];
        var foundwithnum = [];
        var exact = '';

        Object.entries(database).forEach(([key, value]) => {

            if (value['fullname'].toLowerCase().includes(nombre) || 
                key.includes(nombre))
            {
                found.push( '!' + key + ' - ' + value['fullname']);
                tempEntry = key;
            }
            if (key.includes(nombre) && key.endsWith(numeral))
            {
                foundwithnum.push( '!' + key + ' - ' + value['fullname']);
                tempEntry = key;
            }
            if (key.toLowerCase()===(nombre.toLowerCase()+numeral)){
                exact = key;
            }
        });

        console.log('found: ' + found.length);
        console.log('foundwithnum: ' + foundwithnum.length);
        console.log('tempEntry: ' + tempEntry);
        console.log('exactMatch: ' + exact);

        if (found.length>1 && exact==='' && foundwithnum.length!=1) {
            var text = 'Se encontraron ' + found.length + ' personajes para "' + nombre + '"\n```';
            found.forEach( function(valor, found) {
                text += valor + '\n';
            });
            text += '```';
            message.channel.send(text);
        }

        else if (found.length===1 || foundwithnum.length===1 || exact!='') {
            if (exact!='') tempEntry = exact;
            console.log("Processing " + tempEntry);
            title = database[tempEntry]['fullname'].split('] ')[1];
            realname = database[tempEntry]['fullname'].split('] ')[0] + ']';
            color = database[tempEntry]['attribute'];
            number = database[tempEntry]['number'];
            gears = database[tempEntry]['stats'];
            substats = database[tempEntry]['substats'];
            picture = 'https://raw.githubusercontent.com/CepiPerez/discord-7ds-bot/master/icons/' + number + '.png';
            pasives = database[tempEntry]['passive']
            grace = database[tempEntry]['grace']
            commandment = database[tempEntry]['commandment']
            reliq = database[tempEntry]['reliq']

            
            if (realname.length > 0) {

                const embed = new MessageEmbed()
                .setThumbnail(picture)
                .setTitle(realname + "\n" + title)
                .setDescription(" \n")
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

                //console.log('database:');
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
