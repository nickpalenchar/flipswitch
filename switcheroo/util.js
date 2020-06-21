

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

module.exports = { say, assert, sleep };