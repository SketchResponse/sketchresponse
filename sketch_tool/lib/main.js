import { baseWithMixins } from './util';
import events from 'events';
let EventEmitter = events.EventEmitter;

console.log('Hello from main.js');


class Foo extends baseWithMixins(Object, EventEmitter) { }

window.f = new Foo();
console.log(f)


export const x = 42;

export const uniqueString = 'FzOuMQojy7';

export default () => x;
