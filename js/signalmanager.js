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
  },

  initEvents() {
    this.ui.addSignalsBtn.on('click', () => {
      this.addSignals().then()
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
            this.sendSignal({title, module: 'Cable'}).then()
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
            this.sendSignal({title, module: 'SignalViewer'}).then()
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

  async deleteSignal(title) {
    await ApiProvider.del('/signals/' + title.id)
    this.ui.table.clearAll()
    await this.fillTable()
  },

  async getSignal(title) {
    let data = await ApiProvider.getJson('/signaldata/' + title.id)
    return {title, data}
  },

  async getSignalData(title) {
    return await ApiProvider.getJson('/signaldata/' + title.id)
  },

  async sendSignal({title, module}) {
    let signal = await this.getSignal(title)
    await Workspace.startModule({
      module,
      param: signal
    })
  },

  async addSignals() {
    let selectedSignalsTitle = this.ui.table.getSelectedData()
    if (!selectedSignalsTitle.length) {
      Workspace.showAlert('No signals chosen')
      return
    }
    let selectedSignalsData = []
    for (let title of selectedSignalsTitle) {
      selectedSignalsData.push(await this.getSignalData(title))
    }
    if (!this.checkSignalsHaveSameXValues(selectedSignalsData)) {
      Workspace.showAlert('Selected signal must have same X values')
      return
    }
    await Workspace.startModule({
      module: 'Adder',
      param: selectedSignalsData
    })
  },

  checkSignalsHaveSameXValues(signalsData) {
    let length = signalsData[0].length
    for (let data of signalsData) {
      if (data.length !== length) return false
    }
    for (let i = 0; i < length; i++) {
      let x = signalsData[0][i].x
      for (let data of signalsData) {
        if (data[i].x !== x) return false
      }
    }
    return true
  }

}
