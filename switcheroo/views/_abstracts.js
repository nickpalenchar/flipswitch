
class View {
    run = undefined;

    constructor(name, config) {
        if (typeof name !== 'string') {
            throw new TypeError('View class needs a name as a string.')
        }
        if (typeof config.run !== 'function') {
            throw new TypeError('View class must have config.run defined as a function')
        }
        this.name = name;
        this.run = config.run;
    }
}


module.exports = { View }