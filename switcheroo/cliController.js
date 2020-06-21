const chalk = require('chalk')
const {assert} = require('./util');

class CliController {

    LOGLEVEL;
    c = {
        log: console.log,
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error
    };
    noop = () => undefined;

    constructor(level=1) {
        level = level === 'debug' ? 2 : level;

        if (level < 3) {
            // LOG LEVEL 2
            this.c.log = this.noop;
            this.c.debug = this.noop;
        }
        if (level < 2) {
            // LOG LEVEL 1
            this.c.warn = this.noop;
        }
        if (level < 1) {
            // LOG LEVEL 0
            this.c.error = this.noop;
        }

        // LOG LEVEL 3 (none of the previous if statements run; all log methods run)
    }

    async run(view, ...args) {
        if (!view) {
            this.c.warn('ViewController WARN: nothing to run')
        }

        let result;

        while(view) {
            this.c.debug(chalk.yellow('[ViewController] BEGIN VIEW ') + chalk.bgYellow(' '+view.name+' ') +
                (args.length ? chalk.red(` args = ${args}`) : ''));
            result = await view.run(...args);
            if (!result) {
                this.c.debug('[ViewController] nothing returned, ending sequence.');
                break;
            }
            this.c.debug('[ViewController] END VIEW ' + view.name + '\n');
            [view, args] = [result.view, result.args || [] ];
            assert(Array.isArray(args), 'Returning a view object with args: args must be an array of arguments')
        }
        process.exit(0);
    }
}

module.exports = { CliController }