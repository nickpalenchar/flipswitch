#!/usr/local/bin/node

const chalk = require('chalk');

const screens = require('./views');
const {welcome} = require("./views/welcome");
const {CliController} = require("./cliController");
const { githubAccess: gh, INVALID_TOKEN } = require('./githubAccess');

const viewController = new CliController(3);

viewController.run(welcome)
    .then(data => console.log('goodbye'))
    .catch(err => console.log('it didnt quite work', err));