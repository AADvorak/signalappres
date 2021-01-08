SignalGenerator = {

  SIGNAL_FORMS: {
    sin: ({x, period, amplitude, offset}) => {
      return offset + amplitude * Math.sin(x * 2 * 3.14 / period)
    },
    rect: ({x, period, amplitude, offset}) => {
      return Math.sin(x * 2 * 3.14 / period) >= 0 ? offset + amplitude : offset - amplitude
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
    Workspace.startModule({
      module: 'Cable',
      param: {
        title: {
          name: `Generated ${form} signal`,
          description: `Period = ${period}, Amplitude = ${amplitude}`
        },
        data
      },
    }).then()
  }

}