module.exports.run = async (bot, message, args) => {
    if (!message.member.roles.includes('704921933073875014')) return message.channel.createMessage("Sorry but you can not use this command.")
    user = message.mentions[0]
    type = args[1].toLowerCase()
    let userCollection = bot.database.collection(`${message.channel.guild.id}`)
    let statsCollection = bot.database.collection('stats')

    let userResult = await userCollection.findOne({userID:user.id})
    if (!userResult){
        if (type == "common"){
            userUpdateDoc = {
                "userID": user.id,
                "username":`${user.username}#${user.discriminator}`,
                "common": 1,
                "rare": 0,
                "epic": 0,
                "totalPoints":1
            }
            statsUpdateDoc = {$inc:{
                "totalStaff": 1,
                "totalCommon": 1
            }}
        }
        else if (type == "rare"){
            userUpdateDoc = {
                "userID": user.id,
                "username":`${user.username}#${user.discriminator}`,
                "common": 0,
                "rare": 1,
                "epic": 0,
                "totalPoints":2
            }
            statsUpdateDoc = {$inc:{
                "totalStaff": 1,
                "totalRare": 1
            }}
        }
        else if (type == "epic"){
            userUpdateDoc = {
                "userID": user.id,
                "username":`${user.username}#${user.discriminator}`,
                "common": 0,
                "rare": 0,
                "epic": 1,
                "totalPoints":5
            }
            statsUpdateDoc = {$inc:{
                "totalStaff": 1,
                "totalEpic": 1
            }}
        }
        await statsCollection.updateOne({_id:'5fb5896be09eb535b97403be'},statsUpdateDoc)
        await userCollection.insertOne(userUpdateDoc); 
    }else{
        count = userResult[type] +1
        if (type == "common"){
            userUpdateDoc = {
                $set:{
                    common: count,
                    totalPoints: (userResult.totalPoints + 1)
                }
            }
            statsUpdateDoc = {$inc:{
                "totalStaff": 1,
                "totalCommon": 1
            }}
        }
        else if (type == "rare"){
            userUpdateDoc = {
                $set:{
                    rare: count,
                    totalPoints: (userResult.totalPoints + 2)
                }
            }
            statsUpdateDoc = {$inc:{
                "totalStaff": 1,
                "totalRare": 1
            }}
        }
        else if (type == "epic"){
            userUpdateDoc = {
                $set:{
                    epic: count,
                    totalPoints: (userResult.totalPoints + 5)
                }
            }
            statsUpdateDoc = {$inc:{
                "totalStaff": 1,
                "totalEpic": 1
            }}
        }
        await statsCollection.updateOne({_id:'5fb5896be09eb535b97403be'},statsUpdateDoc)
        await userCollection.updateOne({userID: user.id}, userUpdateDoc); 
    }
    await message.channel.createMessage(`Added Gift ${type} to ${user.username}#${user.discriminator}`)
}

module.exports.info = {
    name: "addgift",
    description: "Gives a gift to user by mention",
    usage: '<@user> <type>',
    category: "Staff",
}