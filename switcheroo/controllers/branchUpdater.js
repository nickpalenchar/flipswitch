const { execFileSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { assert } = require('../util');

async function changeBranchNameInGit(repoUrl='', oldBranch='', newBranch='', repoName='') {
    await execFileSync(path.join(__dirname, '..', 'updateDefaultBranchInGit.bash'),
        [repoUrl, oldBranch, newBranch, repoName]);
}

async function deleteBranchOnRemote(repoDir='', branch='') {
    execFileSync(path.join(__dirname, '..', 'deleteBranchOnRemote.bash'),
        [repoDir, branch],  {shell: true});
}

function cleanUpTmpRepository(repoDir) {
    assert(typeof repoDir === 'string' && repoDir.length, 'cleanUpTmpRepository must take a non-zero string argument');
    assert(!/\.\./.test(repoDir), 'this function does not allow .. directory access');
    console.log('removingf')
    execSync(`rm -rf /tmp/${repoDir}`);
}

module.exports = { changeBranchNameInGit, deleteBranchOnRemote, cleanUpTmpRepository }