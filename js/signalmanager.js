/**
 * @typedef {Object} Signal
 * @property {number} [id]
 * @property {string} name
 * @property {string} description
 * @property {string[]} [createTime]
 * @property {SignalData[]} [data]
 */

/**
 * @typedef {Object} SignalData
 * @property {number} x
 * @property {number} y
 */

SignalManager = {

  init() {
    this.selectElements()
    this.createTable()
    this.initEvents()
    this.fillTable().then()
  },

  selectElements() {
    this.ui = {}
    this.ui.addSignalsBtn = $('#SignalManagerAdd')
    this.ui.viewSignalsBtn = $('#SignalManagerView')
  },

  initEvents() {
    this.ui.addSignalsBtn.on('click', () => {
      this.sendSelectedSignals('Adder').then()
    })
    this.ui.viewSignalsBtn.on('click', () => {
      this.sendSelectedSignals('SignalViewer').then()
    })
  },

  createTable() {
    this.ui.table = new Table({
      id: 'SignalManagerTable',
      container: $('#SignalManagerMain'),
      selectors: true,
      fields: {
        name: {
          name: 'Name',
          format: (value, object) => {
            let formattedValue = StringManager.restrictLength(value, 50)
            return `<a href="#">${formattedValue}</a>`
          },
          click: (signal) => {
            this.sendSignalToCable(signal).then()
          }
        },
        description: {
          name: 'Description',
          format: (value) => {
            let formattedValue = StringManager.onlyBeforeNewLine(value)
            formattedValue = StringManager.restrictLength(formattedValue, 200)
            return formattedValue
          }
        },
        view: {
          name: 'View signal',
          format: () => {
            return `<a href="#"><i class="fa fa-eye" aria-hidden="true"></i></a>`
          },
          click: (signal) => {
            this.sendSignals({signals: [signal], module: 'SignalViewer'}).then()
          }
        },
        del: {
          name: 'Delete signal',
          format: () => {
            return `<a href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>`
          },
          click: (title) => {
            this.deleteSignal(title).then()
          }
        }
      }
    })
  },

  async fillTable() {
    this.ui.table.makeTableRows(await ApiProvider.getJson('/signals'))
  },

  /**
   * @param {Signal} signal
   * @returns {Promise<void>}
   */
  async deleteSignal(signal) {
    await ApiProvider.del('/signals/' + signal.id)
    this.ui.table.clearAll()
    await this.fillTable()
  },

  /**
   * @param {Signal} signal
   * @returns {Promise<SignalData>}
   */
  async getSignalData(signal) {
    signal.data = await ApiProvider.getJson('/signals/' + signal.id + '/data')
  },

  /**
   * @param {Signal} signal
   */
  async sendSignalToCable(signal) {
    await this.getSignalData(signal)
    EVENTS.INIT_SIGNAL_STACK.trigger('SignalManager')
    await Workspace.startModule({
      module: 'Cable',
      param: signal
    })
  },

  /**
   * @param {Signal[]} titles
   * @param {string} module
   */
  async sendSignals({signals, module}) {
    for (let signal of signals) {
      await this.getSignalData(signal)
    }
    if (!this.checkSignalsHaveSameXValues(signals)) {
      Workspace.showAlert('Selected signal must have same X values')
      return
    }
    await Workspace.startModule({
      module,
      param: signals
    })
  },

  /**
   * @param {string} module
   */
  async sendSelectedSignals(module) {
    let signals = this.ui.table.getSelectedData()
    if (!signals.length) {
      Workspace.showAlert('No signals chosen')
      return
    }
    await this.sendSignals({signals, module})
  },

  /**
   * @param {Signal[]} signals
   */
  checkSignalsHaveSameXValues(signals) {
    let length = signals[0].data.length
    for (let signal of signals) {
      if (signal.data.length !== length) return false
    }
    for (let i = 0; i < length; i++) {
      let x = signals[0].data[i].x
      for (let signal of signals) {
        if (signal.data[i].x !== x) return false
      }
    }
    return true
  }

}
