const chalk = require('chalk')
const {githubAccess, INVALID_TOKEN} = require("../githubAccess");
const prompt = require('prompt-sync')();
const {View} = require("./_abstracts");

const requestAccessToken = new View('RequestAccessToken', {
    /** Provides prompt for access token and verifies **/

    run: async function() {
        console.log('\nYou will need to create a personal access token!')
        console.log(chalk.blue('https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line'));
        let token;
        while (true) {
            token = prompt.hide('Personal access token (hidden): ');
            if(await githubAccess.updateToken(token) === true) {
                const name = await githubAccess.getName();
                console.log(chalk.green(`~ welcome, ${name} ~`));
                break;
            }
            console.log(chalk.yellow('That didn\'t quite work. Make sure the token is valid'));
            console.log('Would you like to try again?');
            if (!/y/i.test(prompt('[y/N]: '))) {
                return null;
            }
        }
        return { view: initAccessToken }
    }
})

const initAccessToken = new View('InitAccessToken', {
    /** Tries to get a token, if unable, requests it via `requestAccessToken` **/

    run: async function() {
        const accessStatus = await githubAccess.initToken();
        if (accessStatus === "INVALID_TOKEN") {
            return { view: requestAccessToken }
        }
        return { view: confirmUser }
    }
});

const confirmUser = new View('ConfirmUser', {
    run: async function() {
        console.log(await githubAccess.getUserDetails());
        console.log('bye');
        return null;
    }
});


module.exports = { addAccessToken: initAccessToken };