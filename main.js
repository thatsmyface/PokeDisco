//test with multiple users catching
//embed for show (include catch time, level, id, owner, nickname, pic)

const Discord = require('discord.js');
const client = new Discord.Client();

var fs = require("fs");
var fixedWidthString = require("fixed-width-string");
var dateFormat = require('dateformat');

const pConfig = require("./pokemon_config.json");
const dex = require("./dex.json");

const mons = require("./mons.json");
const trainers = require("./trainers.json");

var currentMon = null;
var spawns = require("./spawns.json");

client.once('ready', () => {
    console.log('Ready!');
    server = client.guilds.keys().next().value;
    setupSpawn();
});

client.on('message', message => {
    if (message.author.bot) return;

    if (message.content.indexOf(pConfig.prefix) === 0) {
        const args = message.content.slice(pConfig.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        //dev commands only
        if (command === "spawn") {
            spawnMon();
        }
        else if (command === "despawn") {
            despawnMon();
        }

        if (command === "catch"){
            attemptCatch(message, currentMon)
        }
        else if (command === "dex"){
            var pageNum = 1;
            
            if(!isNaN(parseInt(args[0]))){
                pageNum = parseInt(args[0]);
            }
            
            var textToSend;

            if (trainers[message.author.id]){
                var speciesFound = [];
                trainers[message.author.id].mons.forEach(function (mon){
                    if (!speciesFound.includes(mons[mon].id)){
                        speciesFound.push(mons[mon].id);
                    }
                });

                var pageCount = Math.ceil((trainers[message.author.id].mons.length/10));

                textToSend = `**Your Pokédex**\n*${speciesFound.length}/${dex.length} species caught (${((speciesFound.length/dex.length)*100).toFixed(2)}%)*\n`;
                
                trainers[message.author.id].mons.forEach(function (mid, index){
                    if (index+1 > 10*pageNum) return;

                    if (index >= 10*(pageNum-1)){
                        mon = mons[mid];

                        var showName;
                        if (!mon.shiny) showName = mon.name;
                        else showName = "Shiny "+mon.name;

                        var description;
                        if (mon.nickname.length > 0) description = "**"+mon.nickname+"** - "+showName+" (Lv. "+mon.level+")";
                        else description = "**"+showName+"** (Lv. "+mon.level+")";
                        textToSend+="\n"+fixedWidthString("`"+mid+"`", 12)+description;
                    }
                });

                textToSend += `\n\nPage ${pageNum}/${pageCount}`;
                if (pageCount > pageNum) textToSend += " - to view the next page type `noc dex "+(pageNum+1)+"`";
            }
            else textToSend = "You have not caught any Pokémon.";

            message.channel.send(textToSend);
        }
        else if (command === "nickname"){
            if (trainers[message.author.id]){
                if (args[0]){
                    var found = false;
                    if (!isNaN(parseInt(args[0]))){
                        trainers[message.author.id].mons.forEach(function (mon, index){
                            if (mon == parseInt(args[0])){
                                found = true;
                                return;
                            }
                        });
                    }
                    
                    if (found){
                        var correctID = parseInt(args[0]);
                        args.shift();
                        const restOf = args.join(" ");
                        if (restOf){
                            mons[correctID].nickname = restOf;
                            updatePoke();
                            message.reply(`${mons[correctID].name}'s new nickname is "${mons[correctID].nickname}"`);
                        }else{
                            message.reply("please include the nickname you'd like to set. For example `"+pConfig.prefix+" nickname "+correctID+" Bobby`");
                        }
                    }else{
                        message.reply("you do not have a Pokémon with the ID `"+args[0]+"`");
                    }
                }
                else message.reply("please include the id of the Pokémon you'd like to nickname. For example `"+pConfig.prefix+" nickname "+trainers[message.author.id].mons[0]+" Bobby`");
            }
            else message.reply("you have not caught any Pokémon.");
        }
        else if (command === "show"){
            if (trainers[message.author.id]){
                const given = args.join(" ");
                if (given){   //either nickname or id or species
                    var found = false;
                    var correctID;

                    if (!isNaN(parseInt(given))){     //check if an id was given
                        trainers[message.author.id].mons.forEach(function (mon, index){
                            if (mon == parseInt(given)){
                                found = true;
                                correctID = parseInt(given);
                                return;
                            }
                        });
                    }
                    
                    if (!found){    //check if a nickname was given
                        trainers[message.author.id].mons.forEach(function (mon, index){
                            monData = mons[mon];
                            if (monData.nickname === given){
                                found = true;
                                correctID = mon;
                                return;
                            }
                        });
                    }

                    if (!found){    //check if a species was given
                        trainers[message.author.id].mons.forEach(function (mon, index){
                            monData = mons[mon];
                            if (monData.name.toLowerCase() === given.toLowerCase()){
                                found = true;
                                correctID = mon;
                                return;
                            }
                        });
                    }

                    if (found){
                        const found = mons[correctID];

                        var preferredName;
                        if (found.nickname.length > 0) preferredName = found.nickname;
                        else {
                           if (!found.shiny) preferredName = found.name;
                           else preferredName = "Shiny "+found.name;
                        }
                        if (!found.shiny) imgUrl = "https://play.pokemonshowdown.com/sprites/xyani/"+found.name.toLowerCase().replace("-","").replace(".","").replace(" ","")+".gif";
                        else imgUrl = "https://play.pokemonshowdown.com/sprites/xyani-shiny/"+found.name.toLowerCase().replace("-","").replace(".","").replace(" ","")+".gif";

                        var desc;
                        if (!found.shiny) desc = `**Level ${found.level}**\n\nA level ${found.level} ${found.name} caught on ${found.catchTime}\n\n\`${correctID}\``;
                        else desc = `**Level ${found.level}**\n\nA **shiny** level ${found.level} ${found.name} caught on ${found.catchTime}\n\n\`${correctID}\``;

                        var color;
                        if (!found.shiny) color = 16312092;
                        else color = 12390624;

                        const embed = {
                            "title": preferredName,
                            "description": desc,
                            "color": color,
                        
                            "thumbnail": {
                              "url": imgUrl
                            }
                        };
                    
                        message.channel.send({ embed });
                    }else{
                        message.reply("you do not have a Pokémon with the ID, nickname, or species `"+args[0]+"`");
                    }
                }
                else message.reply("please include the id, nickname, or species of the Pokémon you'd like to show. For example `"+pConfig.prefix+" show "+trainers[message.author.id].mons[0]+"`");
            }
            else message.reply("you have not caught any Pokémon.");
        }
    }
});

client.login(pConfig.token);

function setupSpawn(){
    const spawnTime = Math.floor(Math.random() * Math.floor(1000*60*(pConfig.maxSpawnTime-pConfig.minSpawnTime))) + 1000*60*pConfig.minSpawnTime;
    console.log("New 'mon will spawn in "+(spawnTime/1000/60).toFixed(2)+" minutes.");
    setTimeout(spawnMon, spawnTime);
}

function spawnMon(){
    if (currentMon){
        despawnMon();
    }

    for (var key in trainers){
        trainers[key].currentBalls = pConfig.numberOfAttempts;
        trainers[key].catching = false;
    }

    currentMon = {};
    currentMon.id = Math.floor(Math.random() * Math.floor(dex.length)) + 1;
    currentMon.name = dex[currentMon.id-1];
    currentMon.level = Math.floor(Math.random() * Math.floor(100)) + 1;
    currentMon.catchChance = (pConfig.catchDifficulty/currentMon.level);
    currentMon.spawnId = Math.floor(Math.random() * Math.floor(9999999-999999)) + 999999;
    while (spawns.includes(currentMon.spawnId)){
        currentMon.spawnId = Math.floor(Math.random() * Math.floor(9999999-999999)) + 999999;
    }
    spawns.push(currentMon.spawnId);
    updatePoke();

    if (Math.random() < pConfig.shinyChance){
        currentMon.shiny = true;
    }

    if (currentMon.catchChance > 1) currentMon.catchChance = 1;

    if (!currentMon.shiny) currentMon.imgUrl = "https://play.pokemonshowdown.com/sprites/xyani/"+currentMon.name.toLowerCase().replace("-","").replace(".","").replace(" ","")+".gif";
    else currentMon.imgUrl = "https://play.pokemonshowdown.com/sprites/xyani-shiny/"+currentMon.name.toLowerCase().replace("-","").replace(".","").replace(" ","")+".gif";
    
    console.log(currentMon.name+" (Lv "+currentMon.level+") spawned.");

    var desc;
    if (!currentMon.shiny) desc = `A wild ${currentMon.name} has appeared!`;
    else desc = `A **shiny** wild ${currentMon.name} has appeared!`;

    var color;
    if (!currentMon.shiny) color = 16312092;
    else color = 12390624;

    var showName;
    if (!currentMon.shiny) showName = currentMon.name;
    else showName = "Shiny "+currentMon.name;

    const embed = {
        "title": `${showName} (Lv. ${currentMon.level})`,
        "description": desc,
        "color": color,
    
        "thumbnail": {
          "url": currentMon.imgUrl
        }
    };

    client.channels.get(pConfig.spawnChannel).send({ embed });
    client.channels.get(pConfig.spawnChannel).send(`Type \`${pConfig.prefix} catch\` to attempt to catch it!\n*(Catch Chance: ${(currentMon.catchChance*100).toFixed(2)}%)*`);

    const runTime = Math.floor(Math.random() * Math.floor(1000*60*(pConfig.maxRunTime-pConfig.minRunTime))) + 1000*60*pConfig.minRunTime;
    console.log("'mon will run in "+(runTime/1000/60).toFixed(2)+" minutes.");
    setTimeout(despawnMon, runTime);
}

function despawnMon(){
    if (currentMon){
        client.channels.get(pConfig.spawnChannel).send(`The wild ${currentMon.name} ran away!`);
        console.log(currentMon.name+" despawned.");
        currentMon = null;

        setupSpawn();
    }
}

function attemptCatch(message, mon){
    if (message.channel.id === pConfig.spawnChannel || !pConfig.requireCatchingInSpawnChannel){
        if (mon){
            if (!trainers[message.author.id]) {
                var obj = {
                  name: message.author.username,
                  mons: [],
                  currentBalls: pConfig.numberOfAttempts,
                  spawnIds: [],
                  catching: false
                };
                trainers[message.author.id] = obj;
            }
            if (!trainers[message.author.id].spawnIds.includes(mon.spawnId)){
                if (trainers[message.author.id].currentBalls > 0){
                    if (pConfig.animatedCatch){
                        //i fear no man... but that thing... it scares me.
                        if (!trainers[message.author.id].catching){
                            message.channel.send(".").then(function(sent) {
                                setTimeout(function() {
                                    updateAnimation(sent.id, pConfig.animationAmountShakes-1, message, mon);
                                }, pConfig.animationShakeTime);
                            });
                            trainers[message.author.id].catching = true;
                        }
                    }else{
                        testCatch(mon, message);
                    }
                }else{
                    message.reply(`you don't have any Pokéballs left. Try again next time!`);
                }
            }else{
                message.reply("you've already caught this Pokémon!")
            }
        }else message.reply("there is no Pokémon to catch right now.")
    }else message.reply("you can only catch Pokémon in the channel they spawn in.")
}

function updateAnimation(sentId, shakesLeft, message, mon){
    if (shakesLeft > 0){
        var msgString = ".";
        for (var i=0; i<(pConfig.animationAmountShakes-shakesLeft); i++){
            msgString+="  .";
        }
        message.channel.fetchMessage(sentId).then(function(got) {
            got.edit(msgString);
        });
        shakesLeft--;
        setTimeout(function() {
            updateAnimation(sentId, shakesLeft, message, mon);
        }, pConfig.animationShakeTime);
    }else{
        message.channel.fetchMessage(sentId).then(function(got) {
            got.delete();
        });
        testCatch(mon, message);
        trainers[message.author.id].catching = false;
    }
}

function testCatch(mon, message){
    const randGen = Math.random();
    if (randGen < mon.catchChance){
        
        console.log(`${message.author.username} caught ${mon.name}`);

        var mid = Math.floor(Math.random() * Math.floor(9999999-999999)) + 999999;
        while (mons[mid]){
            mid = Math.floor(Math.random() * Math.floor(9999999-999999)) + 999999;
        }

        message.reply(`congratulations! You caught ${mon.name}!\nIf you'd like to give it a nickname type \`${pConfig.prefix} nickname ${mid} [nickname]\``);

        gennedMon = mon;
        delete gennedMon["imgUrl"];
        gennedMon.owner = message.author.id;
        gennedMon.catchTime = dateFormat("mm/dd/yyyy h:MM TT");
        gennedMon.nickname = "";

        mons[mid] = gennedMon;

        trainers[message.author.id].mons.unshift(mid);
        trainers[message.author.id].spawnIds.push(mon.spawnId);
        trainers[message.author.id].currentBalls = pConfig.numberOfAttempts;
    }
    else{
        trainers[message.author.id].currentBalls--;
        message.reply('your Pokéball missed. You have '+trainers[message.author.id].currentBalls+' left.');
    }
    updatePoke();
}

function updatePoke() {
    fs.writeFile("mons.json", JSON.stringify(mons), function (err) {
        if (err) throw err;
    });
    fs.writeFile("trainers.json", JSON.stringify(trainers), function (err) {
        if (err) throw err;
    });
    fs.writeFile("spawns.json", JSON.stringify(spawns), function (err) {
        if (err) throw err;
    });
}