SignalStack = {

  signals: [],

  init() {
    this.initEvents()
  },

  initEvents() {
    EVENTS.CLEAR_SIGNAL_STACK.subscribe(this, 'clear')
  },

  clear() {
    this.signals = []
  },

  /**
   * @param {Signal} signal
   */
  addSignal(signal) {
    this.signals.push(signal)
  },

  /**
   * @returns {Signal}
   */
  takeLastSignal() {
    return this.signals.pop()
  }

}