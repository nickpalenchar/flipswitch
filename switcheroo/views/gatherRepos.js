const chalk = require('chalk');
const {readDisclosures} = require("./readDisclosures");
const {configureRepoSearch} = require("./configureRepoSearch");
const {terminal} = require('terminal-kit');
const {say, ask} = require("../util");
const {githubAccess} = require("../githubAccess");
const {View} = require("./_abstracts");
const { exec } = require('child_process')
const {Spinner} = require('cli-spinner')

const { options } = require('../options');


const gatherRepos = new View('GatherRepos', {
    run: async function(repoAccess) {
        const spinner = new Spinner('Just a moment while I gather your Repos with access ' + repoAccess);
        spinner.setSpinnerString(12);
        spinner.start();
        let repos;
        try {
            repos = await githubAccess.getOwnerRepos({access: repoAccess});
        } catch(e) {
            if (e.response.status === 401) {
                console.log(e.config.headers['X-Accepted-OAuth-Scopes'])
                say.newline();
                say(chalk.red('Error, you don\'t have correct permissions for this scope.'));
                say('Generate a new token and try again.')
                process.exit(1);
            }
            process.exit(1);
        }
        const reposNeedingRename = repos.filter(repo => !repo.fork && repo.default_branch === options.get('branchToChange'));

        reposNeedingRename.forEach(repo => say('* ' + repo.name));
        spinner.stop(false);
        say.newline();
        say(chalk.bold('Total qualified repos found: ') + chalk.yellow(reposNeedingRename.length));
        reposNeedingRename.length > 30 && say(chalk.dim('(you might need to scroll up to see everything)'));

        const response = await ask.singleColumnMenu([
                "Yes - go to disclosures and final review",
                "No - go back to repo selection",
                "No - exit the program"
            ], {exitOnCancel: true});
        const nextViews = [{view: readDisclosures, args: [reposNeedingRename] }, {view: configureRepoSearch}, null];
        return nextViews[response.selectedIndex];
    }
});

module.exports = { gatherRepos };