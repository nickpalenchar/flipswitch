const {View} = require("./_abstracts");
const {say} = require("../util");


const permissionsReview = new View('PermissionsReview', {
    run: async function() {
        say('Lets check your permissions');
    }
});

module.exports = { permissionsReview }