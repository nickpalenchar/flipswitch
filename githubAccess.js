const fs = require('fs');
const path = require('path');
const { Octokit } = require("@octokit/rest");

const TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND';
const INVALID_TOKEN = 'INVALID_TOKEN';


class GithubAccess {

    constructor(path=`${process.env.HOME}/.switcheroo/token`) {
        this.tokenPath = path;
    }

    async initToken() {
        // inits the token at self.tokenPath and verifies it works.
        const token = await this._getAccessToken();
        if (!token) {
            return TOKEN_NOT_FOUND;
        }
        const isValid = await this._validateToken(token);
        if (!isValid) {
            return INVALID_TOKEN;
        }

    }

    async _getAccessToken() {
        console.log(`${process.env.HOME}/.switcheroo/token`)
        if (!fs.existsSync(`${process.env.HOME}/.switcheroo/token`)) {
            return null;
        }
        return '123';
    }

    async _validateToken(token) {
        const octokit = new Octokit({
            auth: token,
            userAgent: 'switcheroo v0.1.0'
        })

        try {
            await octokit.users.getAuthenticated();
            return true;
        } catch (e) {
            return false;
        }
    }

}

githubAccess = new GithubAccess();

module.exports = {
    githubAccess,
    INVALID_TOKEN,
    TOKEN_NOT_FOUND
}