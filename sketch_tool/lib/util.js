// TODO: change this to `import { EventEmitter } from 'events'` once that is
// supported by SystemJS (see https://github.com/systemjs/systemjs/issues/334)
import events from 'events';
let EventEmitter = events.EventEmitter;

export function observable(obj) {
    // Check for __eventEmitter first to avoid overwriting it
    if (obj.hasOwnProperty('__eventEmitter')) return;

    let emitter = obj.__eventEmitter = new EventEmitter();

    // Expose a subset of the EventEmitter interface on the object itself
    obj.on = emitter.on.bind(emitter);
    obj.off = emitter.removeListener.bind(emitter);
    obj.emit = emitter.emit.bind(emitter);
    obj.once = emitter.once.bind(emitter);
}
