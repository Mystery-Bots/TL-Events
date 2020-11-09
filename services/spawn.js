const ms = require("ms")
const Discord = require("eris-additions")(require("eris"))

let minSpawn = 1
let maxSpawn = 3 // (This is actually the number below this)

let SpawnTime = 1604867889

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
    console.log(num)
    return type
}

function spawnGift(type){
    let embed = {
        title:`A ${type} Gift Appeared`,
        description: `Use \`tlclaim\` to claim the gift`,
        color: 0xafafaf
    }
    return embed
}

function unclaimedGift(type){
    let embed = {
        title:`A ${type} Gift Disappeared`,
        description: `The Gift has disappeared because was unclaimed for longer than 5 minutes`,
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
    let now = Date.now()
    if (message.author.bot) return
    if (now > SpawnTime){
        let channel = bot.getChannel("633920642605121578")
        let type = typeConvert[await getType()]
        let spawnMessage = await channel.createMessage({embed: spawnGift(type)})
        let newSpawnDuration = Math.floor(Math.random() * (3 - 1) + 1) // Mins
        SpawnTime = (Date.now() + ms(`${newSpawnDuration}m`)).toFixed(0)
        let responses = await channel.awaitMessages(m => m.content === "tlclaim", { time: ms('30s'), maxMatches: 1 });    
        if (responses.length){
            await responses[0].delete()
            const collection = bot.database.collection(`${message.channel.guild.id}`)
            console.log(collection)
            let result = await collection.findOne({"userID": `${responses[0].author.id}`})
            if (!result){
                if (type == "Common"){
                    updateDoc = {
                        "userID": responses[0].author.id,
                        "username":`${responses[0].author.username}#${responses[0].author.discriminator}`,
                        "Common": "1",
                        "Rare": "0",
                        "Epic": "0"
                    }
                }
                else if (type == "Rare"){
                    updateDoc = {
                        "userID": responses[0].author.id,
                        "username":`${responses[0].author.username}#${responses[0].author.discriminator}`,
                        "Common": "1",
                        "Rare": "0",
                        "Epic": "0"
                    }
                }
                else if (type == "Epic"){
                    updateDoc = {
                        "userID": responses[0].author.id,
                        "username":`${responses[0].author.username}#${responses[0].author.discriminator}`,
                        "Common": "1",
                        "Rare": "0",
                        "Epic": "0"
                    }
                }
                console.log(type)
                await collection.insertOne(updateDoc); 
            }
            else{
                console.log(result)
                console.log(result[type])
                count = parseInt(result[type]) +1
                console.log(typeof(count))
                console.log(count)
                if (type == "Common"){
                    updateDoc = {
                        $set:{
                            Common:`${count}` 
                        }
                    }
                }
                else if (type == "Rare"){
                    updateDoc = {
                        $set:{
                            Rare:`${count}` 
                        }
                    }
                }
                else if (type == "Epic"){
                    updateDoc = {
                        $set:{
                            Epic:`${count}` 
                        }
                    }
                }
                
                console.log(updateDoc)
                await collection.updateOne({userID: responses[0].author.id}, updateDoc); 
            }
            spawnMessage.edit({embed: claimedGift(type, responses[0].author.mention)})
        }else{
            spawnMessage.edit({embed: unclaimedGift(type)})
        }
    }
}

