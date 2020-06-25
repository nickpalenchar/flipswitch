const { terminal } = require('terminal-kit');


const ask = {
    singleColumnMenu: async function(choices, options) {
        // A thin wrapper around terminal.singleColumnMenu that has some preferred options by default
        // Most importantly, it allows for cancelling using CTRL+C, which can either return `null` or exit
        // the process entirely.

        // custom option exitOnCancel - makes ctrl+c invoke process.exit() rather than return null
        const { exitOnCancel } = options;
        delete options.exitOnCancel;

        const defaultOptions = {cancelable: true,  keyBindings: {
            'DOWN': 'next',
            'UP': 'previous',
            'CTRL_C': 'escape',
            'ENTER': 'submit',
            'KP_ENTER': 'submit'
        }};
        const finalOptions = Object.assign({}, defaultOptions, options);

        const answer = await terminal.singleColumnMenu(choices, finalOptions).promise;

        if (answer.canceled && exitOnCancel) {
            process.exit(128);
        }


        return answer;
    }
}




function say(...args) {
    console.log(...args);
}

say.warn = console.warn;
say.error = console.warn;
say.debug = console.debug;
say.info = console.info;
say.log = console.log;
say.newline = () => console.log();


class AssertionError extends Error {}

function assert(expression, message) {
    if (!expression) {
        throw new AssertionError(`The following assertion failed: ${message}`);
    }
}

async function sleep(milliseconds) {
    return new Promise((resolve, reject) => {
        if (milliseconds < 0) {
            reject('must sleep for 0 or greater milliseconds');
        }
        setTimeout(resolve, milliseconds);
    })
}

module.exports = { say, ask, assert, sleep };