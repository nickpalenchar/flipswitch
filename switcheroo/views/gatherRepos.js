const chalk = require('chalk');
const {configureRepoSearch} = require("./configureRepoSearch");
const {terminal} = require('terminal-kit');
const {say} = require("../util");
const {githubAccess} = require("../githubAccess");
const {View} = require("./_abstracts");
const { exec } = require('child_process')

const { OPTIONS } = require('../options');


const gatherRepos = new View('GatherRepos', {
    run: async function(repoAccess) {
        say('Just a moment while I gather your Repos with access ' + repoAccess);
        const repos = await githubAccess.getOwnerRepos({access: repoAccess});
        const reposNeedingRename = repos.filter(repo => !repo.fork && repo.default_branch === OPTIONS.branchToChange);

        reposNeedingRename.forEach(repo => say('* ' + repo.name, repo.forks_count));
        say.newline();
        say(chalk.bold('Total qualified repos found: ') + chalk.yellow(reposNeedingRename.length));
        reposNeedingRename.length > 30 && say(chalk.dim('(you might need to scroll up to see everything)'));

        // const userResponse = await new Promise(
        //     (resolve, reject) => terminal.singleColumnMenu([
        //         "Yes - go to disclosures and final review",
        //         "No - go back to repo selection",
        //         "No - exit the program"
        //     ], function (err, response) {
        //         if (err) {
        //             reject(err);
        //         }
        //         resolve(response);
        //     }));

        const response = await terminal.singleColumnMenu([
                chalk.green("Yes - go to disclosures and final review"),
                "No - go back to repo selection",
                "No - exit the program"
            ]).promise;
        const nextViews = [{view: null /*TODO*/}, {view: configureRepoSearch}, null];
        return { view: nextViews[response.selectedIndex] }
    }
});

module.exports = { gatherRepos };