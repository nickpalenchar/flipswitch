const chalk = require('chalk');
const {readDisclosures} = require("./readDisclosures");
const {configureRepoSearch} = require("./configureRepoSearch");
const {terminal} = require('terminal-kit');
const {say} = require("../util");
const {githubAccess} = require("../githubAccess");
const {View} = require("./_abstracts");
const { exec } = require('child_process')
const {Spinner} = require('cli-spinner')

const { OPTIONS } = require('../options');


const gatherRepos = new View('GatherRepos', {
    run: async function(repoAccess) {
        // say('Just a moment while I gather your Repos with access ' + repoAccess);
        const spinner = new Spinner('Just a moment while I gather your Repos with access ' + repoAccess);
        spinner.setSpinnerString(12);
        spinner.start();
        const repos = await githubAccess.getOwnerRepos({access: repoAccess});
        const reposNeedingRename = repos.filter(repo => !repo.fork && repo.default_branch === OPTIONS.branchToChange);

        reposNeedingRename.forEach(repo => say('* ' + repo.name, repo.forks_count));
        spinner.stop(false);
        say.newline();
        say(chalk.bold('Total qualified repos found: ') + chalk.yellow(reposNeedingRename.length));
        reposNeedingRename.length > 30 && say(chalk.dim('(you might need to scroll up to see everything)'));

        const response = await terminal.singleColumnMenu([
                chalk.green("Yes - go to disclosures and final review"),
                "No - go back to repo selection",
                "No - exit the program"
            ]).promise;
        const nextViews = [{view: readDisclosures, args: [reposNeedingRename] }, {view: configureRepoSearch}, null];
        return nextViews[response.selectedIndex];
    }
});

module.exports = { gatherRepos };