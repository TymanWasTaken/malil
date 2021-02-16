import { Command } from "discord-akairo";
import type { Message, GuildMember, ImageSize, AllowedImageFormat } from "discord.js";
import { MessageEmbed } from "discord.js";

export default class PollCommand extends Command {
    public constructor() {
        super("poll", {
            aliases: ["poll"],
            category: "Utility",
            quoted: true,
            args: [
                {
                    id: "args",
                    type: "array",
                    match: "rest",
                    default: "Please input some code"
                }
            ],
            description: {
                content: "Share your questions",
                usage: "poll",
                example: [
                    "poll"
                ]
            },
            ratelimit: 3,
            channel: "guild",
            userPermissions: ["MANAGE_MESSAGES"]
        });
    }

    public async exec(message: Message, { args }) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You need the permission manage messages to execute this command")
        message.delete()
        const input = args
        if (!input) return message.reply('pelase ask a question')

        const dataEmbed = {
            title: input,
            description: `Vote with 👍 or 👎`,
            color: `GREEN`,
            footer: {
                text: `requested by ${message.author.tag}`,
                icon_url: '',
            },
        }

        try {
            message.channel.send({ embed: dataEmbed })
                .then(function (message) {
                    message.react("👍")
                    message.react("👎")
                }).catch(function () {
                    //Something
                });
        } catch (error) { error; }

    }
}