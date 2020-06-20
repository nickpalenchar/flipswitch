

class Cache {

    constructor() {
        this._cache = {}
    }

    function(fn) {
        if (fn.constructor.name === 'AsyncFunction') {
            return this._asyncFunction(fn);
        }
        return (function(...args) {
            const hash = this._hashFunction(fn, args);
            if (this._cache[hash]) {
                return this._cache[hash].returnValue;
            }
            let returnValue = fn(...args);
            this._cache[hash] = {returnValue};
            return returnValue;
        }).bind(this);
    }

    _asyncFunction(fn) {
        return (async function(...args) {
            const hash = this._hashFunction(fn, args);
            if (this._cache[hash]) {
                return this._cache[hash].returnValue;
            }
            let returnValue = await fn(...args);
            this._cache[hash] = {returnValue};
            return returnValue;
        }).bind(this);
    }

    clear() {
        this.cache = {};
    }

    _hashFunction(fn, ...args) {
        return fn.toString() + args.toString();
    }
}

module.exports = { Cache }