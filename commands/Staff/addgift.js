const Eris = require("eris-additions")(require("eris"))

const types = ['common', 'rare', 'epic']

module.exports.run = async (bot, message, args) => {
    let embed = {
        title: "Gift Giver Panel",
        color: 0x11aaaa,
        fields: []
    }
    let userData = {
        common: 0,
        rare: 0,
        epic: 0,
        totalPoints: 0
    }
    let statsData = {
        totalStaff: 0,
        totalcommon: 0,
        totalrare: 0,
        totalepic: 0
    }
    if (!message.member.roles.includes('704921933073875014')) return message.channel.createMessage("Sorry but you can not use this command.")
    userID = args[0]
    user = await message.channel.guild.fetchMembers({userIDs:[userID]})
    user = user[0]
    let userCollection = bot.database.collection(`${message.channel.guild.id}`)
    let statsCollection = bot.database.collection('stats')
    embed.description = `User: **${user.username}#${user.discriminator}**\nType the following to add gifts: \`<Rarity> <Quantity>\`\nType: \`done\` when done listing gifts.\nType: \`cancel\` if you make a mistake`
    let embedMessage = await message.channel.createMessage({embed:embed})
    let response = ""
    while(response[0] != 'done'){
        let responses = await message.channel.awaitMessages(m => m.author === message.author, { time: 20000, maxMatches: 1 });
        if(!responses.length) return message.channel.createMessage("Gift giver timed out");
        response = responses[0].content.toLocaleLowerCase().trim().split(/ +/g)
        await responses[0].delete()
        if (types.includes(response[0])){
            if (typeof(parseInt(response[1])) == 'number'){
                embed.fields.push({
                    name: response[0],
                    value: response[1].toLocaleString(),
                    inline: true
                })
                userData[response[0]] = parseInt(response[1])
                statsData[`total${response[0]}`] += parseInt(response[1])
                statsData['totalStaff'] += parseInt(response[1])
                if (response[0] == 'common'){
                    userData.totalPoints += parseInt(response[1])
                }
                else if (response[0] == 'rare'){
                    userData.totalPoints += (parseInt(response[1]) * 2)
                }
                else if (response[0] == 'epic'){
                    userData.totalPoints += (parseInt(response[1]) * 5)
                }
            }else{
                message.channel.createMessage("Please enter a valid quantity of gift").then((msg) => setTimeout(() => {msg.delete()},5*1000))
            }
        }
        else if (response[0] == 'done'){}
        else if (response[0] == 'cancel') {
            await embedMessage.delete()
            return message.channel.createMessage("Gift giver canceled")
        }
        else {
            message.channel.createMessage("Please enter a valid rarity of gift").then((msg) => setTimeout(() => {msg.delete()},5*1000))
        
        }
        await embedMessage.edit({embed:embed})
    }
    let userResult = await userCollection.findOne({userID:user.id})
    if (!userResult){
        userData.userID = userID
        userData.username = `${user.username}#${user.discriminator}`
        userUpdateDoc = userData 
        statsUpdateDoc = {$inc:statsData}
        await statsCollection.updateOne({_id:'5fb5896be09eb535b97403be'},statsUpdateDoc)
        await userCollection.insertOne(userUpdateDoc); 
    }else{        
        userUpdateDoc = {$inc:userData}
        statsUpdateDoc = {$inc:statsData}
        await statsCollection.updateOne({_id:'5fb5896be09eb535b97403be'},statsUpdateDoc)
        await userCollection.updateOne({userID: user.id}, userUpdateDoc); 
    }
    await message.channel.createMessage(`Added Gifts to ${user.username}#${user.discriminator}`)
}

module.exports.info = {
    name: "addgift",
    description: "Gives a gift to user by ID",
    usage: '<userID>',
    category: "Staff",
}