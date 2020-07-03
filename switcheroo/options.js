// Unlike config.json, these include options that can be modified by the end user


let OPTIONS = {
    branchToChange: 'master',
    renamedBranch: 'main'
}

const options = {
    get: function(option) {
        return OPTIONS[option];
    },
    set: function(option, value) {
        OPTIONS[option] = value;
    }

}

module.exports = { options }