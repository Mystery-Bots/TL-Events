const ms = require('ms')

module.exports.run = async (bot, message, args) => {
    user = message.mentions[0]
    if (!user){
        userArray = await message.channel.guild.fetchMembers({userIDs:[args[0]]})
        user = userArray[0]
    }
    eventChannel = bot.getChannel("779081002311352370")
    eventChannel.editPermission(user.id, 0,2048,"member","Event mute")
    setTimeout(() => {
        eventChannel.deletePermission(user.id, "Event unmute")
    }, ms("20s"));
    
}

module.exports.info = {
    name: "mute",
    description: "Mutes people from the event chat for a period of time.",
    category: "Staff",
}