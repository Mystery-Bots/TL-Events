const ms = require('ms')

module.exports.run = async (bot, message, args) => {
    if (!message.member.roles.includes('704921933073875014')) return message.channel.createMessage("Sorry but you can not use this command.")
    user = message.mentions[0]
    if (!user){
        userArray = await message.channel.guild.fetchMembers({userIDs:[args[0]]})
        user = userArray[0]
    }else{
        userArray = await message.channel.guild.fetchMembers({userIDs:[user.id]})
        user = userArray[0]
    }
    if (user.roles.includes('704921933073875014')) return message.channel.createMessage("This member can not be muted")
    eventChannel = bot.getChannel("779081002311352370")
    eventChannel.editPermission(user.id, 0,2048,"member","Event mute")
    eventChannel.createMessage(`User: ${user.username}#${user.discriminator} has been muted`)
    setTimeout(() => {
        eventChannel.deletePermission(user.id, "Event unmute")
        eventChannel.createMessage(`User: ${user.username}#${user.discriminator} has been unmuted`)
    }, ms("30m"));
    
}

module.exports.info = {
    name: "mute",
    description: "Mutes people from the event chat for a period of time.",
    category: "Staff",
}