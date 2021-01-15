SignalGenerator = {

  SIGNAL_FORMS: {
    sine: ({x, period, amplitude, offset}) => {
      return offset + amplitude * Math.sin(x * 2 * Math.PI / period)
    },
    square: ({x, period, amplitude, offset}) => {
      return Math.sin(x * 2 * Math.PI / period) >= 0 ? offset + amplitude : offset - amplitude
    },
    triangle: ({x, period, amplitude, offset}) => {
      return offset + (2 * amplitude / Math.PI) * Math.asin(Math.sin(x * 2 * Math.PI / period))
    },
    sawtooth: ({x, period, amplitude, offset}) => {
      return offset + (2 * amplitude / Math.PI) * Math.atan(Math.tan(x * Math.PI / period))
    }
  },

  init() {
    this.selectElements()
    this.fillFormSelector()
    this.initEvents()
  },

  selectElements() {
    this.ui = {}
    this.ui.beginInp = $('#SignalGeneratorBegin')
    this.ui.lengthInp = $('#SignalGeneratorLength')
    this.ui.stepInp = $('#SignalGeneratorStep')
    this.ui.periodInp = $('#SignalGeneratorPeriod')
    this.ui.amplitudeInp = $('#SignalGeneratorAmplitude')
    this.ui.offsetInp = $('#SignalGeneratorOffset')
    this.ui.formSel = $('#SignalGeneratorForm')
    this.ui.saveBtn = $('#SignalGeneratorSave')
    this.ui.fileInp = $('#SignalGeneratorFile')
  },

  fillFormSelector() {
    for (let form in this.SIGNAL_FORMS) {
      this.ui.formSel.append(`<option>${form}</option>`)
    }
  },

  initEvents() {
    this.ui.saveBtn.on('click', () => {
      this.generateAndOpenSaver(this.getFormValues())
    })
    this.ui.fileInp.on('change', () => {
      this.importFromFile().then()
    })
  },

  getFormValues() {
    let ui = this.ui
    return {
      begin: parseFloat(ui.beginInp.val()),
      length: parseFloat(ui.lengthInp.val()),
      step: parseFloat(ui.stepInp.val()),
      period: parseFloat(ui.periodInp.val()),
      amplitude: parseFloat(ui.amplitudeInp.val()),
      offset: parseFloat(ui.offsetInp.val()),
      form: ui.formSel.val()
    }
  },

  generateAndOpenSaver({begin, length, step, period, amplitude, offset, form}) {
    let data = []
    for (let x = begin; x <= begin + length; x += step) {
      let y = this.SIGNAL_FORMS[form]({x, period, amplitude, offset})
      data.push({x, y})
    }
    this.sendToCable({
      title: {
        name: `Generated ${form} signal`,
        description: `Period = ${period}, Amplitude = ${amplitude}`
      },
      data
    })
  },

  async importFromFile() {
    let data = await FileManager.readFile(this.ui.fileInp)
    this.sendToCable({
      title: {
        name: `Imported signal`,
        description: `Imported from file ${this.ui.fileInp.val()}`
      },
      data
    })
  },

  sendToCable(signal) {
    EVENTS.CLEAR_SIGNAL_STACK.trigger()
    Workspace.startModule({
      module: 'Cable',
      param: signal
    }).then()
  }

}