const chalk = require('chalk');
const { githubAccess, INVALID_TOKEN } = require('../githubAccess');
const {addAccessToken} = require("./initAccessToken");
const {View, makeView} = require("./_abstracts");

const welcome = new View( 'Welcome', {
    run: async function() {
        console.log(chalk.magenta("W E L C O M E T O F L I P S W I T C H\n"));
        return { view: addAccessToken }
    }
});


module.exports = { welcome }