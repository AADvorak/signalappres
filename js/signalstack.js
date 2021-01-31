SignalStack = {

  signals: [],
  initiator: '',

  init() {
    this.initEvents()
  },

  initEvents() {
    EVENTS.INIT_SIGNAL_STACK.subscribe(this, 'initStack')
  },

  initStack(initiator) {
    this.signals = []
    this.initiator = initiator
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