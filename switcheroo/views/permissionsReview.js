const {configureBranchToUpdate} = require("./configureBranchToUpdate");
const {View} = require("./_abstracts");
const {say} = require("../util");
const {githubAccess: gh} = require('../githubAccess');
const {APP_NAME} = require('../configs.json')
const chalk = require('chalk');


const permissionsReview = new View('PermissionsReview', {
    run: async function() {
        // say('Lets check your permissions');
        // say('we\'ll do this later..');
        const scopes = await gh.getOAuthScopes();
        if (scopes.includes('repo')) {
            return { view: configureBranchToUpdate };
        }
        if (scopes.includes('public_repo')) {
            say(chalk.yellow('You\'ve granted limited permissions and will only be able to select a single repo'));
            say(chalk.gray('To use the other options, generate a new token with the scope ' + chalk.bold('repos') + '.'))
            return {view: configureBranchToUpdate};
        }

        say(chalk.red('You haven\'t granted enough permissions to use ' + APP_NAME));
        say(chalk.gray('Current permissions: ' + scopes.join(', ')));
        say(chalk.grey('Generate a new token with at least ' + chalk.bold('public_repo') + ' access. ('+chalk.bold('repo')+' access is recommended)'));
    }
});

module.exports = { permissionsReview }