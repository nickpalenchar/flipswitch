#!/usr/local/bin/node

const chalk = require('chalk');

const screens = require('./views');
const {welcome} = require("./views/welcome");
const {ViewController} = require("./menuController");
const { githubAccess: gh, INVALID_TOKEN } = require('./githubAccess');

const viewController = new ViewController;

viewController.run(welcome)
    .then(data => console.log('goodbye'))
    .catch(err => console.log('it didnt quite work', err));