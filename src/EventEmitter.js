/**
 * Class to recreate the $emit() and .on('event',()=>{}) style event emitter from Node.js
 */
export default class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }

  $emit(event, data) {
    let cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach((cb) => cb(data));
    }
  }

  onStageEvent(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }

  $emitStageEvent(event, data) {
    let cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach((cb) => cb(data));
    }
  }
}
