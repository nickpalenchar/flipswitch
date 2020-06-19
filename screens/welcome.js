const chalk = require('chalk');
const { githubAccess, INVALID_TOKEN } = require('../githubAccess');
let hi = require('./addAccessToken');

async function main() {
    console.log(chalk.blue("W E L C O M E T O S W I T C H E R O O\n"));

    const accessStatus = await githubAccess.initToken();
    if (accessStatus === INVALID_TOKEN) {
        return hi();
    }

}

module.exports = main;