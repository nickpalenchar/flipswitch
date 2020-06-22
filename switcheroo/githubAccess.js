const fs = require('fs');
const path = require('path');
const { default: axios } = require('axios');
const { Octokit } = require("@octokit/rest");
const { Cache } = require('./cache');
const { assert, sleep } = require('./util');

const { APP_NAME } = require('./configs.json')

const TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND';
const INVALID_TOKEN = 'INVALID_TOKEN';
const TOKEN_PATH = `${process.env.HOME}/.switcheroo/token`
const _LIST_REPOS_ENDPOINT = 'https://api.github.com/user/repos'

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

    getAuthenticatedUserDetails = cache.function(async () => {
        /** Returns the user object of the authenticated user **/
        const response = await this._agent.users.getAuthenticated();
        return response.data;
    });

    getOwnerRepos = cache.function(async function (options) {
        assert(typeof options === 'object');

        if (options.hasOwnProperty('access')) {
            return await this._getAllRepos(options.access, 'owner');
        }
        else if (options.hasOwnProperty('single')) {
            // TODO: get single repo only
        }
        else {
            throw new ReferenceError(`don't know what to do with ${access}`);
        }
    }.bind(this));

    async updateRepoDefaultBranch(repo, newBranchName) {
        const owner = await this.getAuthenticatedUserDetails().then(u => u.login);
        // TODO{0} - check that branch does not already exist.
        try {
            await this._agent.repos.update({
                owner,
                repo,
                default_branch: newBranchName
            });
        }
        catch (e) {
            console.log(e) // TODO{0} - graceful error handling.
        }
    }

    async getRepo(owner, repo) {
        return this._agent.repos.get({owner, repo}).then(r => r.data);
    }

    async _getAllRepos(visibility='all', affiliation='owner,collaborator,organization_member') {
        /** Get's all repos, setting optional visibility according to
         *  Github api params https://developer.github.com/v3/repos/
         */
        let totalRepos = [];
        let lastPage = false, i = 1;
        while(!lastPage) {
            var result = await this._getReposAtPage(i, visibility, affiliation);
            totalRepos = totalRepos.concat(result.repos);
            lastPage = result.lastPage;
            i++;
            if (i % 4 === 0) {
                await sleep(1000);
            }
            if (i > 100) {
                console.warn("Ending calls to repos because its been over 100 requests. There could be something wrong here.");
                break;
            }
        }
        return totalRepos;
    };

    async _getReposAtPage(page=1, visibility='all', affiliation='owner,collaborator,organization_member') {
        const username = await this.getAuthenticatedUserDetails().then(d => d.login);
        const password = await this._getAccessToken();
        const response = await axios.request({
            url: _LIST_REPOS_ENDPOINT, auth: {username, password},
            params: {affiliation, visibility, page}
        });

        assert(response.headers.hasOwnProperty('link'), 'Response from github needs a Link header');
        const lastPage = !/rel="last"/.test(response.headers.link);
        return  {
            lastPage,
            repos: response.data
        }
    }

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
        });

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