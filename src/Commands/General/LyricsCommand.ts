import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import { getLyrics, getSong } from "genius-lyrics-api";

export default class lyricsCommand extends Command {
	public constructor() {
		super("lyrics", {
			aliases: [
				"lyrics",
				"lyc"
			],
			category: "General",
			quoted: true,
			args: [
				{
					id: "args",
					type: "array",
					match: "rest"
				}
			],
			description: {
				content: "Get the lyrics of a song",
				usage: "lyrics",
				example: [
					"lyrics"
				]
			},
			ratelimit: 3,
			channel: "guild"
		});
	}

	public async exec(message: Message, { args }) {
		const options = {
			apiKey: process.env.genius,
			title: args,
			artist: "",
			optimizeQuery: true
		};

		getSong(options).then((song) => {
			let lyrics = song.lyrics;
			if (song.lyrics.length > 1024) {
				function cutString(s, n) {
					/* ----------------------- */
					var cut = s.indexOf(" ", n);
					if (cut == -1) return s;
					return s.substring(0, cut);
				}
				/* ----------------------- */
				lyrics = cutString(lyrics, 1000);
				lyrics += "....";
			}
			// prettier-ignore
			lyrics = lyrics.replace(/nigger/g, "n-").replace(/nigga/g, "n-");
			message.reply(new MessageEmbed().setTitle(args).setURL(song.url).addField("lyrics", lyrics));
		});
	}
}
