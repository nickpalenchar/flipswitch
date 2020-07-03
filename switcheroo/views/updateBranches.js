// TODO
const {View} = require("./_abstracts");
const {githubAccess} = require('../githubAccess');
const branchUpdater = require('../controllers/branchUpdater');
const {terminal} = require('terminal-kit');
const {say, assert} = require("../util");
const {options} = require('../options');

const updateBranches = new View('UpdateBranches', {
    run: async function(reposToUpdate) {
        await githubAccess.initToken();
        const progressBar = terminal.progressBar({
            // width: 80,
            title: 'Working...',
            items: reposToUpdate.length,
            percent: true,
            eta: true
        })
        let errors = [];
        for (let i = 0; i < reposToUpdate.length; i++) {
            var repo = reposToUpdate[i];
            progressBar.startItem(repo.name);
            await updateBranchOnRepo(repo, options.get('renamedBranch')) // TODO{0} - passing in options for different old/new branch rename here
            progressBar.itemDone(repo.name);
        }
        // progressBar.stop();

    }
});

async function updateBranchOnRepo(repo, newBranchName='main') {
    //TODO{0} - prompt for another name than main
    //TODO{0} - prompt for another name than master
    const oldBranchName = repo.default_branch;
    try {
        await branchUpdater.changeBranchNameInGit(repo.clone_url, oldBranchName, newBranchName, repo.name);
        await githubAccess.updateRepoDefaultBranch(repo.name, newBranchName);
        await branchUpdater.deleteBranchOnRemote(repo.name, oldBranchName);
    }
    catch (e) {
        //TODO{0} - propigate to error service?
        if (!/empty repository/.test(e.stderr)) {
            // console.error('NICK LOOK NICK LOOK')
        }
        if (e.status !== 422) {
            console.log(chalk.red('We could not update repo ' + chalk.bold(repo)));
            console.error(chalk.red('Error: ' + (e.message || e)));
            console.log(chalk.gray('We will continue to try the remaining scheduled repos'))
            // console.error(JSON.stringify(e, null, 2));
        }
        // console.error(e);
    }
    finally {
        branchUpdater.cleanUpTmpRepository(repo.name);
    }
}

module.exports = {updateBranches}