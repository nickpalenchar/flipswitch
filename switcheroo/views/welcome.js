const chalk = require('chalk');
const { githubAccess, INVALID_TOKEN } = require('../githubAccess');
const {addAccessToken} = require("./initAccessToken");
const {View, makeView} = require("./_abstracts");

const welcome = new View( 'Welcome', {
    run: async function() {
        console.log(chalk.blue("W E L C O M E T O S W I T C H E R O O\n"));
        return { view: addAccessToken }

    }
})


module.exports = { welcome }