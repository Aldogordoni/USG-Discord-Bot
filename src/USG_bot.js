import { Client } from 'eris';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const PREFIX = "usg!";
const PLAYER_PREFIX = "usg!player#";
const CLAN_MEMBER_LIST_PREFIX = "usg!ClanMemberList#";
const CURRENT_WAR_PREFIX = "usg!CurrentWar";

const playerURL = "https://api.clashofclans.com/v1/players/%23";
const clanURL = "https://api.clashofclans.com/v1/clans/%232YQ998GLV"; // API URL
const token = ""; // API Token
const method = "GET"; // Request method, change for what's needed
// at the top of your file
//const { MessageEmbed } = require('discord.js');

// Create a Client instance with our bot token.
const bot = new Client('');

  

// When the bot is connected and ready, log to console.
bot.on('ready', () => {
   console.log('Connected and ready.');
});

async function getClanLogo(clanLink){
    const resp = await fetch(clanLink.toString(), {
                    method,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
    
    const data = await resp.json();
    const finalVal = data.badgeUrls["medium"];
    const clanNameVal = data.name;
    const arrayVal = [finalVal, clanNameVal];
    return arrayVal;
}

async function getplayerName(playerLink){
    const resp = await fetch(playerLink.toString(), {
                    method,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
    
    const data = await resp.json();
    const finalVal = data.name;
    return finalVal;
}

function repeatStringNumTimes(str, num) {
    if (num > 0) {
        return str.repeat(num);
      }
      else {
        return "Fail";
    }
}

//const globalClanLogo = await getClanLogo();

const commandHandlerForCommandName = {};

//different functions for different commands
commandHandlerForCommandName['hi'] = (msg, args) => {
    return msg.channel.createMessage('Helo');
};

commandHandlerForCommandName['joe'] = (msg, args) => {
    return msg.channel.createMessage('Joe Biden');
};


commandHandlerForCommandName['USGinfo'] = async (msg, args) => {
    return fetch(clanURL, {
        method,
        headers: {
            "Authorization": `Bearer ${token}` // This is the important part, the auth header
        }
    }).then(res => res.json()
    .then(data => msg.channel.createMessage(JSON.stringify(data.name))))
    .catch(console.error); // Do better handling here
}

//ListOfMembers Only in USG Clan
commandHandlerForCommandName['MemberList'] = async (msg, args) => {
    const arrayOfClanInfo = await getClanLogo("https://api.clashofclans.com/v1/clans/%232YQ998GLV");
    const apiClanLogo = arrayOfClanInfo[0].toString();

    fetch('https://api.clashofclans.com/v1/clans/%232YQ998GLV/members', {
        method,
        headers: {
            "Authorization": `Bearer ${token}` // This is the important part, the auth header
        },
    }).then(res => {
        return res.json();
    })
    .then(data => {
        var strList = "";
        var rankList = "";
        var trophiesList = "";
        var coleaderTot = 0;
        var elderTot = 0;
        var memberTot = 0;
        
        for(let i = 0; i<data.items.length;i++){
            strList += data.items[i]["name"]+"\n";
            
            trophiesList += data.items[i]["trophies"]+"\n";
            var role = JSON.stringify(data.items[i]["role"]).toUpperCase().replaceAll('"', '');
            switch(role){
                case "COLEADER":
                    rankList += (i+1).toString()+" CO-LEADER"+"\n";
                    coleaderTot++;
                    break;
                case "LEADER":
                    rankList += (i+1).toString()+" LEADER"+"\n";
                    break;
                case "ADMIN":
                    rankList += (i+1).toString()+" ELDER"+"\n";
                    elderTot++;
                    break;
                case "MEMBER":
                    rankList += (i+1).toString()+" MEMBER"+"\n";
                    memberTot++;
                    break;
            }
        }
        const exampleEmbed = new MessageEmbed()
        .setColor('#7a054d')
        .setTitle('Clan Member List')
        .setAuthor({ name: 'USG bot', iconURL: apiClanLogo, url: 'https://www.clashofstats.com/clans/usg-2YQ998GLV/summary' })
        .setDescription('List of all USG Members, sorted by trophies count')
        .setThumbnail(apiClanLogo)
        .addFields(
            { name: 'Rank & Role', value: rankList, inline: true },
            { name: 'Members', value: strList, inline: true },
            { name: 'Trophies', value: trophiesList, inline: true },
            { name: 'CO-LEADERS', value: coleaderTot.toString(), inline: true },
            { name: 'ELDERS', value: elderTot.toString(), inline: true },
            { name: 'MEMBERS', value: memberTot.toString(), inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'USG bot'});
        msg.channel.createMessage({ embeds: [exampleEmbed] });
        })
    .catch((error) => {
        console.error('Error:', error);
    });         
    
}


// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".
bot.on('messageCreate', async (msg) => {
    const content = msg.content;
    const botWasMentioned = msg.mentions.find(
        mentionedUser => mentionedUser.id === bot.user.id,
    );

    if (botWasMentioned) {
        try {
            await msg.channel.createMessage('Ayo wassuppppp');
        } catch (err) {
            console.warn('Failed to respond to mention.');
            console.warn(err);
        }
    }
    // Ignore any messages sent as direct messages.
    // The bot will only accept commands issued in
    // a guild.
    if (!msg.channel.guild || !content.startsWith(PREFIX)) {
        return;
    }

    //gets information from API about a player
    if(content.startsWith(PLAYER_PREFIX)){
        const arrayOfClanInfo = await getClanLogo("https://api.clashofclans.com/v1/clans/%232YQ998GLV");
        const apiClanLogo = arrayOfClanInfo[0].toString();
        const parts = content.split(' ').map(s => s.trim()).filter(s => s);
        const playerTag = parts[0].substr(PLAYER_PREFIX.length);
        
        fetch(playerURL+playerTag, {
            method,
            headers: {
                "Authorization": `Bearer ${token}` // This is the important part, the auth header
            },
        }).then(res => {
            return res.json();
        })
        .then(data => {
            var informationOfPlayer = 'Member of USG Clan';
            var clanTag = JSON.stringify(data.clan["tag"]).toString().replaceAll('"', '');
            var leagueImage = data.league["iconUrls"]["medium"];
            const thLevel = JSON.stringify(data.townHallLevel).toString();
            const xpLevel = JSON.stringify(data.expLevel).toString();
            const trophies = JSON.stringify(data.trophies).toString();
            const warStars = JSON.stringify(data.warStars).toString();
            const donations = JSON.stringify(data.donations).toString();
            const donationsReceived = JSON.stringify(data.donationsReceived).toString();
            var warPreference = JSON.stringify(data.warPreference).toString().replaceAll('"', '');
            var role = JSON.stringify(data.role).toUpperCase().replaceAll('"', '');
            var color = '0x00ff00';

            if(clanTag != "#2YQ998GLV"){
                role = "NOT_MEMBER";
            }
            switch(role){
                case "COLEADER":
                    role = "CO-LEADER";
                    color = '#a8081b';
                    break;
                case "LEADER":
                    color = '#d9af09';
                    break;
                case "ADMIN":
                    role = "ELDER";
                    color = '#0997d9';
                    break;
                case "MEMBER":
                    color = '0x00ff00';
                    break;
                case "NOT_MEMBER":
                    informationOfPlayer = 'Not a member of USG Clan';
                    role = "NOT MEMBER";
                    color = '#ffffff';
                    break;
            }

            const exampleEmbed = new MessageEmbed()
            .setColor(color)
            .setTitle('Player Info')
            .setAuthor({ name: 'USG bot', iconURL: apiClanLogo, url: 'https://www.clashofstats.com/clans/usg-2YQ998GLV/summary' })
            .setDescription(informationOfPlayer)
            .setThumbnail(leagueImage)
            .addFields(
                { name: 'Name', value: JSON.stringify(data.name).replaceAll('"', ''), inline: true },
                { name: 'Player Tag', value: JSON.stringify(data.tag).replaceAll('"', ''), inline: true },
                { name: 'Town Hall Level', value: thLevel, inline: true },
                { name: 'XP level', value: xpLevel, inline: true },
                { name: 'Trophies', value: trophies, inline: true },
                { name: 'War Stars', value: warStars, inline: true },
                { name: 'War Preference', value: warPreference, inline: true },
                { name: 'Donations', value: donations, inline: true },
                { name: 'Donations Received', value: donationsReceived, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'USG bot'});

            msg.channel.createMessage({ embeds: [exampleEmbed] });
            })
        .catch((error) => {
          console.error('Error:', error);
        }); 
        
        
        //LIST OF MEMBERS OF ANY CLAN       
    } else if (content.startsWith(CLAN_MEMBER_LIST_PREFIX)){

        const parts = content.split(' ').map(s => s.trim()).filter(s => s);
        const clanRequestTag = parts[0].substr(CLAN_MEMBER_LIST_PREFIX.length);
        const arrayOfClanInfo = await getClanLogo('https://api.clashofclans.com/v1/clans/%23'+clanRequestTag);
        const apiClanLogo = arrayOfClanInfo[0].toString();
        const apiClanName = arrayOfClanInfo[1].toString();
        fetch('https://api.clashofclans.com/v1/clans/%23'+clanRequestTag+'/members', {
        method,
        headers: {
            "Authorization": `Bearer ${token}` // This is the important part, the auth header
        },
    }).then(res => {
        return res.json();
    })
    .then(data => {
        var strList = "";
        var rankList = "";
        var trophiesList = "";
        var coleaderTot = 0;
        var elderTot = 0;
        var memberTot = 0;
        
        for(let i = 0; i<data.items.length;i++){
            strList += data.items[i]["name"]+"\n";
            
            trophiesList += data.items[i]["trophies"]+"\n";
            var role = JSON.stringify(data.items[i]["role"]).toUpperCase().replaceAll('"', '');
            switch(role){
                case "COLEADER":
                    rankList += (i+1).toString()+" CO-LEADER"+"\n";
                    coleaderTot++;
                    break;
                case "LEADER":
                    rankList += (i+1).toString()+" LEADER"+"\n";
                    break;
                case "ADMIN":
                    rankList += (i+1).toString()+" ELDER"+"\n";
                    elderTot++;
                    break;
                case "MEMBER":
                    rankList += (i+1).toString()+" MEMBER"+"\n";
                    memberTot++;
                    break;
            }
        }
        const exampleEmbed = new MessageEmbed()
        .setColor('#7a054d')
        .setTitle('Clan Member List')
        .setAuthor({ name: 'USG bot', iconURL: apiClanLogo, url: 'https://www.clashofstats.com/clans/usg-2YQ998GLV/summary' })
        .setDescription('List of members in "'+apiClanName+'" Clan')
        .setThumbnail(apiClanLogo)
        .addFields(
            { name: 'Rank & Role', value: rankList, inline: true },
            { name: 'Members', value: strList, inline: true },
            { name: 'Trophies', value: trophiesList, inline: true },
            { name: 'CO-LEADERS', value: coleaderTot.toString(), inline: true },
            { name: 'ELDERS', value: elderTot.toString(), inline: true },
            { name: 'MEMBERS', value: memberTot.toString(), inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'USG bot'});

        msg.channel.createMessage({ embeds: [exampleEmbed] });
        })
    .catch((error) => {
        console.error('Error:', error);
    });      

    //CURRENT WAR INFORMATION
    } else if (content.startsWith(CURRENT_WAR_PREFIX)){
        const arrayOfClanInfo = await getClanLogo("https://api.clashofclans.com/v1/clans/%232YQ998GLV");
        const apiClanLogo = arrayOfClanInfo[0].toString();
        const parts = content.split(' ').map(s => s.trim()).filter(s => s);
        var clanAPItag = parts[0].substr(CURRENT_WAR_PREFIX.length);
        if(clanAPItag === ''){
            clanAPItag = "2YQ998GLV";
        } else {
            clanAPItag = clanAPItag.replaceAll('#','');
        }

    fetch('https://api.clashofclans.com/v1/clans/%23'+clanAPItag+'/currentwar', {
        method,
        headers: {
            "Authorization": `Bearer ${token}` // This is the important part, the auth header
        },
    }).then(res => {
        return res.json();
    })
    .then(data => {
        var warState = data.state;
        console.log(warState);
        if (warState == "notInWar"){
            msg.channel.createMessage('Clan #'+clanAPItag+' is not currently in war');
        } else if(warState == ""){
            //msg.channel.createMessage('Clan #'+clanAPItag+' does not have a public war log');
        } else if (warState == "inWar"){
            var teamSize = JSON.stringify(data.teamSize).toString();
        var teamArray = new Array(data.teamSize);
        var oppArray = new Array(data.teamSize);
        var memberListStr = "";
        let opponentListStr = "";
        let attacksList = "";
        let oppAttacksList = "";
        let teamTargetsList = "";
        let oppTargetsList = "";
        let nameofTargetList = "";
        let oppNameOfTargetList = "";

        //function to sort information in 2d array
        function sortFunction(a, b) {
            if (a[0] === b[0]) {
                return 0;
            }
            else {
                return (a[0] < b[0]) ? -1 : 1;
            }
        }

        for(let i = 0; i<data.teamSize; i++){
            let spacing = "᲼";
            teamArray[i] = new Array(5);
            teamArray[i][0] = data.clan["members"][i]["mapPosition"];
            teamArray[i][1] = spacing + data.clan["members"][i]["name"];
            teamArray[i][2] = data.clan["members"][i]["attacks"];
            teamArray[i][3] = (data.clan["members"][i]["townhallLevel"]).toString();
            teamArray[i][4] = data.clan["members"][i]["tag"];
            //console.log(teamArray[i][2]);

            oppArray[i] = new Array(5);
            oppArray[i][0] = data.opponent["members"][i]["mapPosition"];
            oppArray[i][1] = spacing + data.opponent["members"][i]["name"];
            oppArray[i][2] = data.opponent["members"][i]["attacks"];
            oppArray[i][3] = (data.opponent["members"][i]["townhallLevel"]).toString();
            oppArray[i][4] = data.opponent["members"][i]["tag"];
        }
        
        //calling function to sort 2d array
        teamArray.sort(sortFunction);
        oppArray.sort(sortFunction);

        //popoulating strings to be used in the embedded message
        for(let i = 0; i<data.teamSize; i++){
            let spacing = "᲼";
            let attacksLeft = 0;
            let playerName = "";
            let player2Name = "";
            
            if(teamArray[i][2] == null){
                attacksLeft = 0;
                teamTargetsList += "\n\n\n";
                nameofTargetList += "\n\n\n";
                attacksList += attacksLeft.toString()+"/2 : \n\n\n";
            } else if (teamArray[i][2].length == 1){
                let playerFound = false;
                let x = 0;
                let target = "";
                
                while(playerFound == false){
                    if (teamArray[i][2][0]["defenderTag"] == oppArray[x][4]){
                        target = (x+1).toString();
                        playerFound = true;
                    }
                    x++;
                }
                let attackStars = repeatStringNumTimes("\u2B50",teamArray[i][2][0]["stars"]);
                let attackDes = Math.round(((teamArray[i][2][0]["destructionPercentage"] + Number.EPSILON) * 100) / 100);
                attacksLeft = teamArray[i][2].length;
                attacksList += attacksLeft.toString()+"/2 : "+ attackStars+" \n\n\n";
                nameofTargetList += target +" ("+attackDes.toString()+"%)\n\n\n";

            } else if (teamArray[i][2].length == 2){
                let playersFound = false;
                let player1Found = false;
                let player2Found = false;
                let x = 0;
                let firstTarget = "";
                let secondTarget = "";

                //using while loop in case the target is found before the end of the team size
                //thus, saving processing time
                while(playersFound == false){
                    if (teamArray[i][2][0]["defenderTag"] == oppArray[x][4]){
                        firstTarget = (x+1).toString();
                        player1Found = true;
                    }
                    if (teamArray[i][2][1]["defenderTag"] == oppArray[x][4]){
                        secondTarget = (x+1).toString();
                        player2Found = true;
                    }
                    if(player1Found && player2Found){
                        playersFound = true;
                    }
                    x++;
                }
                let firstAttackDes = Math.round(((teamArray[i][2][0]["destructionPercentage"] + Number.EPSILON) * 100) / 100);
                let secondAttackDes = Math.round(((teamArray[i][2][1]["destructionPercentage"] + Number.EPSILON) * 100) / 100);
                let firstAttackStars = repeatStringNumTimes("\u2B50",teamArray[i][2][0]["stars"]);
                let secondAttackStars = repeatStringNumTimes("\u2B50",teamArray[i][2][1]["stars"]);
                attacksLeft = teamArray[i][2].length;
                attacksList += attacksLeft.toString()+"/2 :" + firstAttackStars +"\n᲼᲼᲼᲼" + secondAttackStars + "\n\n";
                nameofTargetList += firstTarget +" ("+ firstAttackDes.toString() + "%)\n" + secondTarget  +" ("+ secondAttackDes.toString() + "%)\n\n";
            }
            memberListStr += (i+1).toString()+" -"+teamArray[i][1]+ "\n\n\n";
        }

        //loop to populate opponent side, same functions as clan loop
        for(let i = 0; i<data.teamSize; i++){
            let spacing = "᲼";
            let attacksLeft = 0;
            let playerName = "";
            let player2Name = "";
            
            if(oppArray[i][2] == null){
                attacksLeft = 0;
                teamTargetsList += "\n\n\n";
                nameofTargetList += "\n\n\n";
                oppAttacksList += attacksLeft.toString()+"/2 : \n\n\n";
            } else if (oppArray[i][2].length == 1){
                let playerFound = false;
                let x = 0;
                let target = "";
                
                while(playerFound == false){
                    if (oppArray[i][2][0]["defenderTag"] == teamArray[x][4]){
                        target = (x+1).toString();
                        playerFound = true;
                    }
                    x++;
                }
                let attackStars = repeatStringNumTimes("\u2B50",oppArray[i][2][0]["stars"]);
                let attackDes = Math.round(((oppArray[i][2][0]["destructionPercentage"] + Number.EPSILON) * 100) / 100);
                attacksLeft = oppArray[i][2].length;
                oppAttacksList += attacksLeft.toString()+"/2 : "+ attackStars+" \n\n\n";
                oppNameOfTargetList += target +" ("+attackDes.toString()+"%)\n\n\n";

            } else if (oppArray[i][2].length == 2){
                let playersFound = false;
                let player1Found = false;
                let player2Found = false;
                let x = 0;
                let firstTarget = "";
                let secondTarget = "";
                
                //using while loop in case the target is found before the end of the team size
                //thus, saving processing time
                while(playersFound == false){
                    if (oppArray[i][2][0]["defenderTag"] == teamArray[x][4]){
                        firstTarget = (x+1).toString();
                        player1Found = true;
                    }
                    if (oppArray[i][2][1]["defenderTag"] == teamArray[x][4]){
                        secondTarget = (x+1).toString();
                        player2Found = true;
                    }
                    if(player1Found && player2Found){
                        playersFound = true;
                    }
                    x++;
                }
                let firstAttackDes = Math.round(((oppArray[i][2][0]["destructionPercentage"] + Number.EPSILON) * 100) / 100);
                let secondAttackDes = Math.round(((oppArray[i][2][1]["destructionPercentage"] + Number.EPSILON) * 100) / 100);
                let firstAttackStars = repeatStringNumTimes("\u2B50",oppArray[i][2][0]["stars"]);
                let secondAttackStars = repeatStringNumTimes("\u2B50",oppArray[i][2][1]["stars"]);
                attacksLeft = oppArray[i][2].length;
                oppAttacksList += attacksLeft.toString()+"/2 :" + firstAttackStars +"\n᲼᲼᲼᲼" + secondAttackStars + "\n\n";
                oppNameOfTargetList += firstTarget +" ("+ firstAttackDes.toString() + "%)\n" + secondTarget  +" ("+ secondAttackDes.toString() + "%)\n\n";
            }
            opponentListStr += (i+1).toString()+" -"+oppArray[i][1]+ "\n\n\n";
        }

        var clanNameAndTag = data.clan["name"] + "("+data.clan["tag"]+")";
        var attacksUsed = JSON.stringify(data.clan["attacks"]).toString()+"/"+(data.teamSize*2).toString();
        var totStars = JSON.stringify(data.clan["stars"]).toString()+"/"+(data.teamSize*3).toString();
        var destructionPercentage = JSON.stringify(Math.round((data.clan["destructionPercentage"] + Number.EPSILON) * 100) / 100).toString()+"%";

        var opponentClanName = JSON.stringify(data.opponent["name"]).replaceAll('"', '');
        var opponentClanTag = JSON.stringify(data.opponent["tag"]).replaceAll('"', '');
        var opponentNameAndTag = opponentClanName + " ("+opponentClanTag+")";
        var opponentTeamSize = JSON.stringify(data.teamSize).toString();
        var opponentAttacksUsed = JSON.stringify(data.opponent["attacks"]).toString()+"/"+(data.teamSize*2).toString();
        var opponentTotStars = JSON.stringify(data.opponent["stars"]).toString()+"/"+(data.teamSize*3).toString();
        var opponentDestructionPercentage = JSON.stringify(Math.round((data.opponent["destructionPercentage"] + Number.EPSILON) * 100) / 100).toString()+"%";

        const clanEmbed = new MessageEmbed()
        .setColor('#03fcec')
        .setTitle('Current War Info - '+data.clan["name"])
        .setAuthor({ name: 'USG bot', iconURL: apiClanLogo, url: 'https://www.clashofstats.com/clans/usg-2YQ998GLV/summary' })
        .setDescription('Information about '+data.clan["name"]+' War status')
        .setThumbnail(data.clan["badgeUrls"]["medium"])
        .addFields(
            { name: 'War State', value: warState, inline: true },
            { name: 'Opponent Name & Tag', value: opponentNameAndTag, inline: true },
            { name: 'Team Size', value: teamSize, inline: true },
            { name: 'Attacks Used', value: attacksUsed, inline: true },
            { name: 'Total Stars', value: totStars, inline: true },
            { name: 'Destruction %', value: destructionPercentage, inline: true },
            { name: 'War Members', value: memberListStr, inline: true },
            { name: 'Attacks & Stars', value: attacksList, inline: true },
            { name: 'Target', value: nameofTargetList, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'USG bot'});
        

        const opponentClanEmbed = new MessageEmbed()
        .setColor('#d45206')
        .setTitle('Current War Info - '+opponentClanName)
        .setAuthor({ name: 'USG bot', iconURL: apiClanLogo, url: 'https://www.clashofstats.com/clans/usg-2YQ998GLV/summary' })
        .setDescription('Information about '+opponentClanName+' War status')
        .setThumbnail(data.opponent["badgeUrls"]["medium"])
        .addFields(
            { name: 'War State', value: warState, inline: true },
            { name: 'Opponent Name & Tag', value: clanNameAndTag, inline: true },
            { name: 'Team Size', value: opponentTeamSize, inline: true },
            { name: 'Attacks Used', value: opponentAttacksUsed, inline: true },
            { name: 'Total Stars', value: opponentTotStars, inline: true },
            { name: 'Destruction %', value: opponentDestructionPercentage, inline: true },
            { name: 'War Members', value: opponentListStr, inline: true },
            { name: 'Attacks & Stars', value: oppAttacksList, inline: true },
            { name: 'Target', value: oppNameOfTargetList, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'USG bot'});

        let embeds = [clanEmbed, opponentClanEmbed];

        msg.channel.createMessage({embeds: embeds});
        }
        
        })
    .catch((error) => {
        console.error('Error:', error);
    });         
    
    }


    // Extract the parts of the command and the command name
    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length);

    // Get the appropriate handler for the command, if there is one.
    const commandHandler = commandHandlerForCommandName[commandName];
    if (!commandHandler) {
        return;
    }
    // Separate the command arguments from the command prefix and command name.
    const args = parts.slice(1);
    try {
        // Execute the command.
        await commandHandler(msg, args);
    } catch (err) {
        console.warn('Error handling command');
        console.warn(err);
    }
});

bot.on('error', err => {
   console.warn(err);
});

bot.connect();