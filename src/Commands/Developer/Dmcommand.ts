import { Command } from "discord-akairo";
import type { Message, GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import { GetMember } from "../../Lib/Utils";
export default class DmCommand extends Command {
	public constructor() {
		super("dm", {
			aliases: ["dm"],
			category: "Developer",
			quoted: true,
			args: [
				{
					id: "args",
					type: "content",
					match: "rest",
				},
				{
					id: "member",
					type: async (message, content) => {
						let member = await GetMember(message, content);
						if (member) return member;
					},
					match: "content",
				},
			],
			description: {
				content: "dm's a user",
				usage: "dm",
				example: ["dm"],
			},
			ratelimit: 3,
			channel: "guild",
			superUserOnly: true,
		});
	}

	public async exec(message: Message, { args, member }: { args: string; member: GuildMember }) {
		if (!member) return message.util.reply("User not found");
		member.send(args.split(" ").slice(1).join(" ") || "e").catch((e) => message.util.send(e, { allowedMentions: { repliedUser: false } }));
		message.util.send(`Dmed ${member.user.tag}`, { allowedMentions: { repliedUser: false } });
	}
}
