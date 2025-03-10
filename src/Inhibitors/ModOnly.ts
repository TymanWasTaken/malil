import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";
import { superUsers } from "../Lib/config";
import { Format, a1 } from "../Lib/Utils";
export default class extends Inhibitor {
	constructor() {
		super("ModOnly", {
			reason: "ModOnly",
			priority: 7,
			type: "post",
		});
	}
	public async exec(message: Message, command: Command): Promise<boolean> {
		if (superUsers.includes(message.author.id)) return false;
		if (message.member.permissions.has("MANAGE_MESSAGES")) return false;

		const channels = this.client.guilddata.ensure(message.guild.id, [], "modonly");

		if (channels?.includes(message.channel.id)) {
			if (message.channel.id == "824350969696354346") {
				if (`${command}`.toLowerCase() == "iq") {
					const cur = Number(this.client.userdata.ensure(message.member.id, 1, "iq"));
					if (!cur) return;
					if (cur - 50 < 0) this.client.userdata.set(message.member.id, 1, "iq");
					else this.client.userdata.set(message.member.id, cur - 50, "iq");
				}
			}
			const { GStr, UStr } = Format(message, null, null, null);
			this.client.logger.info(a1(`[ USER ] ${UStr} [ GUILD ] ${GStr} [ MODONLY ]`));
			return true;
		} else return false;
	}
}
