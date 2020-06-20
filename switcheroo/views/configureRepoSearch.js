const chalk = require('chalk');
const {say} = require("../util");
const {View} = require("./_abstracts");
const {APP_NAME} = require('../configs.json');
const {terminal} = require('terminal-kit')



const configureRepoSearch = new View('ConfigureRepoSearch', {
    run: async function() {
        say(chalk.blue(`${APP_NAME} can rename branches on your repositories that are public, private, or both. You can also test with just an individual one.
        Which would you prefer?`));
        const choices = [
            'Public and private repos (most dangerous)',
            'Public repos only',
            'Private repos only',
            'Specify one repo (safest)'
        ]
        const answer = await new Promise(
            (resolve, reject) => terminal.singleColumnMenu(choices, function (err, response) {
                if (err) {
                    reject(err);
                }
                resolve(response);
            }));
        say('WAW', answer)
    }
});


module.exports = { configureRepoSearch }