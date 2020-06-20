const {View} = require("./_abstracts");
const {GITHUB_ISSUE_NEW_URL} = require('../configs.json')

class Error extends View {

    run(error, hint) {
        if (!error) {
            console.log(chalk.red('Error: ') + 'an unknown error occured.')
            console.log(`Consider raising an issue describing what happened at ${GITHUB_ISSUE_NEW_URL}`)
        }
        console.log(chalk.red('Error: ') + error)
        hint && console.log(chalk.yellow(`hint: ${hint}`))
    }
}

module.exports = { Error }