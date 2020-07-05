#!/usr/local/bin/node

const chalk = require('chalk');

const screens = require('./views');
const {GITHUB_ISSUE_NEW_URL} = require('./configs.json');
const {configureSingleRepo} = require("./views/configureRepoSearch");
const {updateBranches} = require("./views/updateBranches");
const {welcome} = require("./views/welcome");
const {CliController} = require("./cliController");
const { githubAccess: gh, INVALID_TOKEN } = require('./githubAccess');


gh.initToken();
const viewController = new CliController(0);
viewController.run(welcome)
.then(data => console.log('goodbye'))
    .catch(err => {
        console.log('An unexpected error!', err);
        console.log('Please consider opening an issue and include as much info as nescessary (stacktrace, OS, actions you took, last screen you were on)')
        console.log(GITHUB_ISSUE_NEW_URL);
        process.exit(err.code || 1);
    });