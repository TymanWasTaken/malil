import { Command } from "discord-akairo";
import { MessageEmbed, GuildChannel, TextChannel, GuildMember, Message } from "discord.js";
import { utc } from "moment";
import { GetMember, Infract } from "../../Lib/Utils";

export default class KickCommand extends Command {
	public constructor() {
		super("kick", {
			aliases: ["kick"],
			category: "Moderation",
			description: {
				content: "To kick member on this guild",
				usage: "kick < member > ",
				example: ["kick @member"],
			},
			ratelimit: 3,

			clientPermissions: ["KICK_MEMBERS", "SEND_MESSAGES"],
			userPermissions: ["KICK_MEMBERS"],
			channel: "guild",
			args: [
				{
					id: "user",
					type: async (message, content) => {
						let member = await GetMember(message, content);
						if (member) return member;
					},
					match: "content",
				},
				{
					id: "reason",
					type: async (message, content) => content.split(" ").slice(1).join(" "),
					match: "content",
				},
			],
		});
	}

	public async exec(message: Message, { reason, user }: { user: GuildMember; reason: string }): Promise<Message> {
		if (!user) return message.util.send("user not found");
		if (!user.kickable) return message.util.send(`Sorry, i can't kick this user`);

		user.kick().then((x) => {
			x.send(`You have been kicked from **${message.guild.name}** for reason \`${reason}\``);
			message.util.send(
				new MessageEmbed()
					.setAuthor(`User kicked by ${message.author.tag}`, message.author.avatarURL())
					.setDescription(`Name: ${x.user.tag}\n` + `Time Kicked: ${utc(Date.now())}\n` + `Reason: ${reason}`)
					.setFooter(`Sayonara~`)
					.setTimestamp()
			);
		});

		//* ------------------------------------ infraction code */
		Infract(message, reason, user, "KICK", this.client);
	}
}
