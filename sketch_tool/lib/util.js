export function observable(obj) {
    // check for __observers first to avoid overwriting it
    if (!obj.hasOwnProperty('__observers')) {
        obj.__observers = new Map();
    }

    let observers = obj.__observers;

    obj.on = function (eventName, callback) {
        if (!observers.has(eventName)) {
            observers.set(eventName, new Set());
        }
        observers.get(eventName).add(callback);
    };

    obj.off = function (eventName, callback) {
        if (!observers.has(eventName)) return;
        observers.get(eventName).delete(callback);
    };

    obj.emit = function (eventName, ...args) {
        if (!observers.has(eventName)) return;
        observers.get(eventName).forEach(callback => callback(...args));
    };
}
