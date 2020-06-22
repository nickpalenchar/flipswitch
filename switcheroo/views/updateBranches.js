// TODO
const {View} = require("./_abstracts");
const {githubAccess} = require('../githubAccess');
const branchUpdater = require('../controllers/branchUpdater');
const {say} = require("../util");

const updateBranches = new View('UpdateBranches', {
    run: async function(reposToUpdate) {
        await githubAccess.initToken();
        let errors = [];
        for (let i = 0; i < reposToUpdate.length; i++) {
            var repo = reposToUpdate[i];
            say(`updating ${repo.name}`);
            await updateBranchOnRepo(repo) // TODO{0} - passing in options for different old/new branch rename here
        }
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
        console.error(e);
    }
    finally {
        branchUpdater.cleanUpTmpRepository(repo.name);
    }
}

module.exports = {updateBranches}