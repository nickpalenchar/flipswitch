

class ViewController {

    async run(view, ...args) {
        if (!view) {
            console.warn('ViewController WARN: nothing to run')
        }

        let result;

        while(view) {
            result = await view.run(...args);
            if (!result) {
                break;
            }
            [view, args] = [result.view, result.args || [] ];
        }
    }
}

module.exports = { ViewController }