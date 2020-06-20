const {configureRepoSearch} = require("./configureRepoSearch");
const {View} = require("./_abstracts");
const {say} = require("../util");


const permissionsReview = new View('PermissionsReview', {
    run: async function() {
        say('Lets check your permissions');
        say('we\'ll do this later..');
        return { view: configureRepoSearch }
    }
});

module.exports = { permissionsReview }