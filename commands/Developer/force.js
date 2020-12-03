const ms = require("ms")
const Discord = require("eris-additions")(require("eris"))

function makeString(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

typeConvert = {
    0: "Common",
    1: "Rare",
    2: "Epic"
}

async function getType(){
    let num = Math.floor(Math.random() * 100)
    if (num < 10){
        type = 2
    }else if (10 <= num && num < 35 ){
        type = 1
    }else if (35 <= num ){
        type = 0
    }
    return type
}

function spawnGift(type){
    let embed = {
        title:`A ${type} Gift Appeared`,
        image: {
            url: "https://themystery.s-ul.eu/bot/s7ZHjnD5"
        },
        color: 0xafafaf
    }
    return embed
}

function unclaimedGift(type){
    let embed = {
        title:`A ${type} Gift Disappeared`,
        description: `The Gift has disappeared due to being unclaimed for longer than 5 minutes`,
    }
    return embed
} 

function claimedGift(type, user){
    let embed = {
        title:`A ${type} Gift Appeared`,
        description: `${user} Claimed the gift`,
        color: 0xafafaf
    }
    return embed
} 

module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "force"`)
    lockedUser = message.mentions[0]
    let type = args[1]
    if (!type){
        type = typeConvert[await getType()]
    }
    if (!lockedUser){
        type = args[0]
    }
    let statsCollection = bot.database.collection('stats')
    let channel = bot.getChannel("779081002311352370") // Public
    //let channel = bot.getChannel("633920642605121578") // Testing
    let randomString = makeString(6)
    let embed = spawnGift(type)
    if (lockedUser){
        embed.description = `${lockedUser.mention} Use \`tlclaim ${randomString}\` to claim the gift`
    }else{
        embed.description = `Use \`tlclaim ${randomString}\` to claim the gift`
    }
    let spawnMessage = await channel.createMessage({embed: embed})
    let responses = null
    if (lockedUser){
        responses = await channel.awaitMessages(m => m.content.toLowerCase() === `tlclaim ${randomString}` && m.author.id == lockedUser.id, { time: ms('5m'), maxMatches: 1 });
    }else{
        responses = await channel.awaitMessages(m => m.content.toLowerCase() === `tlclaim ${randomString}`, { time: ms('5m'), maxMatches: 1 });
    }
    if (responses.length){
        try{
            await responses[0].delete()
        }
        catch (e) {
            await spawnMessage.delete()
            return message.channel.createMessage("Gift removed due to error")
        }
        let userCollection = bot.database.collection(`${message.channel.guild.id}`)
        let userResult = await userCollection.findOne({"userID": `${responses[0].author.id}`})
        if (!userResult){
            if (type == "Common"){
                userUpdateDoc = {
                    "userID": responses[0].author.id,
                    "username":`${responses[0].author.username}#${responses[0].author.discriminator}`,
                    "common": 1,
                    "rare": 0,
                    "epic": 0,
                    "totalPoints":1
                }
                statsUpdateDoc = {$inc:{
                    "totalClaims": 1,
                    "totalcommon": 1
                }}
            }
            else if (type == "Rare"){
                userUpdateDoc = {
                    "userID": responses[0].author.id,
                    "username":`${responses[0].author.username}#${responses[0].author.discriminator}`,
                    "common": 0,
                    "rare": 1,
                    "epic": 0,
                    "totalPoints":2
                }
                statsUpdateDoc = {$inc:{
                    "totalClaims": 1,
                    "totalrare": 1
                }}
            }
            else if (type == "Epic"){
                userUpdateDoc = {
                    "userID": responses[0].author.id,
                    "username":`${responses[0].author.username}#${responses[0].author.discriminator}`,
                    "common": 0,
                    "rare": 0,
                    "epic": 1,
                    "totalPoints":5
                }
                statsUpdateDoc = {$inc:{
                    "totalClaims": 1,
                    "totalepic": 1
                }}
            }
            await statsCollection.updateOne({_id:'5fb5896be09eb535b97403be'},statsUpdateDoc)
            await userCollection.insertOne(userUpdateDoc); 
        }
        else{
            count = userResult[type.toLowerCase()] +1
            if (type == "Common"){
                userUpdateDoc = {
                    $set:{
                        common: count,
                        totalPoints: (userResult.totalPoints + 1)
                    }
                }
                statsUpdateDoc = {$inc:{
                    "totalClaims": 1,
                    "totalcommon": 1
                }}
            }
            else if (type == "Rare"){
                userUpdateDoc = {
                    $set:{
                        rare: count,
                        totalPoints: (userResult.totalPoints + 2)
                    }
                }
                statsUpdateDoc = {$inc:{
                    "totalClaims": 1,
                    "totalrare": 1
                }}
            }
            else if (type == "Epic"){
                userUpdateDoc = {
                    $set:{
                        epic: count,
                        totalPoints: (userResult.totalPoints + 5)
                    }
                }
                statsUpdateDoc = {$inc:{
                    "totalClaims": 1,
                    "totalepic": 1
                }}
            }
            await statsCollection.updateOne({_id:'5fb5896be09eb535b97403be'},statsUpdateDoc)
            await userCollection.updateOne({userID: responses[0].author.id}, userUpdateDoc); 
        }
        spawnMessage.edit({embed: claimedGift(type, responses[0].author.mention)})
    }else{
        spawnMessage.edit({embed: unclaimedGift(type)})
    }
}



module.exports.info = {
    name: "force",
    description: "Forces a gift spawn without changing the spawn time",
    category: "Developer",
}