class AppEvent {

  constructor() {
    this._subscribers = []
  }

  subscribe(obj, funcName) {
    this._subscribers.push({obj, funcName})
  }

  unsubscribe(obj) {
    for (let i = 0; i < this._subscribers.length; i++) {
      if (obj === this._subscribers[i].obj) this._subscribers.splice(i, 1)
    }
  }

  trigger(param) {
    for (let subscriber of this._subscribers) {
      subscriber.obj[subscriber.funcName](param)
    }
  }

}

EVENTS = {

  /**
   * modules list is loaded from DB
   */
  MODULES_LOADED: new AppEvent(),

  /**
   * modules list is changed in DB
   */
  MODULES_CHANGED: new AppEvent(),

  /**
   * Signal stack need to be cleared
   */
  INIT_SIGNAL_STACK: new AppEvent()

}