

class CliController {

    LOGLEVEL;
    c = console;
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
            this.c.debug('[ViewController] BEGIN VIEW ' + view.name)
            result = await view.run(...args);
            if (!result) {
                this.c.debug('[ViewController] nothing returned, ending sequence.');
                break;
            }
            this.c.debug('[ViewController] END VIEW ' + view.name + '\n');
            [view, args] = [result.view, result.args || [] ];
        }
    }
}

module.exports = { CliController }