/* 
    top 3: 3 Epics (15 points) index >2
    top 4-7: 10 Epics (50 points) index 3-6
    top 8-13: 12 Epics (60 points) index 7-12
    top 14-26: 15 Epics (75 points) index 13-25
    top 27<: 20 Epics (100 points) index 26<
*/

module.exports.run = async (bot, message, args) => {
    let guild = message.channel.guild
    let usercollection = bot.database.collection(`${guild.id}`)
    let statsCollection = bot.database.collection('stats')
    let rankings = await usercollection.find().sort({totalPoints:-1}).toArray()
    let userStats = await usercollection.findOne({"userID":message.author.id})
    let gifts = 0
    if(!userStats){
        userUpdateDoc = {$set:{
            "userID": message.author.id,
            "username":`${message.author.username}#${message.author.discriminator}`,
            "common": 0,
            "rare": 0,
            "epic": 20,
            "totalPoints": (5*20),
            "claimedChristmas":1
        }}
        statsUpdateDoc = {$inc:{
            "totalChristmas": 20,
            "totalepic": 20
        }}
        gifts = 20
}
    if (0 <= rankings.findIndex(x => x.userID == userStats.userID) && rankings.findIndex(x => x.userID == userStats.userID) <= 2){
        userUpdateDoc = {$inc:{
            "epic": 3,
            "totalPoints": (5*3),
            "claimedChristmas":1
        }}
        statsUpdateDoc = {$inc:{
            "totalChristmas": 3,
            "totalepic": 3
        }}
        gifts = 3
    }else if(3<= rankings.findIndex(x => x.userID == userStats.userID) && rankings.findIndex(x => x.userID == userStats.userID) <=6){
        userUpdateDoc = {$inc:{
            "epic": 10,
            "totalPoints": (5*10),
            "claimedChristmas":1
        }}
        statsUpdateDoc = {$inc:{
            "totalChristmas": 10,
            "totalepic": 10
        }}
        gifts = 10
    }else if(7<= rankings.findIndex(x => x.userID == userStats.userID) && rankings.findIndex(x => x.userID == userStats.userID) <=12){
        userUpdateDoc = {$inc:{
            "epic": 12,
            "totalPoints": (5*12),
            "claimedChristmas":1
        }}
        statsUpdateDoc = {$inc:{
            "totalChristmas": 12,
            "totalepic": 12
        }}
        gifts = 12
    }else if(13<= rankings.findIndex(x => x.userID == userStats.userID) && rankings.findIndex(x => x.userID == userStats.userID) <=25){
        userUpdateDoc = {$inc:{
            "epic": 15,
            "totalPoints": (5*15),
            "claimedChristmas":1
        }}
        statsUpdateDoc = {$inc:{
            "totalChristmas": 15,
            "totalepic": 15
        }}
        gifts = 15
    }else if(26<= rankings.findIndex(x => x.userID == userStats.userID)){
        userUpdateDoc = {$inc:{
            "epic": 20,
            "totalPoints": (5*20),
            "claimedChristmas":1
        }}
        statsUpdateDoc = {$inc:{
            "totalChristmas": 20,
            "totalepic": 20
        }}
        gifts = 20
    }
    if(userStats != null){
        if(userStats.claimedChristmas) return message.channel.createMessage("You have already claimed your christmas gifts")
    }
    await statsCollection.updateOne({_id:'5fb5896be09eb535b97403be'},statsUpdateDoc)
    await usercollection.updateOne({userID: message.author.id}, userUpdateDoc, {upsert:true}); 
    message.channel.createMessage(`${message.author.mention}, You have claimed your ${gifts} epic christmas gifts`)
}

module.exports.info = {
    name: "christmas",
    description: "Claim your christmas gift from TheMystery",
    category: "Game",
}