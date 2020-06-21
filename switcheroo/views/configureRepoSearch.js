const chalk = require('chalk');
const {gatherRepos} = require("./gatherRepos");
const {say} = require("../util");
const {View} = require("./_abstracts");
const {APP_NAME} = require('../configs.json');
const {terminal} = require('terminal-kit')



const configureRepoSearch = new View('ConfigureRepoSearch', {
    run: async function() {
        say(chalk.blue(`${APP_NAME} can rename branches on your repositories that are public, private, or both. You can also test with just an individual one.
        Which would you prefer?`));
        const choices = {
            'Public and private repos (most dangerous)': 'all',
            'Public repos only': 'public',
            'Private repos only': 'private',
            // 'Specify one repo (safest)': 'single' TODO
        }

        const userResponse = await new Promise(
            (resolve, reject) => terminal.singleColumnMenu(Object.keys(choices), function (err, response) {
                if (err) {
                    reject(err);
                }
                resolve(response);
            }));
        const answerKeyword = choices[userResponse.selectedText];
        if (answerKeyword === 'single') {
            //TODO: single repo handling
            throw new Error('Not done, FIX!')
        }
        return { view: gatherRepos, args: [answerKeyword]}
    }
});


module.exports = { configureRepoSearch }