const helper = require('../helper.js');
const osu = require('../osu.js');

module.exports = {
    command: ['bg', 'background'],
    description: "Get HD background of replied osu embed.",
    usage: '',
    example: [
        {
            run: "bg",
            result: "Return HD background of replied osu embed."
        }
    ],
    call: obj => {
        return new Promise(async (resolve, reject) => {
            const { msg } = obj;
            if (!msg.reference) reject('Please reply to an osu embed.');
            else {
                const replied_msg = await msg.channel.messages.fetch(msg.reference.messageID);
                const beatmap_id = osu.parse_beatmap_url_sync(replied_msg.author.id === '289066747443675143' ? replied_msg.embeds[0].author?.url : replied_msg.embeds[0].url);
                const thumbnail = replied_msg.embeds[0].thumbnail?.url;
                let beatmapset;
                if (thumbnail.includes('/covers/')) beatmapset = thumbnail.split('/covers/')[0].split('/').pop();
                if (thumbnail.includes('/thumb/')) beatmapset = thumbnail.split('/thumb/').pop().split('l')[0];
                if (beatmapset && beatmap_id) {
                    const embed = {
                        color: 12277111,
                        description: '\u200B',
                        image: {
                            url: `https://beatconnect.io/bg/${beatmapset}/${beatmap_id}`
                        }
                    }
                    resolve({ embed: embed });
                } else reject('Please reply to an osu embed.');
            }
        })
    }
}
