SignalGenerator = {

  VALIDATION_MSG: {
    number: 'Must be a number',
    greaterThanZero: 'Must be greater than zero'
  },

  FORM_VALIDATION: {
    length: (values) => {
      if (values.length <= 0) return SignalGenerator.VALIDATION_MSG.greaterThanZero
    },
    step: (values) => {
      if (values.step <= 0) return SignalGenerator.VALIDATION_MSG.greaterThanZero
      if (!SignalGenerator.FORM_VALIDATION.length(values) && values.length / values.step < 10)
        return 'Must be at least 10 times less than length'
    },
    period: (values) => {
      if (values.period <= 0) return SignalGenerator.VALIDATION_MSG.greaterThanZero
    },
    amplitude: (values) => {
      if (values.amplitude <= 0) return SignalGenerator.VALIDATION_MSG.greaterThanZero
    },
  },

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
    this.setSignalParamValuesFromCookie()
  },

  selectElements() {
    this.ui = {}
    this.ui.signalParamForm = {}
    this.ui.signalParamForm.begin = $('#SignalGeneratorBegin')
    this.ui.signalParamForm.beginValid = $('#SignalGeneratorBeginValid')
    this.ui.signalParamForm.length = $('#SignalGeneratorLength')
    this.ui.signalParamForm.lengthValid = $('#SignalGeneratorLengthValid')
    this.ui.signalParamForm.step = $('#SignalGeneratorStep')
    this.ui.signalParamForm.stepValid = $('#SignalGeneratorStepValid')
    this.ui.signalParamForm.period = $('#SignalGeneratorPeriod')
    this.ui.signalParamForm.periodValid = $('#SignalGeneratorPeriodValid')
    this.ui.signalParamForm.amplitude = $('#SignalGeneratorAmplitude')
    this.ui.signalParamForm.amplitudeValid = $('#SignalGeneratorAmplitudeValid')
    this.ui.signalParamForm.offset = $('#SignalGeneratorOffset')
    this.ui.signalParamForm.offsetValid = $('#SignalGeneratorOffsetValid')
    this.ui.signalParamForm.form = $('#SignalGeneratorForm')
    this.ui.saveBtn = $('#SignalGeneratorSave')
    this.ui.fileInp = $('#SignalGeneratorFile')
  },

  fillFormSelector() {
    for (let form in this.SIGNAL_FORMS) {
      this.ui.signalParamForm.form.append(`<option>${form}</option>`)
    }
  },

  initEvents() {
    this.ui.saveBtn.on('click', () => {
      let values = this.getSignalParamValues()
      if (this.validateSignalParamValues(values)) {
        CookieManager.writeObjectToCookie('SignalParamValues', values)
        this.generateAndOpenSaver(values)
      }
    })
    this.ui.fileInp.on('change', () => {
      this.importFromFile().then()
    })
  },

  getSignalParamValues() {
    let form = this.ui.signalParamForm
    return {
      begin: parseFloat(form.begin.val()),
      length: parseFloat(form.length.val()),
      step: parseFloat(form.step.val()),
      period: parseFloat(form.period.val()),
      amplitude: parseFloat(form.amplitude.val()),
      offset: parseFloat(form.offset.val()),
      form: form.form.val()
    }
  },

  setSignalParamValuesFromCookie() {
    let values = CookieManager.readObjectFromCookie('SignalParamValues')
    if (values) {
      let form = this.ui.signalParamForm
      form.begin.val(values.begin)
      form.length.val(values.length)
      form.step.val(values.step)
      form.period.val(values.period)
      form.amplitude.val(values.amplitude)
      form.offset.val(values.offset)
      form.form.val(values.form)
    }
  },

  validateSignalParamValues(values) {
    let validated = true
    for (let fieldName in values) {
      if (fieldName !== 'form') {
        let validationMsg = this.getFieldValidationMsg(fieldName, values)
        if (validationMsg) {
          this.markInvalid(fieldName, validationMsg)
          validated = false
        } else {
          this.removeInvalidIndication(fieldName)
        }
      }
    }
    return validated
  },

  getFieldValidationMsg(fieldName, values) {
    let value = values[fieldName]
    if (isNaN(value)) {
      return this.VALIDATION_MSG.number
    } else {
      let customFieldValidation = this.FORM_VALIDATION[fieldName]
      return customFieldValidation ? customFieldValidation(values) : ''
    }
  },

  markInvalid(fieldName, msg) {
    let form = this.ui.signalParamForm
    form[fieldName].addClass('is-invalid')
    form[fieldName + 'Valid'].html(msg)
  },

  removeInvalidIndication(fieldName) {
    let form = this.ui.signalParamForm
    form[fieldName].removeClass('is-invalid')
  },

  getFileName() {
    return this.ui.fileInp.val().replace(/C:\\fakepath\\/, '')
  },

  generateAndOpenSaver({begin, length, step, period, amplitude, offset, form}) {
    let data = []
    for (let x = begin; x < begin + length; x += step) {
      let y = this.SIGNAL_FORMS[form]({x, period, amplitude, offset})
      data.push({x, y})
    }
    this.sendToCable({
      name: `Generated ${form} signal`,
      description: `B = ${begin}, L = ${length}, S = ${step}, P = ${period}, A = ${amplitude}, O = ${offset} (${data.length} points)`,
      data
    })
  },

  async importFromFile() {
    let data = await FileManager.readFile(this.ui.fileInp)
    this.sendToCable({
      name: `Imported signal`,
      description: `Imported from file ${this.getFileName()}`,
      data
    })
  },

  sendToCable(signal) {
    EVENTS.INIT_SIGNAL_STACK.trigger('SignalGenerator')
    Workspace.startModule({
      module: 'Cable',
      param: signal
    }).then()
  }

}