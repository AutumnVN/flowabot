const helper = require('../helper.js');
const config = require('../config.json');
const fs = require('fs');
const path = require('path');

let commands = [
    "Get help for a command."
];

fs.readdir(__dirname, (err, items) => {
    if (err)
        throw "Unable to read commands folder";

    items.forEach(item => {
        if (path.extname(item) == '.js')
            commands.push('`' + item.substr(0, item.length - 3) + '`');
    });
});

module.exports = {
    command: 'help',
    argsRequired: 1,
    description: commands,
    usage: '<command>',
    example: [
        {
            run: "help pp",
            result: `Returns help on how to use the \`${config.prefix}pp\` command.`
        }
    ],
    call: obj => {
        let { argv } = obj;
        return helper.commandHelp(argv[1]);
    }
};
