const {configureRepoSearch} = require("./configureRepoSearch");
const {say, ask} = require("../util");
const {View} = require("./_abstracts");
const chalk = require('chalk')
const {options} = require ('../options');
const {APP_NAME} = require('../configs.json');

const configureBranchToUpdate = new View('ConfigureBranchToUpdate', {
    run: async function() {

        say(`Enter the branch name ${APP_NAME} will look for when scanning your repos (it's usually the default option)`);
        let branchToChange = await ask.inputField({default: options.get('branchToChange')});
        options.set('branchToChange', branchToChange);

        say.newline();
        say(`What should repo's who's default branch is ${options.get('branchToChange')} be named instead?`);
        let renamedBranch = await ask.inputField({default: options.get('renamedBranch')});
        options.set('renamedBranch', renamedBranch);
        say.newline()
        if (options.get('renamedBranch') === options.get('branchToChange')) {
            say.newline();
            say(chalk.red('Renaming a branch to itself isn\'t going to do anything.'));
            return { view: configureBranchToUpdate }
        }
        return { view: configureRepoSearch }
    }
});

module.exports = { configureBranchToUpdate };