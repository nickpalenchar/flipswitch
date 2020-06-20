

function say(...args) {
    console.log(...args);
}

say.warn = console.warn;
say.error = console.warn;
say.debug = console.debug;
say.info = console.info;
say.log = console.log;

module.exports = { say };