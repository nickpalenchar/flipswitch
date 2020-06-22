const chalk = require('chalk');
const {readDisclosures} = require("./readDisclosures");
const {githubAccess} = require("../githubAccess");
const {gatherRepos} = require("./gatherRepos");
const {updateBranches} = require("./updateBranches");
const {say, sleep} = require("../util");
const {View} = require("./_abstracts");
const {APP_NAME} = require('../configs.json');
const {OPTIONS} = require('../options');
const {terminal} = require('terminal-kit')

const configureRepoSearch = new View('ConfigureRepoSearch', {
    run: async function() {
        say(chalk.blue(`${APP_NAME} can rename branches on your repositories that are public, private, or both. You can also test with just an individual one.
        Which would you prefer?`));
        const choices = {
            'Public and private repos (most dangerous)': 'all',
            'Public repos only': 'public',
            'Private repos only': 'private',
            'Specify one repo (safest)': 'single'
        }

        const userResponse = await new terminal.singleColumnMenu(Object.keys(choices));

        const answerKeyword = choices[userResponse.selectedText];
        if (answerKeyword === 'single') {
            return { view: configureRepoSearch }
        }
        return { view: gatherRepos, args: [answerKeyword]}
    }
});

const configureSingleRepo = new View('ConfigureSingleRepo', {
    run: async function() {
        say(`Enter the repo URL (example: https://github.com/nickpalenchar/${APP_NAME}`)
        terminal('GitHub URL: ')
        const response = await terminal.inputField('').promise;
        try {
            const [ owner, repo ] = response.match(/(?:https?:\/\/)?github.com\/([a-zA-Z0-9_.-]*)\/([a-zA-Z0-9_.-]*)/).slice(1,3);
            console.log();
            console.log('inputzzz', owner, repo)
            var repoToUpdate = await githubAccess.getRepo(owner, repo);
        }
        catch (e) {
            console.error(e);
            await sleep(400);
            return { view: handleSingleRepoQueryError, args: ['Something went WRANG']}
        }
        const checks = checkRepoMeetsRequirements(repoToUpdate);
        if (checks === 'DEFAULT_BRANCH_MISMATCH') {
            await sleep(400);
            return { view: handleSingleRepoQueryError,
                args: [`The provided repo's default branch (${repoToUpdate.default_branch}) does not match the default branch name to update (${OPTIONS.branchToChange}). Please try a different Repo`]};
        }
        if (checks === 'NON_ADMIN_PERMISSIONS') {
            await sleep(400)
            return { view: handleSingleRepoQueryError,
                args: [`You (or the provided access token) does not have administrative permissions to update the provided repo. Please try a different repo, or re-authenticate with a different access token`]}
        }
        if (checks === true) {
            return { view: readDisclosures, args: [[repoToUpdate]] }
        }
    }
});

function checkRepoMeetsRequirements(repoData) {
    if (repoData.default_branch !== OPTIONS.branchToChange) {
        return 'DEFAULT_BRANCH_MISMATCH';
    }
    if (!repoData.permissions.admin) {
        return 'NON_ADMIN_PERMISSIONS';
    }
    return true;
}

const handleSingleRepoQueryError = new View('HandleSingleRepoQueryError', {
    run: async function(errorMessage='An unknown error occurred!') {
        say.newline();
        say(chalk.red(`Error: ${errorMessage}`));
        say.newline();
        say('Make sure you are formatting the url correctly. Enter the full URL.')
        say('What would you like to do?');

        const choicesToViews = {
            'Try entering again': configureSingleRepo,
            'Choose a different repo search option': configureRepoSearch,
            'Quit the program': null
        }

        const { selectedText } = await terminal.singleColumnMenu(Object.keys(choicesToViews)).promise;
        return { view: choicesToViews[selectedText] };
    }
})


module.exports = { configureRepoSearch, configureSingleRepo }