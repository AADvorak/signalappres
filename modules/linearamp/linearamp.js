LinearAmp = {

  /**
   * @param {Signal} param
   */
  init(param) {
    this.signal = param
    this.selectElements()
    this.initEvents()
    this.setCoefficientValueFromCookie()
  },

  selectElements() {
    this.ui = {}
    this.ui.coefficientInp = $('#LinearAmpCoefficient')
    this.ui.coefficientInpValid = $('#LinearAmpCoefficientValid')
    this.ui.tranformBtn = $('#LinearAmpTransform')
  },

  initEvents() {
    this.ui.tranformBtn.on('click', () => {
      this.doTransform()
    })
  },

  setCoefficientValueFromCookie() {
    let coefficient = CookieManager.readValueFromCookie('LinearAmpCoefficient')
    if (coefficient) this.ui.coefficientInp.val(coefficient)
  },

  doTransform() {
    let coefficient = parseFloat(this.ui.coefficientInp.val())
    if (!this.validateCoefficient(coefficient)) return
    CookieManager.writeValueToCookie('LinearAmpCoefficient', coefficient)
    this.signal.description += `\nTransformed by linear amplifier with k = ${coefficient}`
    let data = this.signal.data
    for (let item of data) {
      item.y *= coefficient
    }
    Workspace.closeModule(this)
    Workspace.startModule({
      module: 'Cable',
      param: this.signal
    }).then()
  },

  validateCoefficient(coefficient) {
    let invalidMsg = ''
    if (isNaN(coefficient)) {
      invalidMsg = 'Should be a number'
    } else if (coefficient < 0) {
      invalidMsg = 'Must have positive value'
    }
    if (invalidMsg) {
      this.ui.coefficientInpValid.html(invalidMsg)
      this.ui.coefficientInp.addClass('is-invalid')
    }
    return !invalidMsg
  }

}
