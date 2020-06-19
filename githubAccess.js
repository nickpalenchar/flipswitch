const fs = require('fs');
const path = require('path');

class GithubAccess {
    static getAccessToken() {

    }
}

module.exports = {
    getAccessToken: async () => {
        if (fs.existsSync(`${process.env.HOME}/.switcheroo/token`)) {
            return null;
        }

    }
}