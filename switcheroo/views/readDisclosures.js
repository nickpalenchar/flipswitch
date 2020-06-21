const chalk = require("chalk");
const {updateBranches} = require("./updateBranches");
const {terminal} = require('terminal-kit')

const {View} = require("./_abstracts");
const {say} = require("../util");
const { GITHUB_DEFAULT_BRANCH_TOPIC_URL, LEGAL_DISCLOSURE } = require('../configs.json');
const { OPTIONS } = require('../options');


const readDisclosures = new View('ReadDisclosures', {
    run: async function(reposToUpdate=[]) {
        say("We're just about ready to update your default branches!");
        say.newline();
        say(chalk.red("But first please review the following notices:"));
        say.newline();
        say(chalk.inverse('Warning: Update the default branch'))
        say(`Changing your default branch can have unintended consequences that can affect new pull requests and clones. (More info: ${GITHUB_DEFAULT_BRANCH_TOPIC_URL})`);
        say.newline();
        say(chalk.inverse('Disclosure: You are using alpha-status software.'))
        say('This is a fancy way of saying that this program is for experimental use and is not consider suitable ' +
            'for production environments. While the author would love to assure you it\'s fine to use, understand the consequences before' +
            'proceeding')
        say.newline();
        say('Legally speaking:');
        say(LEGAL_DISCLOSURE);
        say.newline();
        say.newline();
        say(`Update the default branch in ${chalk.yellow(reposToUpdate.length)} repos from ${chalk.red(OPTIONS.branchToChange)} to ${chalk.green(OPTIONS.renamedBranch)}?`);

        const answer = await terminal.singleColumnMenu([
            chalk.red(' Yes - I\'ve read the above disclosures & understand the consequences '),
            ' No - select different repos ',
            ' No - exit the program ']).promise;

        if (answer.selectedIndex === 0) {
            return {view: updateBranches, args: [reposToUpdate] }
        }
    }
});

module.exports = { readDisclosures };