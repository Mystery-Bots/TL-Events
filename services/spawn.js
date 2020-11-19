const ms = require("ms")
const Discord = require("eris-additions")(require("eris"))

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
        description: `Use \`tlclaim\` to claim the gift`,
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

module.exports.Run = async function(bot, message){
    if (message.channel.id != '722885661459218433') return
    let statsCollection = bot.database.collection('stats')
    let statsResult = await statsCollection.findOne({_id:'5fb5896be09eb535b97403be'})
    let now = Date.now()
    if (message.author.bot) return
    if (now > statsResult.SpawnTime){
        let channel = bot.getChannel("722885661459218433")
        let type = typeConvert[await getType()]
        let spawnMessage = await channel.createMessage({embed: spawnGift(type)})
        let newSpawnDuration = Math.floor(Math.random() * ((statsResult.maxSpawn+1) - statsResult.minSpawn) + 1) // Mins
        let SpawnTime = (Date.now() + ms(`${newSpawnDuration}s`)).toFixed(0)
        await statsCollection.updateOne({_id:'5fb5896be09eb535b97403be'},{$set:{'SpawnTime':SpawnTime}})
        let responses = await channel.awaitMessages(m => m.content === "tlclaim", { time: ms('5m'), maxMatches: 1 });    
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
                        "totalCommon": 1
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
                        "totalRare": 1
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
                        "totalEpic": 1
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
                        "totalCommon": 1
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
                        "totalRare": 1
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
                        "totalEpic": 1
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
}

