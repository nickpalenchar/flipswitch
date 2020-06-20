
class View {
    run = undefined;
    constructor(config) {
        if (typeof config.run !== 'function') {
            throw new TypeError('View class must have config.run defined as a function')
        }
        this.run = config.run;
    }
}


module.exports = { View }