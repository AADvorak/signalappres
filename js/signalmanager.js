/**
 * @typedef {Object} Signal
 * @property {SignalTitle} title
 * @property {SignalData[]} data
 */

/**
 * @typedef {Object} SignalTitle
 * @property {number} id
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} SignalData
 * @property {string} x
 * @property {string} y
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
            return `<a href="#">${value}</a>`
          },
          click: (title) => {
            this.sendSignalToCable(title).then()
          }
        },
        description: {name: 'Description'},
        createTime: {
          name: 'Create time',
          format: (value, object) => {
            return `${value[2]}.${value[1]}.${value[0]} ${value[3]}:${value[4]}:${value[5]}`
          }
        },
        view: {
          name: 'View signal',
          format: () => {
            return `<a href="#"><i class="fa fa-eye" aria-hidden="true"></i></a>`
          },
          click: (title) => {
            this.sendSignals({titles: [title], module: 'SignalViewer'}).then()
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
   * @param {SignalTitle} title
   * @returns {Promise<void>}
   */
  async deleteSignal(title) {
    await ApiProvider.del('/signals/' + title.id)
    this.ui.table.clearAll()
    await this.fillTable()
  },

  /**
   * @param {SignalTitle} title
   * @returns {Promise<Signal>}
   */
  async getSignal(title) {
    let data = await this.getSignalData(title)
    return {title, data}
  },

  /**
   * @param {SignalTitle} title
   * @returns {Promise<SignalData>}
   */
  async getSignalData(title) {
    return await ApiProvider.getJson('/signaldata/' + title.id)
  },

  /**
   * @param {SignalTitle} title
   */
  async sendSignalToCable(title) {
    let signal = await this.getSignal(title)
    EVENTS.CLEAR_SIGNAL_STACK.trigger()
    await Workspace.startModule({
      module: 'Cable',
      param: signal
    })
  },

  /**
   * @param {SignalTitle[]} titles
   * @param {string} module
   */
  async sendSignals({titles, module}) {
    let signals = []
    for (let title of titles) {
      signals.push(await this.getSignal(title))
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
    let titles = this.ui.table.getSelectedData()
    if (!titles.length) {
      Workspace.showAlert('No signals chosen')
      return
    }
    await this.sendSignals({titles, module})
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
