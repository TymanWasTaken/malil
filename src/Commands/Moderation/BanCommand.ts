import { Listener } from "discord-akairo";
import { Command } from "discord-akairo";
import { Message, GuildMember, MessageEmbed, GuildChannel, TextChannel } from "discord.js";
import { utc } from "moment";
import { GetMember, Infract } from "../../Lib/Utils";
export default class BanCommand extends Command {
	public constructor() {
		super("ban", {
			aliases: ["ban", "bang"],
			category: "Moderation",
			description: {
				content: "To ban members on this guild",
				example: ["ban @member", "ban @member"],
			},
			channel: "guild",
			ratelimit: 3,
			clientPermissions: ["BAN_MEMBERS", "SEND_MESSAGES"],
			userPermissions: ["BAN_MEMBERS"],
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
		if (!user.bannable) return message.util.send(`Sorry, i can't ban this user`);

		try {
			await user.send(`You has been banned from **${message.guild.name} for reason: \`${reason}\``);
		} catch (err) {
			message.reply(err);
		}

		await message.guild.members.ban(user, { reason });

		message.util.send(
			new MessageEmbed()
				.setAuthor(`User Banned by ${message.author.tag}`, message.author.avatarURL())
				.setThumbnail(user.user.avatarURL())
				.setDescription(`Name: ${user.user.tag}\n` + `Time: ${utc(Date.now())}\n` + `Reason: ${reason}`)
				.setFooter(`Sayonara~`)
				.setTimestamp()
		);

		//* ------------------------------------ infraction code */
		Infract(message, reason, user, "BAN", this.client);
	}
}
