const chalk = require("chalk");
const {configureRepoSearch} = require("./configureRepoSearch");
const {updateBranches} = require("./updateBranches");
const {terminal} = require('terminal-kit')
const {welcome} = require('./welcome')
const {View} = require("./_abstracts");
const {say, ask} = require("../util");
const { GITHUB_DEFAULT_BRANCH_TOPIC_URL, LEGAL_DISCLOSURE, DOCS_LOCAL_BRANCH_UPDATE_URL, APP_NAME } = require('../configs.json');
const { options } = require('../options');


const readDisclosures = new View('ReadDisclosures', {
    run: async function(reposToUpdate=[]) {
        say("We're just about ready to update your default branches!");
        say.newline();
        say(chalk.red("But first please review the following notices:"));
        say.newline();
        say(chalk.inverse('Warning: Updating the default branch'))
        say(`Changing your default branch can have unintended consequences that can affect new pull requests and clones. (More info: ${GITHUB_DEFAULT_BRANCH_TOPIC_URL})`);
        say.newline();
        say(chalk.inverse('Disclosure: You are using preview-status software.'))
        say('This is a fancy way of saying that this program is for experimental use and is not consider suitable ' +
            'for production environments. While the author would love to assure you it\'s fine to use, understand the consequences before ' +
            'proceeding')
        say.newline();
        say(LEGAL_DISCLOSURE);
        say.newline();
        say(chalk.yellow(chalk.inverse('If you have a local clone of a repo, you will need to update the branch yourself.')))
        say('Read more about this process here: ' + DOCS_LOCAL_BRANCH_UPDATE_URL)
        say(chalk.gray('You can always revere the process with ' + APP_NAME + ' by switching the default branch and renamed branch in the prompts'))
        say.newline();
        say(`Update the default branch in ${chalk.yellow(reposToUpdate.length)} repos from ${chalk.red(options.get('branchToChange'))} to ${chalk.green(options.get('renamedBranch'))}?`);

        const answer = await ask.singleColumnMenu([
            chalk.red(' Yes - I\'ve read the above disclosures & understand the consequences '),
            ' No - select different repos ',
            ' No - exit the program '], {
            exitOnCancel: false
        });

        //TODO{0} - Remove the slice (10)
        if (answer.selectedIndex === 0) {
            return {view: updateBranches, args: [reposToUpdate] }
        }
        if (answer.selectedIndex === 1) {
            return {view: require('./configureRepoSearch').configureRepoSearch, args: [] }
        }

    }
});

module.exports = { readDisclosures };