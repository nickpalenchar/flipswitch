#!/usr/local/bin/node

const chalk = require('chalk');

const screens = require('./screens');
const { githubAccess: gh, INVALID_TOKEN } = require('./githubAccess');


// gh.initToken()
//     .then(data => {
//         if (data === INVALID_TOKEN) {
//             console.log('We will need you to create a personal github access token');
//             console.log('https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line')
//         }
//     });


screens.welcome()
.then(data => console.log('goodbye'))
.catch(err => console.log('it didnt quite work', err))