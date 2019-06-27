const osu = require('../osu.js');
const helper = require('../helper.js');
const config = require('../config.json');

module.exports = {
    command: ['top', 'rb', 'recentbest', 'ob', 'oldbest'],
    description: "Show a specific top play.",
    startsWith: true,
    usage: '[username]',
    example: [
        {
            run: "top",
            result: "Returns your #1 top play."
        },
        {
            run: "top5 vaxei",
            result: "Returns Vaxei's #5 top play."
        },
        {
            run: "rb",
            result: "Returns your most recent top play."
        },
        {
            run: "ob",
            result: "Returns your oldest top play (from your top 100)."
        }
    ],
    configRequired: ['credentials.osu_api_key'],
    call: obj => {
        return new Promise((resolve, reject) => {
            let { argv, msg, user_ign, last_beatmap } = obj;

            let top_user = helper.getUsername(argv, msg, user_ign);

            let rb = ['rb', 'recentbest'].includes(argv[0].toLowerCase());
            let ob = ['ob', 'oldestbest'].includes(argv[0].toLowerCase());

            let index = 1;
            let match = argv[0].match(/\d+/);
            let _index = match > 0 ? match[0] : 1;

            if(_index >= 1 && _index <= 100)
                index = _index;

            if(!top_user){
                if(user_ign[msg.author.id] == undefined){
                    reject(helper.ignSetHelp());
                    msg.channel.send(msg.author.username + " hasn't set their ingame name (`!ign set <ingame name>)`");
                }else{
                    reject(helper.commandUsage('top'));
                }

                return false;
            }else{
                osu.get_top({user: top_user, index: index, rb: rb, ob: ob}, (err, recent, ur_promise) => {
                    if(err){
                        helper.error(err);
                        reject(err);
                        return false;
                    }else{
                        let embed = osu.format_embed(recent);
                        helper.updateLastBeatmap(recent, msg.channel.id, last_beatmap);

                        if(ur_promise){
                            resolve({embed: embed, ur_promise: new Promise((resolve, reject) => {
                                ur_promise.then(recent => {
                                    embed = osu.format_embed(recent);
                                    resolve({embed: embed});
                                });
                            })});
                        }else{
                            resolve({embed: embed});
                        }
                    }
                });
            }
        });
    }
};
