const fs = require('fs');
const path = require('path');
const { Octokit } = require("@octokit/rest");
const { Cache } = require('./cache');

const { APP_NAME } = require('./configs.json')

const TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND';
const INVALID_TOKEN = 'INVALID_TOKEN';
const TOKEN_PATH = `${process.env.HOME}/.switcheroo/token`


const cache = new Cache();

class GithubAccess {

    _agent;

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
        await this._saveToken(token);
        return true;
    }

    async updateToken(token) {
        if (await this._validateToken(token)) {
            await this._saveToken(token);
            return true;
        }
    }

    getName = cache.function(async () => {
        return this._agent.users.getAuthenticated().then(res => res.data.name);
    })

    getUserDetails = cache.function(async () => {
        return this._agent.users.getAuthenticated();
    });

    async _getAccessToken() {
        if (!fs.existsSync(TOKEN_PATH)) {
            return null;
        }
        return fs.readFileSync(TOKEN_PATH).toString('utf-8');
    }

    async _saveToken(token) {
        const agent = await this._validateToken(token);
        if (!agent) {
            throw new TypeError('Invalid token');
        }
        this._agent = agent;
        cache.clear();
        !fs.existsSync(`${process.env.HOME}/.${APP_NAME}`) && fs.mkdirSync(`${process.env.HOME}/.${APP_NAME}`);
        fs.existsSync(TOKEN_PATH) && fs.unlinkSync(TOKEN_PATH)
        fs.appendFileSync(TOKEN_PATH, token, {mode: 0o622});
        return true;
    }

    async _validateToken(token) {
        const octokit = new Octokit({
            auth: token,
            userAgent: 'switcheroo v0.1.0'
        })

        try {
            await octokit.users.getAuthenticated();
            return octokit;
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