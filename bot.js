const { Client, MessageEmbed } = require('discord.js');
const fs = require("fs");
const client = new Client();
const database = JSON.parse(fs.readFileSync("./database.json", "utf8"));
const reactions = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🇦','🇧','🇨','🇩','🇪','🇫','🇬',
'🇭','🇮','🇯','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿'];


function sendMessage(message, tempEntry, showImage)
{
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

    var color = '#1a5fb4';
    if (database[tempEntry]['attribute']==='Fuerza')
        color = '#e01b24';
    else if (database[tempEntry]['attribute']==='PS')
        color = '#04ad13';

    
    if (realname.length > 0) {

        const embed = new MessageEmbed()
        .setColor(color)
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

        console.log("MENSAJE :"+message.content);

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
        var val = 1;
        var reacts = [];

        Object.entries(database).forEach(([key, value]) => {

            if (value['fullname'].toLowerCase().includes(nombre) || 
                key.includes(nombre))
            {
                found.push( reactions[val] + ' !' + key + ' - ' + value['fullname']);
                reacts[reactions[val]] = key;
                ++val;
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
            var text = 'Se encontraron ' + found.length + ' personajes para "' + nombre + '"\n';
            found.forEach( function(valor, found) {
                text += valor + '\n';
            });
            text += '\n';
            //text += '```';
            message.channel.send(text)
            .then(sentEmbed => {
                /* for (var key in reacts) {
                    sentEmbed.react(key)
                }; */

                const filter = (user) => {
                    return user.id === '313015439188033538';
                };
                
                sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id , { max: 1, time: 60000 })
                    .then(collected => {
                        const reaction = collected.first();
                
                        console.log("REACTION : " + reacts[reaction.emoji.name]);
                        sendMessage(sentEmbed, reacts[reaction.emoji.name], showImage);
    
                    })
                    .catch(collected => {
                        console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
                });
            });
            
            


        }

        else if (found.length===1 || foundwithnum.length===1 || exact!='') {
            if (exact!='') tempEntry = exact;
            
            sendMessage(message, tempEntry, showImage);

        }


    }


});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
